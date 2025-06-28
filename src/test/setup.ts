import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock IntersectionObserver
(global as any).IntersectionObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
