import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Polyfill missing ArrayBuffer/SharedArrayBuffer resizable/growable flags in older Node runtimes
const abDescriptor = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable');
if (!abDescriptor) {
  Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
    configurable: true,
    enumerable: false,
    get() {
      return false;
    },
  });
}

// Some environments lack SharedArrayBuffer
if (typeof SharedArrayBuffer !== 'undefined') {
  const sabDescriptor = Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'growable');
  if (!sabDescriptor) {
    Object.defineProperty(SharedArrayBuffer.prototype, 'growable', {
      configurable: true,
      enumerable: false,
      get() {
        return false;
      },
    });
  }
}
