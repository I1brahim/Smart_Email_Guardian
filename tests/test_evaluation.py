import json

import joblib
import pandas as pd
import pytest

from ai.evaluate import clean_data, make_pipeline, run, split_data, text_key
from back_end_flask.inference import ModelStore


def fixture_data():
    return pd.DataFrame({'v1': ['ham'] * 25 + ['spam'] * 25,
                         'v2': [f'Ordinary meeting agenda {i}' for i in range(25)] +
                               [f'Win free prize money {i}' for i in range(25)]})


def test_deduplication_and_conflict_removal_before_split():
    frame = fixture_data()
    frame = pd.concat([frame, pd.DataFrame({'v1': ['ham', 'spam', 'ham'],
        'v2': ['  ORDINARY   meeting agenda 0 ', 'Ordinary meeting agenda 1', '']})])
    rows, report = clean_data(frame, 'spam')
    assert report['duplicates_removed'] == 1
    assert report['conflicting_rows_removed'] == 2
    assert report['missing_or_blank_removed'] == 1
    assert text_key('Ordinary meeting agenda 1') not in set(rows['key'])
    splits = split_data(rows, 42)
    keys = [set(data['key']) for data in splits.values()]
    assert not (keys[0] & keys[1] or keys[0] & keys[2] or keys[1] & keys[2])
    assert set.union(*keys) == set(rows['key'])


def test_vectorizer_learns_only_training_text():
    pipeline = make_pipeline('spam', 42)
    pipeline.fit(['ordinary meeting', 'win prize', 'meeting tomorrow', 'free prize'], ['legit', 'spam', 'legit', 'spam'])
    pipeline.predict(['holdoutonlyword'])
    assert 'holdoutonlyword' not in pipeline['vectorizer'].vocabulary_


def test_unknown_labels_and_tiny_datasets_rejected():
    with pytest.raises(ValueError, match='unknown labels'):
        clean_data(pd.DataFrame({'v1': ['unknown'], 'v2': ['hello']}), 'spam')
    with pytest.raises(ValueError, match='at least 10'):
        clean_data(fixture_data().iloc[:3], 'spam')


def test_repeatable_outputs_and_runtime_compatibility(tmp_path):
    spam = fixture_data()
    phishing = spam.rename(columns={'v1': 'Email Type', 'v2': 'Email Text'})
    phishing['Email Type'] = phishing['Email Type'].map({'ham': 'Safe Email', 'spam': 'Phishing Email'})
    spam_file, phishing_file = tmp_path / 'spam.csv', tmp_path / 'phishing.csv'
    spam.to_csv(spam_file, index=False, encoding='latin-1')
    phishing.to_csv(phishing_file, index=False)
    first = run(tmp_path / 'first', spam_path=spam_file, phishing_path=phishing_file)
    second = run(tmp_path / 'second', spam_path=spam_file, phishing_path=phishing_file)
    assert first == second
    vectorizer = joblib.load(tmp_path / 'first/spam_vectorizer.pkl')
    assert '_stop_words_id' not in vars(vectorizer)
    assert 'Ordinary meeting agenda' not in json.dumps(first)
    result = ModelStore(tmp_path / 'first').predict('ordinary meeting agenda')
    assert set(result) == {'spam', 'phishing'}
    with pytest.raises(FileExistsError):
        run(tmp_path / 'first', spam_path=spam_file, phishing_path=phishing_file)
