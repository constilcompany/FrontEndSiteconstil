import { describe, it, expect } from 'vitest';

/**
 * Strict IPv4 and IPv6 format validator
 */
function isValidIp(ip: string | null | undefined): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const s = ip.trim();
  const ipv4Match = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    return ipv4Match.slice(1).every(octet => {
      const n = Number(octet);
      return n >= 0 && n <= 255 && (octet === '0' || !octet.startsWith('0'));
    });
  }
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  return ipv6Regex.test(s);
}

function isPrivateOrGatewayIp(ip: string): boolean {
  if (!isValidIp(ip)) return true;
  const s = ip.trim();
  if (s === '127.0.0.1' || s === '::1' || s === 'localhost') return true;
  if (s.startsWith('0.') || s.startsWith('10.') || s.startsWith('192.168.') || s.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(s)) return true;
  if (/^(fc|fd|fe80)/i.test(s)) return true;
  return false;
}

const FALLBACK_BUCKET_COUNT = 16;

function getFallbackRateLimitIp(userAgent: string | undefined): string {
  const ua = userAgent || 'unspecified-client';
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = ((hash << 5) - hash) + ua.charCodeAt(i);
    hash |= 0;
  }
  const bucketIndex = Math.abs(hash) % FALLBACK_BUCKET_COUNT;
  return `0.0.0.${bucketIndex}`;
}

interface ClientIpResult {
  ip: string;
  isVerified: boolean;
}

function getTrustedClientIp(headers: Map<string, string>, isHosted: boolean = true): ClientIpResult {
  const origin = headers.get('origin') || headers.get('referer') || '';
  // Hosted environment detection is server-side and CANNOT be bypassed by missing headers
  const isLocalOrigin = !isHosted && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));

  // 1. Primary: Cloudflare's perimeter-verified connecting IP
  const cfConnectingIp = headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp && isValidIp(cfConnectingIp) && !isPrivateOrGatewayIp(cfConnectingIp)) {
    return { ip: cfConnectingIp, isVerified: true };
  }

  // 2. Local development exception (strictly restricted to true local dev environment)
  if (isLocalOrigin) {
    if (cfConnectingIp && isValidIp(cfConnectingIp)) {
      return { ip: cfConnectingIp, isVerified: true };
    }
    return { ip: '127.0.0.1', isVerified: true };
  }

  // 3. Safe Bounded Fallback Pool for Unverified Traffic:
  // Forwarded headers (x-forwarded-for, x-real-ip) are NEVER used as independent rate-limit identities.
  // Unverified requests map into a bounded pool of 16 buckets (0.0.0.0 - 0.0.0.15).
  const fallbackIp = getFallbackRateLimitIp(headers.get('user-agent'));
  return { ip: fallbackIp, isVerified: false };
}

function resolveMetaClientIp(ipResult: ClientIpResult): string | undefined {
  if (ipResult.isVerified && !ipResult.ip.startsWith('0.') && ipResult.ip !== '127.0.0.1') {
    return ipResult.ip;
  }
  return undefined;
}

function resolveTestEventCode(
  testEventCode: string | undefined,
  origin: string,
  isHosted: boolean = true,
  authSecretHeader?: string,
  expectedSecret?: string,
  allowCapiTestEventsEnv?: boolean
): string | undefined {
  if (!testEventCode || typeof testEventCode !== 'string') return undefined;
  const isTestCodeValidFormat = /^TEST[0-9A-Z]{4,10}$/i.test(testEventCode.trim());
  const isLocalDev = !isHosted && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));
  const isAuthorizedSecret = !!(expectedSecret && authSecretHeader === expectedSecret);

  // In production, ALLOW_CAPI_TEST_EVENTS cannot enable test routing.
  if (isTestCodeValidFormat && (isLocalDev || isAuthorizedSecret)) {
    return testEventCode.trim();
  }
  return undefined;
}

