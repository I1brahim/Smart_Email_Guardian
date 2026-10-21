import Icon from './icons.jsx';

export const displayLabel = label => label === 'legit' ? 'No threat detected' : label === 'spam' ? 'Spam detected' : 'Phishing detected';

function ModelResult({ type, result }) {
  const name = type === 'spam' ? 'Spam' : 'Phishing';
  const risk = result.label !== 'legit';
  return <section className="model-result" aria-label={`${type} result`}>
    <div className="model-heading"><h3>{name} detection</h3><span className={`result-status ${risk ? 'risk' : 'safe'}`}><Icon name={risk ? 'alert' : 'check'} />{displayLabel(result.label)}</span></div>
    <div className="score-label"><label htmlFor={`${type}-score`}>{name} model score</label><strong>{(result.probabilities[type] * 100).toFixed(1)}<span>%</span></strong></div>
    <meter className={risk ? 'score-meter risk-meter' : 'score-meter'} id={`${type}-score`} min="0" max="1" value={result.probabilities[type]}>{(result.probabilities[type] * 100).toFixed(1)}%</meter>
    <details className="probability-details"><summary>See both class scores</summary><dl>{Object.entries(result.probabilities).map(([label, probability]) => <div key={label}><dt>{label === 'legit' ? 'Legitimate' : name}</dt><dd>{(probability * 100).toFixed(1)}%</dd></div>)}</dl></details>
  </section>;
}

export default function Analysis({ result, scanning, headingRef }) {
  const legitimate = result?.spam.label === 'legit' && result?.phishing.label === 'legit';
  return <aside className={`analysis ${result ? 'has-result' : ''}`} aria-label="Email analysis" aria-busy={scanning}>
    <div className="analysis-topline"><span className="analysis-name"><Icon name="shield" />Analysis</span><span className="analysis-state">{scanning ? 'In progress' : result ? 'Complete' : 'Ready when you are'}</span></div>
    {scanning ? <div className="analysis-waiting" role="status">
      <div className="scan-visual" aria-hidden="true"><Icon name="mail" /><span className="scan-line" /></div>
      <h2>Taking a closer look</h2><p>Checking spam and phishing patterns…</p>
      <div className="loading-rows" aria-hidden="true"><span /><span /></div>
      <p className="small-note">You can cancel and keep your text.</p>
    </div> : result ? <div className="analysis-result" aria-live="polite">
      <div className={`verdict-icon ${legitimate ? 'safe' : 'risk'}`}><Icon name={legitimate ? 'check' : 'alert'} /></div>
      <h2 tabIndex="-1" ref={headingRef}>Scan results</h2>
      <p className="verdict-copy">{legitimate ? 'No spam or phishing patterns detected.' : 'Potential risk detected. Verify the sender through a trusted channel.'}</p>
      <div className="model-results"><ModelResult type="spam" result={result.spam} /><ModelResult type="phishing" result={result.phishing} /></div>
      <p className="model-caveat">Model predictions can be wrong. Verify unexpected links and requests for sensitive information.</p>
    </div> : <div className="analysis-waiting">
      <div className="empty-visual" aria-hidden="true"><Icon name="mail" /><span><Icon name="check" /></span></div>
      <h2>A little clarity,<br /> before you click.</h2>
      <p>Your scan results will appear here. Start with your own message or try a sample.</p>
      <ul className="check-list"><li><Icon name="check" />Check for spam patterns</li><li><Icon name="check" />Look for phishing patterns</li><li><Icon name="lock" />Email contents aren’t saved</li></ul>
    </div>}
  </aside>;
}
