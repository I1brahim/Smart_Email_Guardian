import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App.jsx';

const result = (spam = 'legit', phishing = 'safe email') => ({
  spam: { label: spam, probabilities: { legit: .7, spam: .3 } },
  phishing: { label: phishing, probabilities: { 'safe email': .6, 'phishing email': .4 } },
  email: 'SERVER_ECHO_MUST_BE_DISCARDED',
});
beforeEach(() => { global.fetch = vi.fn(); });
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

function submit() {
  fireEvent.change(screen.getByLabelText('Paste email content'), { target: { value: 'PRIVATE_INPUT_MARKER' } });
  fireEvent.click(screen.getByRole('button', { name: 'Scan Email' }));
}

test('loads without reading server history', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Email Security Scanner' })).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});

test('rejects empty input without a network request', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Scan Email' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Please enter email text.');
  expect(fetch).not.toHaveBeenCalled();
});

test.each([['legit', 'safe email', true], ['spam', 'safe email', false], ['legit', 'phishing email', false], ['spam', 'phishing email', false]])(
  'correctly displays %s and %s', async (spam, phishing, safe) => {
    fetch.mockResolvedValue({ ok: true, json: async () => result(spam, phishing) });
    render(<App />); submit();
    await screen.findByRole('heading', { name: 'Scan results' });
    expect(Boolean(screen.queryByText('No spam or phishing patterns detected.'))).toBe(safe);
    expect(screen.queryByText(/SERVER_ECHO_MUST_BE_DISCARDED/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Paste email content')).toHaveValue('');
    expect(localStorage.length).toBe(0);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('/scan');
    fireEvent.click(screen.getByRole('button', { name: 'Clear results' }));
    expect(screen.queryByText('Results in this tab')).not.toBeInTheDocument();
  });

test('unknown labels cannot show a safe result', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => result('not malicious') });
  render(<App />); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('invalid classification');
  expect(screen.queryByRole('heading', { name: 'Scan results' })).not.toBeInTheDocument();
});

test('handles HTML error responses without leaking server details', async () => {
  fetch.mockResolvedValue({ ok: false, status: 503, json: async () => { throw new Error('PRIVATE_SERVER_DETAIL'); } });
  render(<App />); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('temporarily unavailable');
  expect(screen.queryByText(/PRIVATE_SERVER_DETAIL/)).not.toBeInTheDocument();
});

test('keeps the submit button disabled while a scan is pending', async () => {
  let resolve;
  fetch.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<App />); submit();
  expect(screen.getByRole('button', { name: 'Scanning…' })).toBeDisabled();
  resolve({ ok: true, json: async () => result() });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Scan Email' })).toBeEnabled());
});

test('aborts a timed out scan', async () => {
  vi.useFakeTimers();
  fetch.mockImplementation((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  render(<App />); submit();
  await act(async () => { await vi.advanceTimersByTimeAsync(30000); });
  expect(screen.getByRole('alert')).toHaveTextContent('Scan timed out');
  expect(screen.getByRole('button', { name: 'Scan Email' })).toBeEnabled();
});

test('examples are synthetic, editable, and do not send automatically', () => {
  render(<App />);
  const sample = screen.getByRole('button', { name: 'Everyday email' });
  fireEvent.click(sample);
  expect(sample).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Paste email content').value).toContain('study group');
  expect(screen.getByLabelText('Email character count')).not.toHaveTextContent('0 /');
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Paste email content'), { target: { value: 'My own message' } });
  expect(sample).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(screen.getByRole('button', { name: 'Clear text' }));
  expect(screen.getByLabelText('Paste email content')).toHaveValue('');
  expect(screen.getByLabelText('Paste email content')).toHaveFocus();
});

test('cancel keeps the input and creates no result history', async () => {
  fetch.mockImplementation((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  render(<App />); submit();
  fireEvent.click(screen.getByRole('button', { name: 'Cancel scan' }));
  await screen.findByText('Scan cancelled. Your text is still here.');
  expect(screen.getByLabelText('Paste email content')).toHaveValue('PRIVATE_INPUT_MARKER');
  expect(screen.getByLabelText('Paste email content')).toHaveFocus();
  expect(screen.queryByRole('heading', { name: 'Scan results' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Clear results' })).not.toBeInTheDocument();
});

test('keyboard shortcut scans and ignores duplicate submissions while pending', async () => {
  let resolve;
  fetch.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<App />);
  fireEvent.change(screen.getByLabelText('Paste email content'), { target: { value: 'hello' } });
  fireEvent.keyDown(screen.getByLabelText('Paste email content'), { key: 'Enter', ctrlKey: true });
  fireEvent.submit(screen.getByRole('button', { name: 'Scanning…' }).closest('form'));
  expect(fetch).toHaveBeenCalledTimes(1);
  resolve({ ok: true, json: async () => result() });
  await screen.findByRole('heading', { name: 'Scan results' });
});

test('session items reopen previous real results without another request', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => result() });
  fetch.mockResolvedValueOnce({ ok: true, json: async () => result('spam', 'phishing email') });
  render(<App />); submit();
  await screen.findByRole('heading', { name: 'Scan results' });
  submit();
  await screen.findByText('Potential risk detected. Verify the sender through a trusted channel.');
  fireEvent.click(screen.getByRole('button', { name: 'View result 1' }));
  expect(await screen.findByText('No spam or phishing patterns detected.')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button', { name: 'View result 1' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('meter')).toHaveLength(2);
});

test('a network failure has a readable recovery and preserves input', async () => {
  fetch.mockRejectedValue(new TypeError('Failed to fetch'));
  render(<App />); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not connect to the scanner. Please try again.');
  expect(screen.getByLabelText('Paste email content')).toHaveValue('PRIVATE_INPUT_MARKER');
});
