# Repeatable ML evaluation

Install `requirements-ml.txt` (or root `requirements.txt`) with Python 3.13.
Run from the repository root:

```sh
python -m ai.evaluate --output artifacts/run-42 --seed 42
```

The command reads the checked-in local CSVs; it makes no network dataset calls.
Optional `--spam-data` and `--phishing-data` select explicit snapshots with the
same column schema. Output must be a new directory. Existing models, datasets
and user history are never overwritten. Newly generated model files are ignored
by Git and are not automatically deployed or copied into runtime models.

The report records SHA-256 fingerprints for data, script, split memberships,
predictions and exported artifacts; source revision/dirty state; dependency
versions; class counts; algorithm configuration; validation and test metrics.
It never includes message contents. A repeated run with the same snapshot, seed,
script and environment must produce identical reports. Reproducibility across
different numerical libraries or platforms is not promised.

Cleaning removes missing/blank rows, excludes normalized messages with conflicting
labels, and deduplicates case/whitespace/Unicode-normalized text before splitting.
Train/validation/test are stratified 60/20/20 with seed 42. Vectorizers fit only
the training split, through a Pipeline. Hyperparameters are fixed in the script;
validation and test sets never train the exported estimator. The report compares
classification precision/recall/F1, confusion matrices, ROC AUC and average
precision against a most-frequent-class baseline. It makes no tuning decisions
using the test set. The exported model/vectorizer are the exact evaluated pair.

Limitations: SMS spam differs from full emails; template/near-duplicate leakage
may remain; there is no independent time or external holdout. Source data
provenance/licensing and representativeness need owner review before release.
These metrics do not validate the old shipped artifacts and do not demonstrate
a production improvement. Scores are not calibrated safety probabilities.

An owner can review a generated pair with `MODEL_DIR` in an isolated environment.
Production promotion requires separate approval, a data/license review,
external evaluation, and a model-version decision. scikit-learn stays at 1.7.1
to match existing artifacts. Upgrading that runtime requires retraining and
validation; cross-version unpickling is intentionally rejected.
