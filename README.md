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

The existing Vercel frontend project deploys from `front_end_react/`. Its `/scan`
route now reaches a Python Function in that same project. The function uses a
checked-in copy of the reviewed Flask runtime and model files. After changing
anything in `back_end_flask/app.py`, `inference.py`, `models/`, or its pinned
requirements, run `python scripts/sync_vercel_backend.py`; CI checks that the
Vercel copy remains identical. Python 3.13 is selected for the deployed model
artifacts. No external backend address or cross-origin permission is needed for
the normal deployment.

For a separately hosted API, set `VITE_API_BASE_URL` at frontend build time and
set an explicit backend `CORS_ORIGINS` allowlist at runtime. Configure the
hosting CSP `connect-src` to permit that API origin. Build output remains
`front_end_react/build`.

The API response no longer includes `email` and `/history` now returns 410.
The Vercel frontend and Python Function deploy from the same Git commit.
Existing data at any retired backend is not removed by these changes.
See [privacy and API behavior](docs/privacy-api.md).

For repeatable model training, metrics and fingerprinted artifacts, see
[ML evaluation](docs/ml-evaluation.md). Generated weights require separate review
before promotion; the checked-in runtime weights remain unchanged.

The notebooks and `docs/README.md` are historical project records; this README
and the executable tests describe the supported setup.
