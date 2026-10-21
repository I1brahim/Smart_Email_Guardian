# Runtime and evaluation boundaries

```text
React form -> scanEmail (validated response) -> POST /scan
    -> Flask input limits -> ModelStore -> vectorizers + estimators
    -> canonical labels/probabilities -> React results in memory
```

`back_end_flask/app.py` owns HTTP validation, CORS, error responses and health
checks. `create_app` accepts an injected predictor so API tests can exercise
validation and failures without coupling to weights. It never reads or writes
scan history.

`back_end_flask/inference.py` owns trusted artifact loading, a thread-safe lazy
cache, label normalization and JSON-safe probability values. Both repository
root and backend-directory launches resolve the same model paths. Models are
not loaded at import time. `/ready` forces loading before traffic is admitted.

`front_end_react/src/api.js` owns the HTTP contract and validation. `App.jsx`
owns user input, request cancellation, result rendering and the bounded,
tab-local result list. Styling is in CSS so the production build does not rely
on inline style attributes or a baked-in production API address.

`ai/evaluate.py` is an offline workflow with explicit local inputs and a new
output directory. It cleans data before splitting, fits a training-only Pipeline,
exports the evaluated pair, and emits fingerprints and metrics without source
messages. It does not update runtime weights or deploy anything.

CI separates backend/API, frontend/build and repeatability checks. Backend
checks include real artifact inference; unit tests also inject failures. The
container job checks readiness, UID, `.env`/history exclusion and a scan response.
ML outputs are review artifacts, not release or deployment inputs.
