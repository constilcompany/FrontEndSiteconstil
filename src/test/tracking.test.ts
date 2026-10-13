import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { hashMetaField, getMetaCookies } from '../utils/pixel';

describe('Meta EMQ Normalization & Hashing Suite', () => {
  it('normalizes 10-digit US phone numbers by prepending country code 1', async () => {
    // 10-digit phone formatted
    const hashFormatted = await hashMetaField('(555) 123-4567', 'phone');
    // 10-digit raw
    const hashRaw = await hashMetaField('5551234567', 'phone');
    // 11-digit with country code +1
    const hashWithCountry = await hashMetaField('+1 (555) 123-4567', 'phone');
    
    // All should produce the EXACT same SHA-256 hash of '15551234567'
    expect(hashFormatted).toBeDefined();
    expect(hashFormatted).toEqual(hashRaw);
    expect(hashFormatted).toEqual(hashWithCountry);

    // Compute expected SHA-256 of '15551234567'
    const encoder = new TextEncoder();
    const data = encoder.encode('15551234567');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const expectedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    expect(hashFormatted).toBe(expectedHash);
  });

  it('normalizes and hashes emails to lowercase and trimmed string', async () => {
    const rawEmail = '  Test.User+Sub@Constil.COM  ';
    const hashed = await hashMetaField(rawEmail, 'email');
    
    const encoder = new TextEncoder();
    const data = encoder.encode('test.user+sub@constil.com');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const expectedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    expect(hashed).toBe(expectedHash);
  });

  it('normalizes names by removing punctuation and converting to lowercase', async () => {
    const rawName = "  O'Connor-Smith! ";
    const hashed = await hashMetaField(rawName, 'text');
    
    // Non-word characters (except spaces/unicode) stripped: "oconnorsmith"
    const encoder = new TextEncoder();
    const data = encoder.encode('oconnorsmith');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const expectedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    expect(hashed).toBe(expectedHash);
  });

  it('handles empty or whitespace-only values safely', async () => {
    expect(await hashMetaField('', 'email')).toBeUndefined();
    expect(await hashMetaField('   ', 'phone')).toBeUndefined();
    expect(await hashMetaField('!!!', 'text')).toBeUndefined();
  });
});

describe('Meta Cookie & Click ID Extraction Suite', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  afterEach(() => {
    document.cookie = '_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = '_fbc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('extracts _fbp and _fbc cookies correctly', () => {
    document.cookie = '_fbp=fb.1.1680000000000.123456789; path=/';
    document.cookie = '_fbc=fb.1.1680000000000.IwARtestClickId; path=/';

    const cookies = getMetaCookies();
    expect(cookies.fbp).toBe('fb.1.1680000000000.123456789');
    expect(cookies.fbc).toBe('fb.1.1680000000000.IwARtestClickId');
  });

  it('falls back to fbclid from URL query parameter if _fbc cookie is not present', () => {
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      search: '?utm_source=meta&fbclid=IwARfallback12345',
    } as any;

    document.cookie = '_fbp=fb.1.1680000000000.123456789; path=/';

    const cookies = getMetaCookies();
    expect(cookies.fbp).toBe('fb.1.1680000000000.123456789');
    expect(cookies.fbc).toContain('fb.1.');
    expect(cookies.fbc).toContain('IwARfallback12345');

    window.location = originalLocation;
  });
});
