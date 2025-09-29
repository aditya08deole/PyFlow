// Basic test to ensure the test runner works
export {};

test('PyFlow project test suite', () => {
  expect(1 + 1).toBe(2);
});

test('Environment is working correctly', () => {
  expect(typeof document).toBe('object');
  expect(typeof window).toBe('object');
});