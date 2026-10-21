from back_end_flask.inference import ModelStore


def test_phishing_artifact_contract_from_any_directory(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    result = ModelStore().predict('Please review the meeting agenda.')['phishing']
    assert result['label'] in {'phishing', 'legit'}
    assert set(result['probabilities']) == {'phishing', 'legit'}
