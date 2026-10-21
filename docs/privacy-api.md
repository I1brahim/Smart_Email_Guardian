# Stateless scanning

`POST /scan` accepts JSON with a non-empty string `email` (at most 50,000
characters; body at most 256 KiB). Responses contain only `spam` and `phishing`,
each with a canonical label, probabilities and description. Labels are `legit`,
`spam` and `phishing`. The API does not echo or save email contents, hashes,
snippets, predictions or request bodies. Responses use `Cache-Control: no-store`.
Never enable request-body logging in an upstream proxy.

`GET /history` returns 410. The old history manager is disabled. Existing files
are left untouched and are not read, served or copied into new container images.
An owner must separately approve any backup, retention or deletion on existing
deployments. This code does not remove data already stored elsewhere.

Set `CORS_ORIGINS` to comma-separated exact browser origins, e.g.
`http://localhost:3000,https://scanner.example.com`. Empty means no cross-origin
access. Wildcards, credentials and paths are rejected. CORS is browser policy,
not authentication: `/scan` remains public and stateless. Configure rate and
concurrency limits at the ingress before exposing it publicly.

Run from the root: `python -m back_end_flask.app`. Models default to the module's
`models` directory; `MODEL_DIR` may select an absolute directory of trusted
model/vectorizer pairs. Pickle loading executes code: only owner-reviewed
artifacts belong there. Version mismatches fail closed. `/health` checks
liveness; `/ready` checks artifact loading, not classification quality.

Build: `docker build -t email-guardian back_end_flask`. Pass environment at
runtime; no `.env` or history is packaged. Gunicorn runs as a non-root user.
No deployment is triggered here.
