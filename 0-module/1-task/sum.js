function sum(a, b) {
  if ([a, b].some((arg) => !(typeof arg === 'number'))) {
    throw new TypeError('All arguments must be a numbers');
  }
  return a + b;
}

module.exports = sum;