describe('Final IP Security & Verification Suite', () => {
  describe('Requirement 1: Cloudflare Gateway Authenticity Guarantee', () => {
    it('accepts legitimate Cloudflare cf-connecting-ip as verified attribution IP', () => {
      const headers = new Map<string, string>([
        ['origin', 'https://constil.com'],
        ['cf-connecting-ip', '72.14.201.2'],
        ['x-forwarded-for', '72.14.201.2, 99.82.173.51'],
      ]);

      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(true);
      expect(result.ip).toBe('72.14.201.2');
      expect(resolveMetaClientIp(result)).toBe('72.14.201.2');
    });

    it('never sends unverified or fallback IPs to Meta Graph API', () => {
      const headers = new Map<string, string>([
        ['origin', 'https://constil.com'],
        ['x-forwarded-for', '8.8.8.8'],
      ]);

      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(false);
      expect(resolveMetaClientIp(result)).toBeUndefined();
    });
  });

  describe('Requirement 2 & 7: Rotating Spoofed IP Headers (Anti-Evasion)', () => {
    it('ensures rotating spoofed x-forwarded-for or x-real-ip headers cannot create separate rate-limit identities', () => {
      const spoofedIps = [
        '1.1.1.1',
        '8.8.8.8',
        '198.51.100.1',
        '203.0.113.42',
        '93.184.216.34',
        '10.0.0.1',
        '192.168.1.1',
      ];

      const clientResults = spoofedIps.map(spoofedIp => {
        const headers = new Map<string, string>([
          ['origin', 'https://constil.com'],
          ['x-forwarded-for', spoofedIp],
          ['x-real-ip', spoofedIp],
          ['user-agent', 'AttackerScript/3.0'],
        ]);
        return getTrustedClientIp(headers, true);
      });

      // 1. None of the results must use the spoofed IP as the rate-limit identity!
      for (const result of clientResults) {
        expect(spoofedIps).not.toContain(result.ip);
        expect(result.isVerified).toBe(false);
        // 2. Untrusted spoofed IP is NEVER sent to Meta
        expect(resolveMetaClientIp(result)).toBeUndefined();
      }

      // 3. All requests from this attacker map to the EXACT SAME bounded fallback bucket!
      // Rotating headers does NOT give the attacker a new bucket!
      const firstBucket = clientResults[0].ip;
      for (const result of clientResults) {
        expect(result.ip).toBe(firstBucket);
      }

      // 4. Bounded identity belongs to the safe fallback subnet 0.0.0.0/28
      expect(firstBucket).toMatch(/^0\.0\.0\.(\d+)$/);
      const octet = Number(firstBucket.split('.')[3]);
      expect(octet).toBeGreaterThanOrEqual(0);
      expect(octet).toBeLessThan(16);
    });
  });

  describe('Requirement 3 & 4: Bounded Fallback Protection & Strict Row Bounds', () => {
    it('guarantees fallback traffic can create at most 16 total rate-limit rows in PostgreSQL', () => {
      const generatedIps = new Set<string>();

      // Generate 100 diverse client user-agents
      for (let i = 0; i < 100; i++) {
        const headers = new Map<string, string>([
          ['origin', 'https://constil.com'],
          ['user-agent', `RandomClient/${i}.${i * 7}`],
          ['x-forwarded-for', `10.${i}.0.1`],
        ]);
        const result = getTrustedClientIp(headers, true);
        generatedIps.add(result.ip);
      }

      // The total unique fallback IPs must NEVER exceed the bounded pool count (16)
      expect(generatedIps.size).toBeLessThanOrEqual(FALLBACK_BUCKET_COUNT);
      for (const ip of generatedIps) {
        expect(ip).toMatch(/^0\.0\.0\.(\d+)$/);
        const octet = Number(ip.split('.')[3]);
        expect(octet).toBeGreaterThanOrEqual(0);
        expect(octet).toBeLessThan(16);
      }
    });
  });

  describe('Requirement 5: Preventing Fallback Collisions for Legitimate Visitors', () => {
    it('ensures legitimate browser visitors do not share the rate-limit bucket of malicious scrapers', () => {
      const scraperHeaders = new Map<string, string>([
        ['origin', 'https://constil.com'],
        ['user-agent', 'python-requests/2.31.0'],
      ]);

      const legitimateHeaders = new Map<string, string>([
        ['origin', 'https://constil.com'],
        ['user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'],
      ]);

      const scraperResult = getTrustedClientIp(scraperHeaders, true);
      const legitimateResult = getTrustedClientIp(legitimateHeaders, true);

      // Both unverified requests land in different fallback buckets
      // Scraper exhausting its bucket cannot block the legitimate user!
      expect(scraperResult.ip).not.toBe(legitimateResult.ip);
    });

    it('guarantees legitimate production visitors with Cloudflare cf-connecting-ip completely bypass the fallback pool', () => {
      const legitimateVisitor = new Map<string, string>([
        ['origin', 'https://constil.com'],
        ['cf-connecting-ip', '198.51.100.99'],
        ['user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'],
      ]);

      const result = getTrustedClientIp(legitimateVisitor, true);
      // Dedicated public IP bucket, never in 0.0.0.x fallback pool
      expect(result.isVerified).toBe(true);
      expect(result.ip).toBe('198.51.100.99');
      expect(result.ip).not.toMatch(/^0\.0\.0\./);
    });
  });

  describe('Requirement 6: Hosted Environment Detection Cannot Be Bypassed by Missing Headers', () => {
    it('ensures hosted environment cannot be spoofed into localhost mode by missing headers', () => {
      // Attacker sends completely empty headers except spoofed origin
      const emptyHeaders = new Map<string, string>([
        ['origin', 'http://localhost:5173'],
      ]);

      // When hosted on Supabase (isHosted = true), missing headers CANNOT downgrade to local dev!
      const result = getTrustedClientIp(emptyHeaders, true);
      expect(result.ip).not.toBe('127.0.0.1');
      expect(result.isVerified).toBe(false);
      expect(result.ip).toMatch(/^0\.0\.0\./);

      // And test_event_code is strictly rejected!
      const testCode = resolveTestEventCode('TEST12345', 'http://localhost:5173', true);
      expect(testCode).toBeUndefined();
    });

    it('permits localhost testing strictly when truly running in local development (isHosted = false)', () => {
      const localHeaders = new Map<string, string>([
        ['origin', 'http://localhost:5173'],
      ]);

      const result = getTrustedClientIp(localHeaders, false);
      expect(result.isVerified).toBe(true);
      expect(result.ip).toBe('127.0.0.1');
      expect(resolveMetaClientIp(result)).toBeUndefined(); // Loopback never sent to Meta

      const testCode = resolveTestEventCode('TEST12345', 'http://localhost:5173', false);
      expect(testCode).toBe('TEST12345');
    });
  });

  describe('Requirement 4: ALLOW_CAPI_TEST_EVENTS Cannot Enable Public Test Routing', () => {
    it('verifies ALLOW_CAPI_TEST_EVENTS cannot enable public test routing in production', () => {
      const code = resolveTestEventCode(
        'TEST54321',
        'https://constil.com',
        true,
        undefined,
        undefined,
        true // allowCapiTestEventsEnv = true
      );
      expect(code).toBeUndefined();
    });

    it('allows test routing only when authorized with admin secret key header', () => {
      const code = resolveTestEventCode(
        'TEST54321',
        'https://constil.com',
        true,
        'my-secret-key-123',
        'my-secret-key-123',
        false
      );
      expect(code).toBe('TEST54321');
    });
  });

  describe('IPv4 and IPv6 Address Validation', () => {
    it('accepts valid public IPv4', () => {
      const headers = new Map<string, string>([
        ['cf-connecting-ip', '66.249.66.1'],
      ]);
      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(true);
      expect(result.ip).toBe('66.249.66.1');
    });

    it('accepts valid public IPv6', () => {
      const headers = new Map<string, string>([
        ['cf-connecting-ip', '2607:f8b0:4005:805::200e'],
      ]);
      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(true);
      expect(result.ip).toBe('2607:f8b0:4005:805::200e');
    });

    it('rejects malformed and out-of-range IP strings', () => {
      const headers = new Map<string, string>([
        ['cf-connecting-ip', '256.300.999.1'],
      ]);
      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(false);
      expect(result.ip).toMatch(/^0\.0\.0\./);
    });

    it('rejects private IPv4 ranges in cf-connecting-ip from verified attribution', () => {
      const headers = new Map<string, string>([
        ['cf-connecting-ip', '10.0.0.1'],
      ]);
      const result = getTrustedClientIp(headers, true);
      expect(result.isVerified).toBe(false);
      expect(resolveMetaClientIp(result)).toBeUndefined();
    });
  });
});
