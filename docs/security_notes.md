## Threats and Mitigations

### 1. Input Injection (JS/HTML)
- Mitigation: Use `markupsafe.escape` in Flask to sanitize input.

### 2. API Abuse
- Mitigation: Require a Bearer token for each request.

### 3. Data Snooping in Transit
-  Use HTTPS via `ngrok`

### 4. History Tampering
- Mitigation: Store history on server, not editable by client.


