"""Vercel's same-origin scan Function, using the reviewed Flask API."""

from guardian_backend.app import app

# File-based Functions receive /api/scan. The canonical Flask app uses /scan.
app.add_url_rule(
    "/api/scan", endpoint="vercel_scan",
    view_func=app.view_functions["scan_email"], methods=["POST"],
)
