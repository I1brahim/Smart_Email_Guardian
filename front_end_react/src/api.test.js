import { validateResult } from './api.js';

test.each([null, {}, { spam: { label: 1 } }, { spam: { label: 'legit', probabilities: { legit: NaN, spam: 0 } } }])(
  'rejects malformed result %j', (data) => { expect(() => validateResult(data)).toThrow(); });

test.each([
  { legit: 1.5, spam: -.5 }, { legit: 1 }, { legit: .5, spam: .2 },
  { legit: '0.5', spam: .5 }, { legit: Infinity, spam: 0 },
])('rejects invalid probability maps %j', probabilities => {
  expect(() => validateResult({ spam: { label: 'legit', probabilities } })).toThrow();
});

test('does not accept inherited names as labels', () => {
  expect(() => validateResult({ spam: { label: '__proto__', probabilities: {} } })).toThrow();
});
