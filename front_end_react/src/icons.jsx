const paths = {
  shield: <><path d="M12 3 4.5 6v5.2c0 4.3 3 7.8 7.5 9.8 4.5-2 7.5-5.5 7.5-9.8V6L12 3Z" /><path d="m8.5 11.5 2.3 2.3 4.7-4.8" /></>,
  arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  alert: <><path d="m12 3 10 17H2L12 3Z" /><path d="M12 9v4m0 3v.1" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  sparkle: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /></>,
};

export default function Icon({ name, className = '' }) {
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
