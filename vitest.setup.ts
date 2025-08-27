import '@testing-library/jest-dom';

// Polyfill for localStorage for jsdom if needed (jsdom provides it, but ensure clean state)
beforeEach(() => {
  localStorage.clear();
});
