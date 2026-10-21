import { useState } from 'react';
import Icon from './icons.jsx';
import { examples } from './examples.js';

export default function Landing({ onLoadExample, onScanExample, onCancelScan, previewResult, previewError, scanning, activeSampleId }) {
  const [sampleId, setSampleId] = useState('account');
  const sample = examples.find(example => example.id === sampleId);
  const sampleScan = previewResult?.id === sampleId ? previewResult.result : null;
  const scanningSample = scanning && activeSampleId === sampleId;
  return <main className="landing" id="home" tabIndex="-1">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><h1 id="hero-title">Is this email <br /><span className="cyber-glitch" data-text="spam or phishing?" aria-hidden="true">spam or phishing?</span><span className="sr-only">spam or phishing?</span></h1>
        <p className="hero-description">Paste the message text. See two separate results.</p><p className="hero-detail">Email Guardian uses two machine-learning models to check the text for spam and phishing patterns. You see each classification and its model score.</p>
        <div className="hero-actions"><a className="primary-button" href="#scanner">Check an email<Icon name="arrow" /></a><a className="secondary-link" href="#sample-preview">Try a sample<Icon name="chevron" /></a></div>
        <p className="hero-footnote"><Icon name="lock" />No inbox connection. Email contents aren’t saved. Predictions can be wrong.</p>
      </div>
      <div className="hero-console-wrap"><div className="console-offset" aria-hidden="true" /><section className="hero-console cyber-panel" id="sample-preview" aria-label="Try a synthetic email sample">
        <div className="terminal-bar"><span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span><span>email_guardian / live example</span><Icon name="mail" /></div>
        <div className="console-content"><div className="terminal-command"><span aria-hidden="true">&gt;</span> check email text<span className="terminal-cursor" aria-hidden="true">_</span></div>
          <fieldset className="preview-picker" disabled={scanning}><legend>Choose a synthetic message</legend><div>{examples.map(example => <button key={example.id} type="button" aria-pressed={sampleId === example.id} onClick={() => setSampleId(example.id)}>{example.title}</button>)}</div></fieldset>
          <div className="preview-message" aria-live="polite"><span className="file-label">{sample.title} / synthetic sample</span><p>{sample.text}</p></div>
          <div className="sample-output" aria-live="polite" aria-busy={scanningSample}>
            <div className="sample-output-heading"><Icon name="signal" /><span>{scanningSample ? 'Checking both models…' : sampleScan ? 'Results for this sample' : 'What the scanner checks'}</span></div>
            {['spam', 'phishing'].map(type => <div className="sample-output-row" key={type}><span>{type === 'spam' ? 'Spam' : 'Phishing'}</span><strong className={sampleScan ? (sampleScan[type].label === 'legit' ? 'safe' : 'risk') : ''}>{scanningSample ? 'Checking…' : sampleScan ? (sampleScan[type].label === 'legit' ? 'No pattern detected' : 'Pattern detected') : 'Ready to check'}</strong></div>)}
          </div>
          {previewError?.id === sampleId && <p className="sample-error" role="alert">{previewError.message}</p>}
          <button className="console-action" type="button" disabled={scanning} onClick={() => onScanExample(sample)}>{scanningSample ? 'Scanning sample…' : scanning ? 'Scan in progress…' : sampleScan ? 'Scan this sample again' : 'Run sample scan'}<Icon name="arrow" /></button>
          <div className="sample-next">{sampleScan && <a href="#scanner">View full results and scores<Icon name="arrow" /></a>}<button type="button" onClick={() => onLoadExample(sample)} disabled={scanning}>Edit this sample in the scanner<Icon name="arrow" /></button>{scanningSample && <button type="button" onClick={onCancelScan}>Cancel scan</button>}</div>
          <p className="console-note">{scanning && !scanningSample ? 'Another scan is in progress. Return to the scanner to cancel it.' : 'Results come from the same scanner used for your own text. Scores are estimates.'}</p>
        </div>
      </section><div className="console-caption"><span className="signal-dot" />PASTE TEXT → TWO MODEL RESULTS → YOUR JUDGMENT</div></div>
    </section>

    <div className="capability-rail" aria-label="Scanner capabilities"><span><Icon name="mail" />Spam patterns</span><span><Icon name="shield" />Phishing patterns</span><span><Icon name="lock" />No email storage</span><span><Icon name="signal" />Two model views</span></div>

    <section className="perspectives" aria-labelledby="perspectives-title"><div className="section-intro"><h2 id="perspectives-title">One message.<br /><span>Two perspectives.</span></h2><p>Spam and phishing aren’t the same thing. Email Guardian checks for each, so you can read the results together.</p><a className="secondary-link" href="#scanner">Put a message to the test<Icon name="arrow" /></a></div>
      <div className="model-explainers"><article className="model-explainer"><h3>Cut through<br /> the noise.</h3><div className="explainer-label"><Icon name="mail" /><span>Spam detection</span></div><p>Looks for text patterns associated with unsolicited messages, promotions, and unwanted offers.</p><span className="model-output">OUTPUT: LEGIT / SPAM</span></article><article className="model-explainer phishing-explainer"><h3>Question<br /> the request.</h3><div className="explainer-label"><Icon name="shield" /><span>Phishing detection</span></div><p>Looks for text patterns associated with deceptive messages and requests for sensitive information.</p><span className="model-output">OUTPUT: LEGIT / PHISHING</span></article></div>
    </section>

    <section className="process-section" id="how-it-works" aria-labelledby="process-title"><div className="section-heading"><h2 id="process-title">From inbox<br />to insight.</h2><p>A simple experiment.<br />A more informed next step.</p></div><ol className="process-list"><li><span className="step-index">01</span><div><h3>Bring the message.</h3><p>Paste plain text or choose an editable synthetic example. Nothing runs until you start a scan.</p></div><Icon name="mail" /></li><li><span className="step-index">02</span><div><h3>Read both signals.</h3><p>See each model’s classification and class scores. Expand the details to compare both possible classes.</p></div><Icon name="signal" /></li><li><span className="step-index">03</span><div><h3>Make your own call.</h3><p>Predictions are estimates. Verify unexpected links and sensitive requests through a trusted channel.</p></div><Icon name="check" /></li></ol></section>

    <section className="project-faq" aria-labelledby="faq-title"><div><h2 id="faq-title">A little context.<br /><span>No mystery.</span></h2><p>See how both models assess a message.<br />Compare the signals side by side.</p></div><div className="faq-items"><details><summary>Does this connect to my inbox?<Icon name="chevron" /></summary><p>No. You choose the email text to paste. Email Guardian does not sign in to your email account or read your inbox.</p></details><details><summary>What happens to my email text?<Icon name="chevron" /></summary><p>The text is sent to the scan service for analysis and is not saved by this service. Up to 20 results, without email contents, stay in this tab’s memory until it closes or reloads.</p></details><details><summary>Can it guarantee an email is safe?<Icon name="chevron" /></summary><p>No. The two text-classification models can make mistakes. They do not verify the sender or inspect the destination of links. Treat results as a second opinion.</p></details></div></section>
    <section className="closing-cta"><h2>Give that email<br /><span>a second look.</span></h2><a className="primary-button" href="#scanner">Check an email<Icon name="arrow" /></a><p>Try a sample. See the signals. Keep your judgment.</p></section>
  </main>;
}
