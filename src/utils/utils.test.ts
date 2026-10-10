import { describe, it, expect } from 'vitest';

describe('Basic tests', () => {
  it('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });

  it('hello should be a string', () => {
    expect(typeof 'hello').toBe('string');
  });
});