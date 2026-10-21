"""The deployed Function must use the same reviewed code and model artifacts."""

import importlib
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "back_end_flask"
FRONTEND = ROOT / "front_end_react"
TARGET = FRONTEND / "guardian_backend"


def test_vercel_mirror_matches_canonical_runtime():
    for name in ("app.py", "inference.py"):
        assert (TARGET / name).read_bytes() == (SOURCE / name).read_bytes()
    assert (FRONTEND / "requirements.txt").read_bytes() == (SOURCE / "requirements.txt").read_bytes()
    for name in (
        "spam_model.pkl", "spam_vectorizer.pkl",
        "phishing_model.pkl", "phishing_vectorizer.pkl",
    ):
        assert (TARGET / "models" / name).read_bytes() == (SOURCE / "models" / name).read_bytes()


def test_vercel_route_scans_without_persisting_contents(monkeypatch):
    monkeypatch.syspath_prepend(str(FRONTEND))
    app = importlib.import_module("api.scan").app
    app.config.update(TESTING=True)
    client = app.test_client()
    response = client.post("/api/scan", json={"email": "Meeting tomorrow at noon."})
    assert response.status_code == 200
    assert set(response.json) == {"spam", "phishing"}
    assert "Meeting tomorrow at noon." not in response.get_data(as_text=True)
    assert response.headers["Cache-Control"] == "no-store"
    assert client.get("/api/scan").status_code == 405


def test_vercel_config_routes_same_origin_to_function():
    config = json.loads((FRONTEND / "vercel.json").read_text(encoding="utf-8"))
    assert {"source": "/scan", "destination": "/api/scan"} in config["rewrites"]
    assert config["functions"]["api/scan.py"]["includeFiles"] == "guardian_backend/**"
    assert (FRONTEND / ".python-version").read_text(encoding="utf-8").strip() == "3.13"
    assert (ROOT / ".python-version").read_text(encoding="utf-8").strip() == "3.13"
