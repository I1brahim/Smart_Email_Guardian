"""Stateless HTTP API. Email text is used in memory only during inference."""
import os
from urllib.parse import urlsplit

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

if __package__:
    from .inference import ModelStore
else:
    from inference import ModelStore


def allowed_origins(value):
    origins = [origin.strip() for origin in value.split(',') if origin.strip()]
    for origin in origins:
        parsed = urlsplit(origin)
        if (parsed.scheme not in {'http', 'https'} or not parsed.hostname
                or parsed.username or parsed.password or parsed.path
                or parsed.query or parsed.fragment or '*' in origin):
            raise ValueError('CORS_ORIGINS must contain explicit HTTP(S) origins')
    return origins


def create_app(config=None, predictor=None):
    app = Flask(__name__)
    app.config.from_mapping(
        MAX_CONTENT_LENGTH=256 * 1024, MAX_EMAIL_CHARS=50000,
        CORS_ORIGINS=os.environ.get('CORS_ORIGINS', ''),
        MODEL_DIR=os.environ.get('MODEL_DIR'),
    )
    app.config.update(config or {})
    origins = allowed_origins(app.config['CORS_ORIGINS'])
    if origins:
        CORS(app, resources={r'/scan': {'origins': origins}},
             methods=['POST', 'OPTIONS'], allow_headers=['Content-Type'],
             supports_credentials=False, always_send=False)
    store = predictor if predictor is not None else ModelStore(app.config['MODEL_DIR'])
    app.extensions['predictor'] = store

    @app.after_request
    def protect_response(response):
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @app.errorhandler(HTTPException)
    def http_error(error):
        return jsonify(error=error.description), error.code

    @app.post('/scan')
    def scan_email():
        if not request.is_json:
            return jsonify(error='Content-Type must be application/json'), 415
        data = request.get_json()
        if not isinstance(data, dict):
            return jsonify(error='Expected a JSON object'), 400
        email = data.get('email')
        if not isinstance(email, str) or not email.strip():
            return jsonify(error='email must be a non-empty string'), 400
        if len(email) > app.config['MAX_EMAIL_CHARS']:
            return jsonify(error='Email text exceeds the character limit'), 413
        try:
            return jsonify(store.predict(email))
        except Exception:
            # Library exceptions can include input text. Never log them.
            app.logger.error('Scan inference unavailable')
            return jsonify(error='Scanner temporarily unavailable'), 503

    @app.get('/history')
    def history_retired():
        return jsonify(error='Server scan history is disabled for privacy'), 410

    @app.get('/health')
    def health():
        return jsonify(status='ok')

    @app.get('/ready')
    def ready():
        try:
            store.load()
        except Exception:
            return jsonify(status='unavailable'), 503
        return jsonify(status='ready')

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.environ.get('PORT', 5000)))
