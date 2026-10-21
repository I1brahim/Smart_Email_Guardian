"""Copy the reviewed Flask runtime into Vercel's existing frontend root.

Vercel builds only front_end_react/ for this project. Keep the API package there
byte-for-byte identical to the canonical Flask source and checked-in models.
"""

import json
from pathlib import Path
from shutil import copyfile


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "back_end_flask"
FRONTEND = ROOT / "front_end_react"
TARGET = FRONTEND / "guardian_backend"


def main():
    (TARGET / "models").mkdir(parents=True, exist_ok=True)
    for name in ("app.py", "inference.py"):
        copyfile(SOURCE / name, TARGET / name)
    requirements = [
        line.strip() for line in (SOURCE / "requirements.txt").read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.startswith("#")
    ]
    manifest = ('[project]\nname = "email-guardian-vercel-api"\nversion = "0.1.0"\n'
                'requires-python = ">=3.13,<3.14"\ndependencies = [\n'
                + ''.join(f'  {json.dumps(line)},\n' for line in requirements) + ']\n')
    (FRONTEND / "pyproject.toml").write_text(manifest, encoding="utf-8", newline="\n")
    for name in (
        "spam_model.pkl", "spam_vectorizer.pkl",
        "phishing_model.pkl", "phishing_vectorizer.pkl",
    ):
        copyfile(SOURCE / "models" / name, TARGET / "models" / name)


if __name__ == "__main__":
    main()
