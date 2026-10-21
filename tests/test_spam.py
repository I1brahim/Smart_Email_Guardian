from back_end_flask.inference import ModelStore


def test_spam_artifact_contract_from_any_directory(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    result = ModelStore().predict('Are we meeting for lunch today?')['spam']
    assert result['label'] in {'spam', 'legit'}
    assert set(result['probabilities']) == {'spam', 'legit'}
    assert abs(sum(result['probabilities'].values()) - 1) < 1e-6
