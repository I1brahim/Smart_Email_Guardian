"""Load trusted local artifacts once, independently of the working directory."""
import math
from pathlib import Path
from threading import Lock
import warnings

import joblib
from sklearn.exceptions import InconsistentVersionWarning

LABELS = {
    'spam': {'spam': 'spam', 'legit': 'legit', 'ham': 'legit', 'not spam': 'legit'},
    'phishing': {'phishing': 'phishing', 'phishing email': 'phishing',
                 'safe email': 'legit', 'not phishing': 'legit', 'legit': 'legit'},
}
DESCRIPTIONS = {
    'spam': 'The model classified this message as spam.',
    'phishing': 'The model classified this message as phishing.',
    'legit': 'The model detected no threat in this category; this is not a safety guarantee.',
}


def classify(model, vectorizer, text, category):
    features = vectorizer.transform([text])
    label = LABELS[category][str(model.predict(features)[0]).strip().lower()]
    probabilities = {}
    for raw, probability in zip(model.classes_, model.predict_proba(features)[0], strict=True):
        key = LABELS[category][str(raw).strip().lower()]
        value = float(probability)
        if not math.isfinite(value) or not 0 <= value <= 1:
            raise ValueError('Invalid probability')
        probabilities[key] = probabilities.get(key, 0) + value
    if set(probabilities) != {'legit', category} or not math.isclose(sum(probabilities.values()), 1, abs_tol=1e-6):
        raise ValueError('Invalid class probabilities')
    return {'label': label, 'probabilities': probabilities, 'description': DESCRIPTIONS[label]}


class ModelStore:
    def __init__(self, directory=None):
        self.directory = Path(directory).resolve() if directory else Path(__file__).resolve().parent / 'models'
        self._models = None
        self._lock = Lock()

    def load(self):
        with self._lock:
            if self._models is None:
                with warnings.catch_warnings():
                    warnings.simplefilter('error', InconsistentVersionWarning)
                    loaded = {
                        category: (
                            joblib.load(self.directory / f'{category}_model.pkl'),
                            joblib.load(self.directory / f'{category}_vectorizer.pkl'),
                        ) for category in ('spam', 'phishing')
                    }
                self._models = loaded
        return self._models

    def predict(self, email):
        return {category: classify(model, vectorizer, email, category)
                for category, (model, vectorizer) in self.load().items()}
