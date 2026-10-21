# Security behavior

- No scan contents or predictions are persisted by the backend. `/history`
  returns 410. Legacy storage files remain untouched for owner-approved review.
- JSON shape, string type, emptiness and request size are validated before ML.
- Responses use `no-store`; exceptions do not log input or library messages.
- CORS denies cross-origin access by default and supports exact origin lists.
  It is not authentication. The stateless scan API is public.
- Models load from trusted local paths; incompatible scikit-learn versions
  fail closed. Never accept user-uploaded pickle artifacts.
- React renders labels as text. The frontend discards echoed email contents,
  rejects unknown classifications and stores only tab-local results in memory.
- Container builds exclude `.env` and history, and run Gunicorn as non-root.

Production operators must configure TLS, ingress rate/concurrency limits, the
API origin and CSP. No deployment or existing user-data deletion is part of
these changes. See [API details](privacy-api.md).
