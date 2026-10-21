import Icon from './icons.jsx';

export function Header({ scanner, count, paused, onToggleMotion }) {
  return <header className="site-header" id="site-top"><div className="header-inner">
    <a className="brand" href="#home" aria-label="Email Guardian home"><span className="brand-mark"><Icon name="shield" /></span><span>Email<span className="brand-second">Guardian</span></span></a>
    <nav aria-label="Main navigation">
      <a href="#home" aria-current={!scanner ? 'page' : undefined}>Overview</a>
      <a href="#scanner" aria-current={scanner ? 'page' : undefined}>Scanner{count > 0 && <span className="nav-count">{count}</span>}</a>
      <a href={scanner ? '#session-results' : '#how-it-works'}>{scanner ? 'This session' : 'How it works'}</a>
    </nav>
    <div className="header-utilities"><button type="button" className="motion-toggle" onClick={onToggleMotion} aria-label={paused ? 'Resume visual effects' : 'Pause visual effects'} aria-pressed={paused} title={paused ? 'Resume visual effects' : 'Pause visual effects'}><Icon name={paused ? 'play' : 'pause'} /></button></div>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-top"><a className="brand" href="#home"><Icon name="shield" /><span>Email Guardian</span></a><a href="#scanner">Open scanner<Icon name="arrow" /></a></div><div className="footer-bottom"><p>Explore spam and phishing patterns in email text.</p><span>Stay curious. Verify before you click.</span></div><p className="footer-caveat">Model predictions can be wrong. Use these results as a second opinion.</p></footer>;
}
