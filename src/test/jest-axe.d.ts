declare module 'jest-axe' {
  export function axe(element: any, options?: any): Promise<any>;
  export const toHaveNoViolations: any;
}

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}
