import { describe, it, expect } from 'vitest';
import { formatSiret } from './SiretInput';

describe('formatSiret', () => {
  it("formats a 14 digit siret with spaces", () => {
    expect(formatSiret('12345678901234')).toBe('123 456 789 01234');
  });
});
