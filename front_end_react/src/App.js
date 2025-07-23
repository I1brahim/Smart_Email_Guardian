import { useState, useEffect } from 'react';

export default function EmailScanner() {
  const [emailText, setEmailText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://172.17.0.2:5000/history');
        const data = await res.json();
        setHistory(data.reverse());
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };
    fetchHistory();
  }, []);

  const styles = {
    body: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)',
      padding: '40px 16px',
      margin: 0,
    },
    container: {
      maxWidth: '768px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    headerTitle: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
    },
    headerSubtitle: {
      color: '#6b7280',
      fontSize: '1rem',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '32px',
      marginBottom: '32px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      resize: 'vertical',
      minHeight: '200px',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
    },
    btn: {
      width: '100%',
      background: '#3b82f6',
      color: 'white',
      fontWeight: '600',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnHover: {
      background: '#2563eb',
    },
    btnDisabled: {
      background: '#93c5fd',
      cursor: 'not-allowed',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid white',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
    error: {
      marginTop: '16px',
      padding: '16px',
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      fontSize: '0.875rem',
    },
    results: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '32px',
    },
    resultsTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '24px',
    },
    resultsGrid: {
      display: 'grid',
      gap: '24px',
      marginBottom: '32px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    resultCard: {
      background: '#f9fafb',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    resultCardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
    },
    statusIndicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      marginRight: '8px',
    },
    statusIndicatorSpam: {
      background: '#3b82f6',
    },
    statusIndicatorPhishing: {
      background: '#dc2626',
    },
    resultCardTitle: {
      fontWeight: '600',
      color: '#1f2937',
      fontSize: '1rem',
    },
    resultDetails: {
      fontSize: '0.875rem',
      marginBottom: '12px',
    },
    resultRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    resultLabel: {
      color: '#6b7280',
    },
    resultValue: {
      fontWeight: '500',
    },
    statusDanger: {
      color: '#dc2626',
    },
    statusSuccess: {
      color: '#16a34a',
    },
    statusWarning: {
      color: '#d97706',
    },
    riskHigh: {
      color: '#dc2626',
    },
    riskMedium: {
      color: '#d97706',
    },
    riskLow: {
      color: '#16a34a',
    },
    progressBar: {
      width: '100%',
      background: '#e5e7eb',
      borderRadius: '4px',
      height: '8px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },
    progressSpam: {
      background: '#3b82f6',
    },
    progressPhishing: {
      background: '#dc2626',
    },
    securityTips: {
      padding: '20px',
      background: '#eef2ff',
      border: '1px solid #c7d2fe',
      borderRadius: '8px',
    },
    securityTipsTitle: {
      color: '#4f46e5',
      fontWeight: '600',
      marginBottom: '8px',
      fontSize: '1rem',
    },
    securityTipsList: {
      color: '#5b21b6',
      fontSize: '0.875rem',
      paddingLeft: '20px',
      margin: 0,
    },
    securityTipsItem: {
      marginBottom: '4px',
    },
    successMessage: {
      padding: '20px',
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
    },
    successIcon: {
      width: '24px',
      height: '24px',
      background: '#16a34a',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px',
      flexShrink: 0,
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    successContent: {
      flex: 1,
    },
    successTitle: {
      color: '#15803d',
      fontWeight: '600',
      fontSize: '1rem',
      marginBottom: '4px',
    },
    successText: {
      color: '#16a34a',
      fontSize: '0.875rem',
    },
    historyTableWrapper: {
      marginTop: '40px',
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      background: '#3b82f6',
      color: 'white',
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      fontWeight: '600',
      fontSize: '0.875rem',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '0.875rem',
      color: '#374151',
    },
    rowAlt: {
      background: '#f9fafb',
    },
    labelSpam: {
      color: '#1e40af',
      fontWeight: '600',
    },
    labelPhishing: {
      color: '#b91c1c',
      fontWeight: '600',
    },
  };

const handleScan = async () => {
  setError('');
  setResults(null);

  if (!emailText.trim()) {
    setError('Please enter email text.');
    return;
  }

  setIsScanning(true);

  try {
    const response = await fetch('http://172.17.0.2:5000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error scanning email');
    }

    const data = await response.json();
    console.log("Scan result:", data);

    setResults(data);
    setHistory(prev => [data, ...prev]); 
  } catch (err) {
    setError(err.message);
  } finally {
    setIsScanning(false);
  }
};

  const getStatusColor = (label) => {
    const lower = label.toLowerCase();
    if (lower === 'spam' || lower === 'phishing') return styles.statusDanger;
    if (lower === 'not spam' || lower === 'not phishing' || lower === 'legit') return styles.statusSuccess;
    return styles.statusWarning;
  };

  const getRiskLevel = (p) => (p > 0.8 ? 'High Risk' : p > 0.5 ? 'Medium Risk' : 'Low Risk');
  const getRiskColor = (p) => (p > 0.8 ? styles.riskHigh : p > 0.5 ? styles.riskMedium : styles.riskLow);

  const isEmailLegit = () => {
    const spamLegit = results?.spam?.label?.toLowerCase().includes('not') || results?.spam?.label?.toLowerCase() === 'legit';
    const phishingLegit = results?.phishing?.label?.toLowerCase().includes('not') || results?.phishing?.label?.toLowerCase() === 'legit';
    return spamLegit && phishingLegit;
  };

  const renderResultCard = (title, label, probabilities, description, type) => (
    <div style={styles.resultCard}>
      <div style={styles.resultCardHeader}>
        <div style={{ ...styles.statusIndicator, ...(type === 'spam' ? styles.statusIndicatorSpam : styles.statusIndicatorPhishing) }}></div>
        <h4 style={styles.resultCardTitle}>{title}</h4>
      </div>
      <div style={styles.resultDetails}>
        <div style={styles.resultRow}><span style={styles.resultLabel}>Status:</span><span style={{ ...styles.resultValue, ...getStatusColor(label) }}>{label}</span></div>
        {Object.entries(probabilities).map(([lbl, prob]) => (
          <div style={styles.resultRow} key={lbl}>
            <span style={styles.resultLabel}>{lbl}:</span>
            <span style={styles.resultValue}>{(prob * 100).toFixed(1)}%</span>
          </div>
        ))}
        <div style={{ marginTop: '8px', color: '#6b7280', fontStyle: 'italic' }}>{description}</div>
      </div>
    </div>
  );

  return (
    <div style={styles.body}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Email Security Scanner</h1>
          <p style={styles.headerSubtitle}>Detect spam and phishing risks in emails</p>
        </div>

        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="emailText">Paste Email Content:</label>
            <textarea id="emailText" value={emailText} onChange={(e) => setEmailText(e.target.value)} style={styles.textarea} placeholder="e.g., Hello user, click here to claim your prize..." />
          </div>
          <button onClick={handleScan} disabled={isScanning} style={{ ...styles.btn, ...(isScanning ? styles.btnDisabled : {}) }}
            onMouseEnter={(e) => { if (!isScanning) e.target.style.background = styles.btnHover.background; }}
            onMouseLeave={(e) => { if (!isScanning) e.target.style.background = styles.btn.background; }}>
            {isScanning && <div style={styles.spinner}></div>}
            <span>{isScanning ? 'Scanning...' : 'Scan Email'}</span>
          </button>
          {error && <div style={styles.error}>{error}</div>}
        </div>

        {results && (
          <div style={styles.results}>
            <h2 style={styles.resultsTitle}>Scan Results</h2>
            <div style={styles.resultsGrid}>
              {results.spam && renderResultCard('Spam Detection', results.spam.label, results.spam.probabilities, results.spam.description, 'spam')}
              {results.phishing && renderResultCard('Phishing Detection', results.phishing.label, results.phishing.probabilities, results.phishing.description, 'phishing')}
            </div>
            {!isEmailLegit() && (
              <div style={styles.securityTips}>
                <h3 style={styles.securityTipsTitle}>Security Tips:</h3>
                <ul style={styles.securityTipsList}>
                  <li style={styles.securityTipsItem}>Always verify the sender's identity before clicking links.</li>
                  <li style={styles.securityTipsItem}>Be cautious with urgent or threatening language.</li>
                  <li style={styles.securityTipsItem}>Check URL destinations before entering credentials.</li>
                  <li style={styles.securityTipsItem}>If in doubt, verify through a trusted channel.</li>
                </ul>
              </div>
            )}
            {isEmailLegit() && (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>✓</div>
                <div style={styles.successContent}>
                  <h3 style={styles.successTitle}>Email appears to be legitimate</h3>
                  <p style={styles.successText}>No spam or phishing threats detected.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div style={styles.historyTableWrapper}>
            <h2 style={styles.resultsTitle}>Scan History</h2>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Spam Label</th>
                  <th style={styles.th}>Spam Probabilities</th>
                  <th style={styles.th}>Phishing Label</th>
                  <th style={styles.th}>Phishing Probabilities</th>
                  <th style={styles.th}>Email Snippet</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.rowAlt : {}}>
                    <td style={styles.td}>{item.spam?.label}</td>
                    <td style={styles.td}>
                      {item.spam?.probabilities &&
                        Object.entries(item.spam.probabilities).map(([lbl, prob]) =>
                          `${lbl}: ${(prob * 100).toFixed(1)}% `
                        ).join(', ')
                      }
                    </td>
                    <td style={styles.td}>{item.phishing?.label}</td>
                    <td style={styles.td}>
                      {item.phishing?.probabilities &&
                        Object.entries(item.phishing.probabilities).map(([lbl, prob]) =>
                          `${lbl}: ${(prob * 100).toFixed(1)}% `
                        ).join(', ')
                      }
                    </td>
                    <td style={styles.td}>{item.email.slice(0, 50)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



