# Scanner interface

Use Node 24, then `npm ci`, `npm start`, `npm test` and `npm run build`.
The development server is http://localhost:3000; `/scan` proxies to the local
Flask API at http://127.0.0.1:5000. Production files are emitted to `build/`.

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

## School demo interactions

- Try one of three clearly labeled synthetic samples, then scan it yourself.
  Choosing a sample never sends a request automatically.
- Use Ctrl+Enter (or Command+Enter) to scan. The live counter shows the input
  limit. Clear text and Cancel scan retain predictable keyboard focus.
- Expand each model's class scores, compare samples, and reopen any of the last
  20 results in the current tab. Reloading clears the session.
- The input and analysis sit side by side on larger screens and stack on phones.
  Motion communicates waiting/results and respects reduced-motion preferences.

This is a school demonstration. Synthetic examples do not guarantee a particular
prediction and are not measurements of model accuracy.
