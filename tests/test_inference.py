from unittest.mock import Mock

import pytest
from sklearn.exceptions import InconsistentVersionWarning

from back_end_flask.inference import ModelStore, classify


@pytest.mark.parametrize('raw,expected', [('safe email', 'legit'), ('phishing email', 'phishing')])
def test_original_phishing_labels_are_canonical(raw, expected):
    model = Mock(classes_=['safe email', 'phishing email'])
    model.predict.return_value = [raw]
    model.predict_proba.return_value = [[.2, .8]]
    result = classify(model, Mock(), 'hello', 'phishing')
    assert result['label'] == expected
    assert result['probabilities'] == {'legit': .2, 'phishing': .8}


def test_unknown_label_fails_closed():
    model = Mock()
    model.predict.return_value = ['unknown']
    with pytest.raises(KeyError):
        classify(model, Mock(), 'hello', 'spam')


def test_mismatched_artifact_version_fails_closed(monkeypatch):
    import warnings
    def load(_):
        warnings.warn(InconsistentVersionWarning(estimator_name='Test', current_sklearn_version='1.7.1', original_sklearn_version='0.1'))
    monkeypatch.setattr('back_end_flask.inference.joblib.load', load)
    store = ModelStore()
    with pytest.raises(InconsistentVersionWarning):
        store.load()
    assert store._models is None
