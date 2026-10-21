# Email Guardian frontend

Use Node 24, then `npm ci`, `npm start`, `npm test` and `npm run build`.
The development server is http://localhost:3000; `/scan` proxies to the local
Flask API at http://127.0.0.1:5000. Production files are emitted to `build/`.

Production `/scan` is rewritten to this project's Python Function. Its source
and model files under `guardian_backend/` are synchronized from the canonical
Flask backend with `python scripts/sync_vercel_backend.py` at repository root;
the Python tests reject any drift. The deployment pins Python 3.13.

`VITE_API_BASE_URL` optionally sets a separate API origin at build time. Without
it, scanning uses same-origin `/scan`. Configure the API's exact CORS allowlist
and the host's CSP `connect-src` when using separate origins. Secrets never
belong in frontend environment variables.

Results are kept in React memory only, limited to 20 entries. Neither email
contents nor results are written to browser storage. Reloading clears them.
The interface never requests server history and discards echoed content from
older APIs. Canonical labels and the legacy `safe email` / `phishing email`
labels are accepted; unknown labels and malformed probabilities show an error.

Model scores are not calibrated safety guarantees. The interface warns users
to verify unexpected links and requests even when both models predict legit.

## Scanner interactions

- Try one of three clearly labeled synthetic samples, then scan it yourself.
  Choosing a sample never sends a request automatically.
- Use Ctrl+Enter (or Command+Enter) to scan. The live counter shows the input
  limit. Clear text and Cancel scan retain predictable keyboard focus.
- Expand each model's class scores, compare samples, and reopen any of the last
  20 results in the current tab. Reloading clears the session.
- The input and analysis sit side by side on larger screens and stack on phones.
  Motion communicates waiting/results and respects reduced-motion preferences.

Synthetic examples do not guarantee a particular prediction and are not
measurements of model accuracy.

## Landing and visual system

The default route is the project landing page; `/#scanner` opens the scanner.
Hash navigation works on static hosting without extra rewrite rules and keeps
the session in React memory. Landing samples fill the scanner without submitting.

All surfaces share `src/tokens.css` and `src/App.css`. The user-requested dark
cyberpunk system uses green actions, cyan analysis, magenta accents, chamfered
frames and faint CRT/grid textures. Orbitron, JetBrains Mono and Share Tech Mono
are pinned Fontsource dependencies bundled locally; no font-service request is
needed. Text uses a brighter muted token than the brief's decorative gray to
maintain reading contrast. Existing inline icons share a 1.5px stroke.

Use the header's pause control to stop visual effects; the OS reduced-motion
preference also disables animations. Keyboard focus, text selection, meters,
scrollbars, loading and error states follow the shared palette. See the root
`DESIGN.md` for the implemented design system.
