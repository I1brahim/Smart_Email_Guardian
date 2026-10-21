import { useEffect, useRef, useState } from 'react';
import { scanEmail } from './api.js';

const displayLabel = (label) => label === 'legit' ? 'No threat detected' : label === 'spam' ? 'Spam detected' : 'Phishing detected';

function ResultCard({ type, result }) {
  return <section className="result-card" aria-label={`${type} result`}>
    <h3>{type === 'spam' ? 'Spam detection' : 'Phishing detection'}</h3>
    <p className={result.label === 'legit' ? 'safe' : 'danger'}>{displayLabel(result.label)}</p>
    <dl>{Object.entries(result.probabilities).map(([label, probability]) =>
      <div key={label}><dt>{label === 'legit' ? 'Legitimate' : label}</dt><dd>{(probability * 100).toFixed(1)}%</dd></div>)}</dl>
  </section>;
}

export default function App() {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const activeRequest = useRef(null);
  useEffect(() => () => activeRequest.current?.abort(), []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    if (!email.trim()) { setError('Please enter email text.'); return; }
    if (email.length > 50000) { setError('Email text is too long. The limit is 50,000 characters.'); return; }
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    setScanning(true);
    try {
      const data = await scanEmail(email, controller.signal);
      setResult(data);
      setEmail('');
      setHistory(previous => [data, ...previous].slice(0, 20));
    } catch (failure) {
      setError(failure.name === 'AbortError' ? 'Scan timed out. Please try again.' : failure.message);
    } finally {
      clearTimeout(timeout);
      activeRequest.current = null;
      setScanning(false);
    }
  }

  const legitimate = result?.spam.label === 'legit' && result?.phishing.label === 'legit';
  return <main>
    <header><h1>Email Security Scanner</h1><p>Check email text for spam and phishing patterns.</p></header>
    <form className="panel" onSubmit={handleSubmit}>
      <label htmlFor="email">Paste email content</label>
      <textarea id="email" value={email} onChange={event => setEmail(event.target.value)} disabled={scanning} maxLength={50000} rows={9} />
      <p className="privacy">Email contents are sent for scanning and are not saved by this service. Results stay in this tab until it closes or reloads.</p>
      <button type="submit" disabled={scanning}>{scanning ? 'Scanning…' : 'Scan Email'}</button>
      {error && <p role="alert" className="danger">{error}</p>}
    </form>
    {result && <section className="panel" aria-live="polite">
      <h2>Scan results</h2>
      <div className="result-grid"><ResultCard type="spam" result={result.spam} /><ResultCard type="phishing" result={result.phishing} /></div>
      <p className={legitimate ? 'safe' : 'danger'}>{legitimate ? 'No spam or phishing patterns detected.' : 'Potential risk detected. Verify the sender through a trusted channel.'}</p>
      <p>Model predictions can be wrong. Verify unexpected links and requests for sensitive information.</p>
    </section>}
    {history.length > 0 && <section className="panel">
      <h2>Results in this tab</h2>
      <p>Up to 20 recent results; email contents are excluded.</p>
      <button className="secondary" onClick={() => { setHistory([]); setResult(null); }}>Clear results</button>
      <ol>{history.map((item, index) => <li key={index}>Spam: {displayLabel(item.spam.label)}. Phishing: {displayLabel(item.phishing.label)}.</li>)}</ol>
    </section>}
  </main>;
}
