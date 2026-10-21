import { useEffect, useRef, useState } from 'react';
import { scanEmail } from './api.js';
import Analysis, { displayLabel } from './Analysis.jsx';
import Icon from './icons.jsx';
import { examples } from './examples.js';
import Landing from './Landing.jsx';
import { Header, Footer } from './SiteChrome.jsx';

const scannerHashes = new Set(['#scanner', '#session-results', '#project-details']);

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [paused, setPaused] = useState(false);
  const scanner = scannerHashes.has(route);
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedExample, setSelectedExample] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const activeRequest = useRef(null);
  const nextId = useRef(1);
  const inputRef = useRef(null);
  const resultHeading = useRef(null);
  const focusInput = useRef(false);
  const formRef = useRef(null);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    document.title = scanner ? 'Scanner | Email Guardian' : 'Email Guardian | Think before you click';
    const target = document.getElementById(route.slice(1) || 'home');
    const scrollTarget = !route || route === '#home' || route === '#scanner' ? document.getElementById('site-top') : target;
    scrollTarget?.scrollIntoView?.({ block: 'start' });
    if (route === '#scanner' || route === '#home') target?.focus({ preventScroll: true });
  }, [route, scanner]);

  useEffect(() => () => {
    if (activeRequest.current) {
      activeRequest.current.disposed = true;
      activeRequest.current.controller.abort();
    }
  }, []);
  useEffect(() => {
    if (!scanning && focusInput.current) {
      inputRef.current?.focus();
      focusInput.current = false;
    }
  }, [scanning]);

  function chooseExample(example) {
    setEmail(example.text); setSelectedExample(example.id); setError(''); setNotice('');
    inputRef.current?.focus();
  }

  function loadLandingExample(example) {
    chooseExample(example);
    window.location.hash = 'scanner';
    focusInput.current = true;
  }

  useEffect(() => {
    if (scanner && focusInput.current && !scanning) {
      inputRef.current?.focus();
      focusInput.current = false;
    }
  }, [scanner, scanning]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (activeRequest.current) return;
    setError(''); setNotice(''); setResult(null); setSelectedResult(null);
    if (!email.trim()) { setError('Please enter email text.'); inputRef.current?.focus(); return; }
    if (email.length > 50000) { setError('Email text is too long. The limit is 50,000 characters.'); return; }
    const request = { controller: new AbortController(), cancelled: false, timedOut: false, disposed: false };
    activeRequest.current = request;
    const timeout = setTimeout(() => { request.timedOut = true; request.controller.abort(); }, 30000);
    setScanning(true);
    try {
      const data = await scanEmail(email, request.controller.signal);
      if (request.disposed || request.cancelled || request.timedOut) return;
      const entry = { id: nextId.current++, result: data };
      setResult(data); setSelectedResult(entry.id); setEmail(''); setSelectedExample(null);
      setHistory(previous => [entry, ...previous].slice(0, 20));
    } catch (failure) {
      if (request.disposed) return;
      if (request.cancelled) setNotice('Scan cancelled. Your text is still here.');
      else if (request.timedOut || failure.name === 'AbortError') setError('Scan timed out. Please try again.');
      else setError(failure instanceof TypeError ? 'Could not connect to the scanner. Please try again.' : failure.message);
    } finally {
      clearTimeout(timeout);
      if (activeRequest.current === request) activeRequest.current = null;
      if (!request.disposed) setScanning(false);
    }
  }

  function cancelScan() {
    if (!activeRequest.current) return;
    activeRequest.current.cancelled = true;
    focusInput.current = true;
    activeRequest.current.controller.abort();
  }

  function viewResult(entry) {
    setResult(entry.result); setSelectedResult(entry.id);
    requestAnimationFrame(() => resultHeading.current?.focus());
  }

  return <div className={`app-shell${paused ? ' effects-paused' : ''}`}>
    <a className="skip-link" href={scanner ? '#scanner' : '#home'}>Skip to main content</a>
    <Header scanner={scanner} count={history.length} paused={paused} onToggleMotion={() => setPaused(value => !value)} />
    {!scanner ? <Landing onLoadExample={loadLandingExample} scanning={scanning} /> : <main className="scanner-page" id="scanner" tabIndex="-1">
      <a className="back-link" href="#home"><Icon name="arrow" />Back to overview</a>
      <div className="page-heading"><div><h1>Email Security Scanner</h1><p>Check email text for spam and phishing patterns.</p></div><span className="project-note">A school project, built for learning</span></div>
      <div className="workspace cyber-panel">
        <form className="composer" onSubmit={handleSubmit} ref={formRef} onKeyDown={event => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); if (!scanning) formRef.current?.requestSubmit(); }
        }}>
          <div className="composer-heading"><h2>Give it a second look.</h2><p>Paste a message below, or explore a sample.</p></div>
          <fieldset className="example-picker" disabled={scanning}><legend>Try a sample <span>· synthetic messages</span></legend><div>{examples.map(example => <button key={example.id} type="button" className="example-button" aria-pressed={selectedExample === example.id} onClick={() => chooseExample(example)}><Icon name={example.icon} />{example.title}</button>)}</div></fieldset>
          <div className={`editor ${error ? 'editor-error' : ''}`}><div className="editor-toolbar"><label htmlFor="email">Paste email content</label><button className="text-button" type="button" disabled={!email || scanning} onClick={() => { setEmail(''); setSelectedExample(null); setError(''); setNotice(''); inputRef.current?.focus(); }}>Clear text</button></div>
            <textarea id="email" ref={inputRef} value={email} onChange={event => { setEmail(event.target.value); setSelectedExample(null); setError(''); setNotice(''); }} disabled={scanning} maxLength={50000} rows={8} placeholder={'> Paste the message you’d like to check…\n\nOr load a synthetic sample above.'} aria-describedby={`email-limit privacy-note${error ? ' scan-error' : ''}`} aria-invalid={Boolean(error && (error.startsWith('Please enter') || error.startsWith('Email text is too long')))} />
            <div className="editor-meta"><span>Plain text works best</span><span id="email-limit" aria-label="Email character count">{email.length.toLocaleString()} / 50,000</span></div>
          </div>
          {error && <p role="alert" id="scan-error" className="error-message"><Icon name="alert" />{error}</p>}
          {notice && <p role="status" className="notice-message">{notice}</p>}
          <div className="scan-actions"><button type="submit" className="primary-button" disabled={scanning}><span>{scanning ? 'Scanning…' : 'Scan Email'}</span>{!scanning && <Icon name="arrow" />}</button>{scanning ? <button type="button" className="cancel-button" onClick={cancelScan}>Cancel scan</button> : <span className="keyboard-hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> to scan</span>}</div>
          <p id="privacy-note" className="privacy-note"><Icon name="lock" />Email contents are sent for scanning and are not saved by this service. Results stay in this tab until it closes or reloads.</p>
        </form>
        <Analysis result={result} scanning={scanning} headingRef={resultHeading} />
      </div>

      <section id="session-results" className="session-section" aria-label="Session results">
        {history.length > 0 ? <><div className="section-heading"><div><h2>Results in this tab</h2><p>Up to 20 recent results; email contents are excluded.</p></div><button className="text-button clear-results" onClick={() => { setHistory([]); setResult(null); setSelectedResult(null); }}>Clear results<Icon name="close" /></button></div>
          <ol className="session-list">{history.map(entry => <li key={entry.id}><button className="session-result" aria-label={`View result ${entry.id}`} aria-pressed={selectedResult === entry.id} disabled={scanning} onClick={() => viewResult(entry)}><span className="session-number"><Icon name="mail" />Scan {entry.id}</span><span className={entry.result.spam.label === 'legit' ? 'safe' : 'risk'}>Spam: {displayLabel(entry.result.spam.label)}</span><span className={entry.result.phishing.label === 'legit' ? 'safe' : 'risk'}>Phishing: {displayLabel(entry.result.phishing.label)}</span><Icon name="arrow" /></button></li>)}</ol>
        </> : <div className="session-empty"><Icon name="clock" /><div><h2>Your session starts with a scan.</h2><p>Recent results appear here. Nothing is saved after you leave.</p></div></div>}
      </section>
      <details className="how-it-works" id="project-details"><summary>How this school project works<Icon name="chevron" /></summary><div><p>The same message is checked by two text-classification models: one for spam and one for phishing. Each returns a label and class scores.</p><p>Try the synthetic samples to compare predictions. These scores are model estimates. Always verify unexpected links and sensitive requests through a trusted channel.</p></div></details>
    </main>}
    <Footer />
  </div>;
}
