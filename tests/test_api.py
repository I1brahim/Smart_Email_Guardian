import json
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import Mock

import pytest

from back_end_flask.app import create_app
from back_end_flask.history_manager import HistoryManager


@pytest.fixture
def predictor():
    return Mock(predict=Mock(return_value={
        'spam': {'label': 'legit', 'probabilities': {'legit': .9, 'spam': .1}},
        'phishing': {'label': 'legit', 'probabilities': {'legit': .8, 'phishing': .2}},
    }))


@pytest.fixture
def client(predictor):
    return create_app({'TESTING': True, 'CORS_ORIGINS': 'https://scanner.example'}, predictor).test_client()


@pytest.mark.parametrize('payload', [None, [], True, 12, 'text', {}, {'email': None},
                                   {'email': []}, {'email': 1}, {'email': ''}, {'email': ' \n '}])
def test_invalid_inputs_do_not_run_inference(client, predictor, payload):
    response = client.post('/scan', data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 400
    assert response.is_json
    predictor.predict.assert_not_called()


def test_bad_json_and_content_type(client):
    assert client.post('/scan', data='{', content_type='application/json').status_code == 400
    assert client.post('/scan', data='email=hello').status_code == 415


def test_limits(client, predictor):
    assert client.post('/scan', json={'email': 'x' * 50001}).status_code == 413
    assert client.post('/scan', data='x' * (256 * 1024 + 1), content_type='application/json').status_code == 413
    predictor.predict.assert_not_called()


def test_stateless_scan_preserves_existing_data(client, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    legacy = tmp_path / 'history.json'
    legacy.write_text('[{"email":"existing private content"}]')
    before = legacy.read_bytes()
    response = client.post('/scan', json={'email': 'PRIVATE_EMAIL_MARKER'})
    assert response.status_code == 200
    assert b'PRIVATE_EMAIL_MARKER' not in response.data
    assert 'email' not in response.json
    assert response.headers['Cache-Control'] == 'no-store'
    assert legacy.read_bytes() == before
    assert list(tmp_path.iterdir()) == [legacy]
    retired = client.get('/history')
    assert retired.status_code == 410
    assert b'existing private content' not in retired.data
    with pytest.raises(RuntimeError, match='disabled'):
        HistoryManager(tmp_path / 'history')
    assert not (tmp_path / 'history').exists()


def test_cors_allowlist_and_preflight(client):
    response = client.options('/scan', headers={'Origin': 'https://scanner.example',
        'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'Content-Type'})
    assert response.headers['Access-Control-Allow-Origin'] == 'https://scanner.example'
    assert 'Access-Control-Allow-Credentials' not in response.headers
    assert 'POST' in response.headers['Access-Control-Allow-Methods']
    for origin in ('https://evil.example', 'https://scanner.example.evil.example', 'null'):
        response = client.post('/scan', json={'email': 'hello'}, headers={'Origin': origin})
        assert 'Access-Control-Allow-Origin' not in response.headers
    assert 'Access-Control-Allow-Origin' not in client.get('/history', headers={'Origin': 'https://scanner.example'}).headers


def test_cors_disabled_by_default(predictor, monkeypatch):
    monkeypatch.delenv('CORS_ORIGINS', raising=False)
    client = create_app(predictor=predictor).test_client()
    assert 'Access-Control-Allow-Origin' not in client.post('/scan', json={'email': 'hi'}, headers={'Origin': 'https://scanner.example'}).headers


@pytest.mark.parametrize('origin', ['*', 'https://*.example', 'null', 'file:///tmp', 'https://user:pass@example.com', 'https://example.com/path'])
def test_unsafe_cors_config_rejected(origin):
    with pytest.raises(ValueError):
        create_app({'CORS_ORIGINS': origin})


def test_inference_errors_do_not_disclose_input_or_paths(client, predictor, caplog):
    predictor.predict.side_effect = ValueError('SECRET_EMAIL_MARKER /private/model.pkl')
    response = client.post('/scan', json={'email': 'SECRET_EMAIL_MARKER'})
    assert response.status_code == 503
    assert 'SECRET_EMAIL_MARKER' not in response.text + caplog.text
    assert '/private/' not in response.text + caplog.text


def test_health_readiness_and_missing_artifacts(tmp_path):
    client = create_app({'TESTING': True, 'MODEL_DIR': str(tmp_path)}).test_client()
    assert client.get('/health').status_code == 200
    assert client.get('/ready').status_code == 503
    assert client.post('/scan', json={'email': 'hello'}).status_code == 503


def test_concurrent_scans_with_real_models():
    app = create_app({'TESTING': True})
    def scan(_):
        with app.test_client() as client:
            return client.post('/scan', json={'email': 'Meeting tomorrow at noon.'})
    with ThreadPoolExecutor(max_workers=4) as executor:
        responses = list(executor.map(scan, range(12)))
    assert all(response.status_code == 200 for response in responses)
    assert all(response.json == responses[0].json for response in responses)
    assert app.test_client().get('/ready').status_code == 200
