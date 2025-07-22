from flask import Flask, request, jsonify
import joblib
import json
import os
from flask_cors import CORS
from markupsafe import escape

app = Flask(__name__)
CORS(app)  

spam_model = joblib.load("/home/ibrahim/Desktop/email_guardian/back_end_flask/models/spam_model.pkl")
spam_vectorizer = joblib.load("/home/ibrahim/Desktop/email_guardian/back_end_flask/models/spam_vectorizer.pkl")

phishing_model = joblib.load("/home/ibrahim/Desktop/email_guardian/back_end_flask/models/phishing_model.pkl")
phishing_vectorizer = joblib.load("/home/ibrahim/Desktop/email_guardian/back_end_flask/models/phishing_vectorizer.pkl")

history_file_path = "/home/ibrahim/Desktop/email_guardian/back_end_flask/history.json"

if os.path.exists(history_file_path):
    with open(history_file_path, "r") as f:
        try:
            history = json.load(f)
        except json.JSONDecodeError:
            history = []
else:
    history = []




@app.route('/scan', methods=['POST'])
def scan_email():
    data = request.json
    email_text = data.get("email", "")
    
    if not email_text:
        return jsonify({"error": "No email text provided"}), 400

    # Sanitize for safe storage and display
    sanitized_email = escape(email_text)

    # Use original for prediction, sanitized for output
    spam_vec = spam_vectorizer.transform([email_text])
    phishing_vec = phishing_vectorizer.transform([email_text])

    spam_pred = spam_model.predict(spam_vec)[0]
    spam_prob = max(spam_model.predict_proba(spam_vec)[0])

    phishing_pred = phishing_model.predict(phishing_vec)[0]
    phishing_prob = max(phishing_model.predict_proba(phishing_vec)[0])

    if spam_prob > phishing_prob:
        result = {
            "type": "spam",
            "label": spam_pred,
            "probability": spam_prob,
            "email": sanitized_email   # <<-- use escaped version here
        }
    else:
        result = {
            "type": "phishing",
            "label": phishing_pred,
            "probability": phishing_prob,
            "email": sanitized_email   # <<-- use escaped version here
        }

    history.append(result)
    with open(history_file_path, "w") as f:
        json.dump(history, f, indent=2)

    return jsonify(result)


@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



