# Email Guardian

A stateless Flask scanner and a React interface for spam and phishing model
predictions. The service does not store email contents or expose scan history.

## Local setup

Use Python 3.13 and Node 24. From the repository root:

```sh
python -m venv .venv
# Activate .venv using your shell's activation command.
python -m pip install -r requirements.txt
python -m back_end_flask.app
```

In another terminal:

```sh
cd front_end_react
npm ci
npm start
```

Open http://localhost:3000. Vite proxies `/scan` to the local API on port 5000.
The backend binds to loopback for local development. For an approved container
deployment, use the Dockerfile's Gunicorn entry point.

## Verification

```sh
python -m pytest -q
cd front_end_react
npm test
npm run build
```

CI checks Python on Windows and Linux, the browser components, production build,
and the backend container. It does not deploy or publish model artifacts.

For separate frontend/API origins, set `VITE_API_BASE_URL` at frontend build time
and set an explicit backend `CORS_ORIGINS` allowlist at runtime. Configure the
hosting CSP `connect-src` to permit that API origin. No production URL is baked
into this source. Build output remains `front_end_react/build`.

The API response no longer includes `email` and `/history` now returns 410.
Deploy the frontend and API changes together after owner review; the old UI
expects echoed contents. Existing deployed data is not removed by these changes.
See [privacy and API behavior](docs/privacy-api.md).

For repeatable model training, metrics and fingerprinted artifacts, see
[ML evaluation](docs/ml-evaluation.md). Generated weights require separate review
before promotion; the checked-in runtime weights remain unchanged.

The notebooks and `docs/README.md` are historical project records; this README
and the executable tests describe the supported setup.
