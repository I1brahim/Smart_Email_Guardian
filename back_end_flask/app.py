from flask import Flask, request, jsonify
import joblib
import json
import os
from flask_cors import CORS
from markupsafe import escape

app = Flask(__name__)
CORS(app)  

spam_model = joblib.load("./models/spam_model.pkl")
spam_vectorizer = joblib.load("./models/spam_vectorizer.pkl")

phishing_model = joblib.load("./models/phishing_model.pkl")
phishing_vectorizer = joblib.load("./models/phishing_vectorizer.pkl")

history_file_path = "./history.json"

if os.path.exists(history_file_path):
    with open(history_file_path, "r") as f:
        try:
            history = json.load(f)
        except json.JSONDecodeError:
            history = []
else:
    history = []

def get_description(label, email_text):
    label = label.lower()
    if label == "spam":
        return "This email contains patterns commonly associated with spam, such as promotional language or suspicious links."
    elif label == "phishing":
        return "This email attempts to trick you into providing sensitive information or clicking on malicious links."
    elif label in ["not spam", "not phishing", "legit"]:
        return "No suspicious patterns detected. The email appears legitimate."
    else:
        return "Unable to determine the nature of this email."

@app.route('/scan', methods=['POST'])
def scan_email():
    data = request.json
    email_text = data.get("email", "")
    
    if not email_text:
        return jsonify({"error": "No email text provided"}), 400

    sanitized_email = escape(email_text)

    spam_vec = spam_vectorizer.transform([email_text])
    phishing_vec = phishing_vectorizer.transform([email_text])

    spam_probs = spam_model.predict_proba(spam_vec)[0]
    spam_labels = spam_model.classes_

    phishing_probs = phishing_model.predict_proba(phishing_vec)[0]
    phishing_labels = phishing_model.classes_

    spam_pred = spam_model.predict(spam_vec)[0]
    phishing_pred = phishing_model.predict(phishing_vec)[0]

    result = {
        "spam": {
            "label": spam_pred,
            "probabilities": dict(zip(spam_labels, spam_probs)),
            "description": get_description(spam_pred, email_text)
        },
        "phishing": {
            "label": phishing_pred,
            "probabilities": dict(zip(phishing_labels, phishing_probs)),
            "description": get_description(phishing_pred, email_text)
        },
        "email": sanitized_email
    }

    history.append(result)
    with open(history_file_path, "w") as f:
        json.dump(history, f, indent=2)

    return jsonify(result)

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(history)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)



