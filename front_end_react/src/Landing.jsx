import { useState } from 'react';
import Icon from './icons.jsx';
import { examples } from './examples.js';

export default function Landing({ onLoadExample, scanning }) {
  const [sampleId, setSampleId] = useState('account');
  const sample = examples.find(example => example.id === sampleId);
  return <main className="landing" id="home" tabIndex="-1">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><h1 id="hero-title">Think before<br /> you <span className="cyber-glitch" data-text="click." aria-hidden="true">click.</span><span className="sr-only">click.</span></h1>
        <p className="hero-description">Some messages deserve a second look.</p><p className="hero-detail">Explore the patterns behind spam and phishing. Paste an email, run both models, and see what they find.</p>
        <div className="hero-actions"><a className="primary-button" href="#scanner">Launch scanner<Icon name="arrow" /></a><a className="secondary-link" href="#how-it-works">Explore the project<Icon name="chevron" /></a></div>
        <p className="hero-footnote"><Icon name="lock" />No account. No inbox access. Just email text.</p>
      </div>
      <div className="hero-console-wrap"><div className="console-offset" aria-hidden="true" /><section className="hero-console cyber-panel" aria-label="Synthetic message preview">
        <div className="terminal-bar"><span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span><span>message_preview.txt</span><Icon name="mail" /></div>
        <div className="console-content"><div className="terminal-command"><span aria-hidden="true">&gt;</span> inspect message<span className="terminal-cursor" aria-hidden="true">_</span></div>
          <fieldset className="preview-picker"><legend>Choose a synthetic message</legend><div>{examples.map(example => <button key={example.id} type="button" aria-pressed={sampleId === example.id} onClick={() => setSampleId(example.id)}>{example.title}</button>)}</div></fieldset>
          <div className="preview-message" aria-live="polite"><span className="file-label">{sample.title} / synthetic sample</span><p>{sample.text}</p></div>
          <div className="console-prompt"><Icon name="alert" /><p>A familiar message.<br /><strong>A closer look can help.</strong></p></div>
          <button className="console-action" type="button" disabled={scanning} onClick={() => onLoadExample(sample)}>Inspect this sample<Icon name="arrow" /></button><p className="console-note">{scanning ? 'A scan is in progress. Return to the scanner to cancel it.' : 'Loads into the editor. You decide when to scan.'}</p>
        </div>
      </section><div className="console-caption"><span className="signal-dot" />TEXT CLASSIFICATION / HUMAN JUDGMENT</div></div>
    </section>

    <div className="capability-rail" aria-label="Project capabilities"><span><Icon name="mail" />Spam patterns</span><span><Icon name="shield" />Phishing patterns</span><span><Icon name="lock" />No email storage</span><span><Icon name="sparkle" />Built for learning</span></div>

    <section className="perspectives" aria-labelledby="perspectives-title"><div className="section-intro"><h2 id="perspectives-title">One message.<br /><span>Two perspectives.</span></h2><p>Spam and phishing aren’t the same thing. Email Guardian checks for each, so you can read the results together.</p><a className="secondary-link" href="#scanner">Put a message to the test<Icon name="arrow" /></a></div>
      <div className="model-explainers"><article className="model-explainer"><h3>Cut through<br /> the noise.</h3><div className="explainer-label"><Icon name="mail" /><span>Spam detection</span></div><p>Looks for text patterns associated with unsolicited messages, promotions, and unwanted offers.</p><span className="model-output">OUTPUT: LEGIT / SPAM</span></article><article className="model-explainer phishing-explainer"><h3>Question<br /> the request.</h3><div className="explainer-label"><Icon name="shield" /><span>Phishing detection</span></div><p>Looks for text patterns associated with deceptive messages and requests for sensitive information.</p><span className="model-output">OUTPUT: LEGIT / PHISHING</span></article></div>
    </section>

    <section className="process-section" id="how-it-works" aria-labelledby="process-title"><div className="section-heading"><h2 id="process-title">From inbox<br />to insight.</h2><p>A simple experiment.<br />A more informed next step.</p></div><ol className="process-list"><li><span className="step-index">01</span><div><h3>Bring the message.</h3><p>Paste plain text or choose an editable synthetic example. Nothing runs until you start a scan.</p></div><Icon name="mail" /></li><li><span className="step-index">02</span><div><h3>Read both signals.</h3><p>See each model’s classification and class scores. Expand the details to compare both possible classes.</p></div><Icon name="signal" /></li><li><span className="step-index">03</span><div><h3>Make your own call.</h3><p>Predictions are estimates. Verify unexpected links and sensitive requests through a trusted channel.</p></div><Icon name="check" /></li></ol></section>

    <section className="project-faq" aria-labelledby="faq-title"><div><h2 id="faq-title">A little context.<br /><span>No mystery.</span></h2><p>Made for a school project.<br />Designed to make the models easier to explore.</p></div><div className="faq-items"><details><summary>Does this connect to my inbox?<Icon name="chevron" /></summary><p>No. You choose the email text to paste. Email Guardian does not sign in to your email account or read your inbox.</p></details><details><summary>What happens to my email text?<Icon name="chevron" /></summary><p>The text is sent to the scan service for analysis and is not saved by this service. Up to 20 results, without email contents, stay in this tab’s memory until it closes or reloads.</p></details><details><summary>Can it guarantee an email is safe?<Icon name="chevron" /></summary><p>No. The two text-classification models can make mistakes. They do not verify the sender or inspect the destination of links. Treat results as a second opinion.</p></details></div></section>
    <section className="closing-cta"><h2>Give that email<br /><span>a second look.</span></h2><a className="primary-button" href="#scanner">Launch scanner<Icon name="arrow" /></a><p>Try a sample. See the signals. Keep your judgment.</p></section>
  </main>;
}
