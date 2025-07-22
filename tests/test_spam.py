import joblib

model = joblib.load("/home/ibrahim/Desktop/email_guardian/ai/spam_model.pkl")
vectorizer = joblib.load("/home/ibrahim/Desktop/email_guardian/ai/spam_vectorizer.pkl")

test_emails = [
    "Congratulations! You won a free iPhone. Click here to claim now!",
    "Hey, are we meeting for lunch today?",
    "Urgent: Your password has been compromised. Reset it immediately!",
]

test_vec = vectorizer.transform(test_emails)

predictions = model.predict(test_vec)
proba = model.predict_proba(test_vec)[0]
confidence = max(proba) * 100

for email, label in zip(test_emails, predictions):
    print(f"Email: {email}\nPredicted label: {label}\n (Confidence: {confidence:.2f}%)")
