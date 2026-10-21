const aliases = {
  spam: { spam: 'spam', legit: 'legit', ham: 'legit', 'not spam': 'legit' },
  phishing: { phishing: 'phishing', 'phishing email': 'phishing',
    'safe email': 'legit', 'not phishing': 'legit', legit: 'legit' },
};

export function validateResult(data) {
  const result = {};
  for (const type of ['spam', 'phishing']) {
    const part = data?.[type];
    const rawLabel = typeof part?.label === 'string' ? part.label.toLowerCase().trim() : '';
    const label = Object.hasOwn(aliases[type], rawLabel) && aliases[type][rawLabel];
    if (!label || !part.probabilities || typeof part.probabilities !== 'object' || Array.isArray(part.probabilities)) {
      throw new Error('Scanner returned an invalid classification. Please try again.');
    }
    const probabilities = {};
    for (const [raw, value] of Object.entries(part.probabilities)) {
      const key = raw.toLowerCase().trim();
      const name = Object.hasOwn(aliases[type], key) && aliases[type][key];
      if (!name || typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
        throw new Error('Scanner returned invalid probabilities. Please try again.');
      }
      probabilities[name] = (probabilities[name] || 0) + value;
    }
    if (Object.keys(probabilities).length !== 2 || probabilities.legit === undefined || probabilities[type] === undefined ||
        Math.abs(Object.values(probabilities).reduce((a, b) => a + b, 0) - 1) > 0.000001) {
      throw new Error('Scanner returned incomplete probabilities. Please try again.');
    }
    // Copy only the public classification contract; discard echoed contents.
    result[type] = { label, probabilities };
  }
  return result;
}

export async function scanEmail(email, signal) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const response = await fetch(`${base}/scan`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }), signal, cache: 'no-store', credentials: 'omit',
  });
  if (!response.ok) {
    const errors = { 400: 'Please enter valid email text.', 413: 'Email text is too long.',
      415: 'The scanner could not read this request.', 503: 'Scanner temporarily unavailable. Please try again.' };
    throw new Error(errors[response.status] || 'Scan failed. Please try again.');
  }
  let data;
  try { data = await response.json(); }
  catch { throw new Error('Scanner returned an unreadable response. Please try again.'); }
  return validateResult(data);
}
