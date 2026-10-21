"""Reproducible training/evaluation on local, fingerprinted datasets.

Outputs never overwrite an existing directory or the checked-in runtime models.
Reports contain metrics and hashes, never source messages.
"""
import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path
import platform
import subprocess
import unicodedata

import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (average_precision_score, classification_report,
                             confusion_matrix, roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = {
    'spam': ('v2', 'v1', {'spam': 'spam', 'ham': 'legit'}, 'latin-1'),
    'phishing': ('Email Text', 'Email Type', {'phishing email': 'phishing', 'safe email': 'legit'}, 'utf-8'),
}


def digest_file(path):
    with Path(path).open('rb') as source:
        return hashlib.file_digest(source, 'sha256').hexdigest()


def text_key(text):
    normalized = ' '.join(unicodedata.normalize('NFKC', text).casefold().split())
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def clean_data(frame, category):
    text_col, label_col, labels, _ = SCHEMA[category]
    if not {text_col, label_col}.issubset(frame.columns):
        raise ValueError('Dataset does not match expected columns')
    rows = frame[[text_col, label_col]].rename(columns={text_col: 'text', label_col: 'label'}).copy()
    input_rows = len(rows)
    rows = rows.dropna(subset=['text', 'label'])
    rows['text'] = rows['text'].astype(str)
    rows = rows[rows['text'].str.strip() != ''].copy()
    rows['label'] = rows['label'].astype(str).str.strip().str.lower()
    if not set(rows['label']).issubset(labels):
        raise ValueError('Dataset contains unknown labels')
    rows['label'] = rows['label'].map(labels)
    rows['key'] = rows['text'].map(text_key)
    conflicts = rows.groupby('key')['label'].nunique()
    conflicts = set(conflicts[conflicts > 1].index)
    conflicting_rows = int(rows['key'].isin(conflicts).sum())
    rows = rows[~rows['key'].isin(conflicts)].copy()
    before_dedup = len(rows)
    rows = rows.drop_duplicates('key').sort_values('key').reset_index(drop=True)
    if set(rows['label']) != {'legit', category} or rows['label'].value_counts().min() < 10:
        raise ValueError('Each class needs at least 10 unique, non-conflicting messages')
    return rows, {'input_rows': input_rows, 'usable_rows': len(rows),
                  'conflicting_rows_removed': conflicting_rows,
                  'duplicates_removed': before_dedup - len(rows),
                  'missing_or_blank_removed': input_rows - conflicting_rows - before_dedup}


def split_data(rows, seed):
    train, held_out = train_test_split(rows, test_size=.4, stratify=rows['label'], random_state=seed)
    validation, test = train_test_split(held_out, test_size=.5, stratify=held_out['label'], random_state=seed)
    splits = {'train': train, 'validation': validation, 'test': test}
    keys = {name: set(frame['key']) for name, frame in splits.items()}
    if keys['train'] & keys['validation'] or keys['train'] & keys['test'] or keys['validation'] & keys['test']:
        raise ValueError('Duplicate messages cross data splits')
    return splits


def make_pipeline(category, seed):
    if category == 'spam':
        return Pipeline([('vectorizer', CountVectorizer()), ('model', MultinomialNB())])
    return Pipeline([('vectorizer', TfidfVectorizer(max_features=5000)),
                     ('model', LogisticRegression(solver='liblinear', max_iter=1000, random_state=seed))])


def metrics(model, texts, labels, category):
    predicted = model.predict(texts)
    positive = (np.asarray(labels) == category).astype(int)
    scores = model.predict_proba(texts)[:, list(model.classes_).index(category)]
    return {
        'classification_report': classification_report(labels, predicted, labels=['legit', category], output_dict=True, zero_division=0),
        'confusion_matrix_labels': ['legit', category],
        'confusion_matrix': confusion_matrix(labels, predicted, labels=['legit', category]).tolist(),
        'roc_auc': float(roc_auc_score(positive, scores)),
        'average_precision': float(average_precision_score(positive, scores)),
        'prediction_sha256': hashlib.sha256(json.dumps(list(predicted)).encode()).hexdigest(),
    }


def evaluate_dataset(category, path, output, seed):
    frame = pd.read_csv(path, encoding=SCHEMA[category][3])
    rows, cleaning = clean_data(frame, category)
    splits = split_data(rows, seed)
    train = splits['train']
    pipeline = make_pipeline(category, seed)
    pipeline.fit(train['text'], train['label'])
    baseline = DummyClassifier(strategy='most_frequent').fit(train['text'], train['label'])
    result = {'dataset_sha256': digest_file(path), 'cleaning': cleaning, 'seed': seed,
              'configuration': {'split': '60/20/20 stratified', 'threshold': 'classifier default',
                                'algorithm': type(pipeline['model']).__name__,
                                'hyperparameters': pipeline['model'].get_params(),
                                'vectorizer': type(pipeline['vectorizer']).__name__},
              'splits': {}, 'evaluation': {}}
    for name, data in splits.items():
        result['splits'][name] = {
            'count': len(data), 'classes': {key: int(value) for key, value in data['label'].value_counts().items()},
            'keys_sha256': hashlib.sha256('\n'.join(sorted(data['key'])).encode()).hexdigest(),
        }
        if name != 'train':
            result['evaluation'][name] = {
                'model': metrics(pipeline, data['text'], data['label'], category),
                'baseline': metrics(baseline, data['text'], data['label'], category),
            }
    # Export the exact training-split estimator that was evaluated, without refit.
    # scikit-learn caches id(stop_words), a process-specific memory address.
    # This cache is rebuilt on transform and must not affect artifact hashes.
    pipeline['vectorizer'].__dict__.pop('_stop_words_id', None)
    paths = [output / f'{category}_model.pkl', output / f'{category}_vectorizer.pkl']
    for component, artifact in zip(['model', 'vectorizer'], paths, strict=True):
        joblib.dump(pipeline[component], artifact)
    result['artifacts'] = {artifact.name: digest_file(artifact) for artifact in paths}
    return result


def run(output, seed=42, spam_path=None, phishing_path=None):
    output = Path(output)
    # Never silently overwrite an owner's data or deployed model directory.
    output.mkdir(parents=True, exist_ok=False)
    try:
        revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
        dirty = bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT, text=True).strip())
    except (OSError, subprocess.CalledProcessError):
        revision, dirty = 'unavailable', True
    report = {
        'schema_version': 1, 'source_revision': revision, 'source_dirty': dirty,
        'script_sha256': digest_file(Path(__file__)),
        'python': platform.python_version(),
        'environment': {name: importlib.metadata.version(name) for name in ['scikit-learn', 'numpy', 'scipy', 'pandas', 'joblib']},
        'limitations': [
            'SMS spam data is not representative of all real email.',
            'Normalization removes exact/case/whitespace duplicates, not all near duplicates or shared templates.',
            'No time-based or external holdout is available; these are internal dataset estimates.',
            'Scores are not calibrated probabilities of user safety.',
        ],
        'datasets': {},
    }
    datasets = {'spam': spam_path or ROOT / 'data/sms_spam/spam.csv',
                'phishing': phishing_path or ROOT / 'data/Phishing_Email.csv'}
    for category, path in datasets.items():
        report['datasets'][category] = evaluate_dataset(category, Path(path), output, seed)
    (output / 'report.json').write_text(json.dumps(report, indent=2, sort_keys=True, allow_nan=False) + '\n', encoding='utf-8')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--spam-data', type=Path)
    parser.add_argument('--phishing-data', type=Path)
    args = parser.parse_args()
    report = run(args.output, args.seed, args.spam_data, args.phishing_data)
    for category, result in report['datasets'].items():
        scores = result['evaluation']['test']['model']['classification_report']
        print(f"{category}: test macro F1={scores['macro avg']['f1-score']:.4f}, rows={result['cleaning']['usable_rows']}")


if __name__ == '__main__':
    main()
