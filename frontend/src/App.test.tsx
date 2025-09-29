// Basic test to ensure the test runner works
test('PyFlow project test suite', () => {
  expect(1 + 1).toBe(2);
});

test('Environment is working correctly', () => {
  expect(typeof React).toBe('undefined'); // React not imported in this test
  expect(typeof document).toBe('object');
});