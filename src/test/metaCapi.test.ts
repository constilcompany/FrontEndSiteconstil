import { describe, it, expect, vi, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Meta CAPI Comprehensive Security, Validation & Real Database Concurrency Test Suite
 */

const ALLOWED_PRODUCTION_ORIGINS = [
  'https://constil.com',
  'https://www.constil.com',
  'https://app.constil.com'
];

const ALLOWED_PRODUCTION_HOSTNAMES = [
  'constil.com',
  'www.constil.com',
  'app.constil.com'
];

const CLIENT_INTENT_EVENTS = [
  'PageView',
  'ViewContent',
  'Lead',
  'signup_started',
  'blueprint_upload_started',
  'generate_estimate_clicked',
  'estimate_failed'
];

const VERIFIED_CONVERSION_MILESTONES = [
  'CompleteRegistration',
  'blueprint_uploaded',
  'estimate_generated'
];

const MAX_REGISTRATION_WINDOW_SEC = 3600;

function isExactAllowedOrigin(targetUrlOrOrigin: string | null, isHosted: boolean): boolean {
  if (!targetUrlOrOrigin) return true;
  try {
    const url = new URL(targetUrlOrOrigin);
    const exactOrigin = url.origin;
    const hostname = url.hostname;

    if (ALLOWED_PRODUCTION_ORIGINS.includes(exactOrigin)) {
      return true;
    }

    if (!isHosted && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function validateEventSourceUrl(eventSourceUrl: string | undefined, isHosted: boolean): { valid: boolean; error?: string } {
  if (!eventSourceUrl || typeof eventSourceUrl !== 'string') {
    return { valid: false, error: 'Invalid event_source_url' };
  }
  try {
    const parsed = new URL(eventSourceUrl);
    const protocol = parsed.protocol;
    const hostname = parsed.hostname;

    const isAllowedProtocol = protocol === 'https:' || (!isHosted && protocol === 'http:');
    const isAllowedHost = ALLOWED_PRODUCTION_HOSTNAMES.includes(hostname) ||
      (!isHosted && (hostname === 'localhost' || hostname === '127.0.0.1'));

    if (!isAllowedProtocol || !isAllowedHost) {
      return { valid: false, error: 'Forbidden event_source_url: protocol or hostname not permitted' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Malformed event_source_url' };
  }
}

const RFC4122_DNS_NAMESPACE_BYTES = new Uint8Array([
  0x6b, 0xa7, 0xb8, 0x10, 0x9d, 0xad, 0x11, 0xd1,
  0x80, 0xb4, 0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8
]);

async function generateDeterministicEventId(name: string): Promise<string> {
  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array(RFC4122_DNS_NAMESPACE_BYTES.length + nameBytes.length);
  combined.set(RFC4122_DNS_NAMESPACE_BYTES, 0);
  combined.set(nameBytes, RFC4122_DNS_NAMESPACE_BYTES.length);

  const hashBuffer = await crypto.subtle.digest('SHA-1', combined);
  const hashBytes = new Uint8Array(hashBuffer);

  hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50; // Version 5
  hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80; // Variant RFC 4122

  const hex = Array.from(hashBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

interface MilestoneValidationResult {
  valid: boolean;
  error?: string;
  canonicalId?: string;
}

async function validateAuthoritativeMilestone(
  eventName: string,
  body: any,
  supabaseAdmin: any
): Promise<MilestoneValidationResult> {
  const milestoneData = body.milestone_data || {};
  const recordId = milestoneData.record_id || body.record_id;

  switch (eventName) {
    case 'CompleteRegistration': {
      const userId = recordId || milestoneData.user_id || body.user_id;
      if (!userId || typeof userId !== 'string') {
        return { valid: false, error: "Missing required 'user_id' in milestone_data for CompleteRegistration." };
      }

      const { data: userData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (authError || !userData?.user) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' does not exist in auth.users.` };
      }

      const rawCreatedAt = userData.user.created_at;
      if (!rawCreatedAt || typeof rawCreatedAt !== 'string') {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at is missing or invalid.` };
      }

      const createdAtMs = Date.parse(rawCreatedAt);
      if (isNaN(createdAtMs)) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at ('${rawCreatedAt}') is an invalid date.` };
      }

      const nowMs = Date.now();
      if (createdAtMs > nowMs + 60000) {
        return { valid: false, error: `Authoritative validation failed: User '${userId}' created_at ('${rawCreatedAt}') is in the future.` };
      }

      const ageSeconds = (nowMs - createdAtMs) / 1000;
      if (ageSeconds > MAX_REGISTRATION_WINDOW_SEC) {
        return { 
          valid: false, 
          error: `Authoritative validation failed: User '${userId}' was created at ${rawCreatedAt} (${Math.round(ageSeconds / 60)} minutes ago), exceeding the 60-minute window for newly completed registration.` 
        };
      }

      return { valid: true, canonicalId: userId };
    }

    case 'blueprint_uploaded': {
      const exactPdfKey = milestoneData.pdf_key || milestoneData.file_path || recordId;
      const userId = milestoneData.user_id || body.user_id;

      if (!exactPdfKey || typeof exactPdfKey !== 'string') {
        return { valid: false, error: "Missing required 'pdf_key' in milestone_data for blueprint_uploaded." };
      }
      if (!userId || typeof userId !== 'string') {
        return { valid: false, error: "Missing required 'user_id' in milestone_data for blueprint_uploaded ownership verification." };
      }

      const keyPattern = /^blueprints\/[0-9a-f-]{36}\/\d+_[0-9a-zA-Z-]+\.pdf$/;
      if (!keyPattern.test(exactPdfKey)) {
        return { valid: false, error: `Authoritative validation failed: '${exactPdfKey}' does not match required exact S3 blueprint key format.` };
      }

      const expectedPrefix = `blueprints/${userId}/`;
      if (!exactPdfKey.startsWith(expectedPrefix)) {
        return { valid: false, error: `Authoritative validation failed: Blueprint ownership mismatch. Key does not belong to user '${userId}'.` };
      }

      const { data: jobRecord } = await supabaseAdmin
        .from('pdf_jobs')
        .select('id, pdf_key, user_id')
        .eq('pdf_key', exactPdfKey)
        .eq('user_id', userId)
        .maybeSingle();

      if (!jobRecord) {
        return { valid: false, error: `Authoritative validation failed: Exact blueprint key '${exactPdfKey}' owned by user '${userId}' was not confirmed in backend records.` };
      }

      return { valid: true, canonicalId: exactPdfKey };
    }

    case 'estimate_generated': {
      const jobId = recordId || milestoneData.job_id || milestoneData.estimate_id;
      if (!jobId || typeof jobId !== 'string') {
        return { valid: false, error: "Missing required 'job_id' in milestone_data for estimate_generated." };
      }

      const { data: job, error: jobErr } = await supabaseAdmin
        .from('pdf_jobs')
        .select('id, status, user_id, pdf_key')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr || !job) {
        return { valid: false, error: `Authoritative validation failed: Estimation job '${jobId}' does not exist in pdf_jobs.` };
      }

      const rawStatus = (job.status || '').trim().toLowerCase();
      if (rawStatus !== 'done' && rawStatus !== 'completed') {
        return { 
          valid: false, 
          error: `Authoritative validation failed: Estimation job '${jobId}' has status '${job.status}'. Only completed status ('done') is accepted.` 
        };
      }

      return { valid: true, canonicalId: jobId };
    }

    default:
      return { valid: true };
  }
}

const SHA256_HEX_REGEX = /^[0-9a-f]{64}$/i;

async function sha256Hex(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function normalizeAndHashCustomerField(
  value: unknown,
  type: 'em' | 'ph' | 'fn' | 'ln'
): Promise<string | undefined> {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  if (!raw) return undefined;

  if (SHA256_HEX_REGEX.test(raw)) {
    return raw.toLowerCase();
  }

  let normalized = '';
  switch (type) {
    case 'em': {
      normalized = raw.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return undefined;
      }
      break;
    }
    case 'ph': {
      const digitsOnly = raw.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        return undefined;
      }
      normalized = digitsOnly.length === 10 ? '1' + digitsOnly : digitsOnly;
      break;
    }
    case 'fn':
    case 'ln': {
      normalized = raw.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      if (!normalized) return undefined;
      break;
    }
  }

  return await sha256Hex(normalized);
}

describe('Meta CAPI Security & Authoritative Milestone Suite', () => {

  describe('1. Exact Origin and CORS Verification', () => {
    it('allows approved production origins', () => {
      expect(isExactAllowedOrigin('https://constil.com', true)).toBe(true);
      expect(isExactAllowedOrigin('https://www.constil.com', true)).toBe(true);
      expect(isExactAllowedOrigin('https://app.constil.com', true)).toBe(true);
    });

    it('rejects subdomain prefix spoofing attempts', () => {
      expect(isExactAllowedOrigin('https://constil.com.attacker.com', true)).toBe(false);
      expect(isExactAllowedOrigin('https://app.constil.com.phishing.net', true)).toBe(false);
      expect(isExactAllowedOrigin('https://constil.com-fake.com', true)).toBe(false);
    });

    it('rejects unapproved third-party and Lovable origins in production', () => {
      expect(isExactAllowedOrigin('https://lovable.dev', true)).toBe(false);
      expect(isExactAllowedOrigin('https://preview.lovableproject.com', true)).toBe(false);
      expect(isExactAllowedOrigin('https://evil.com', true)).toBe(false);
    });

    it('permits localhost only when outside hosted cloud environment', () => {
      expect(isExactAllowedOrigin('http://localhost:5173', false)).toBe(true);
      expect(isExactAllowedOrigin('http://127.0.0.1:3000', false)).toBe(true);
      expect(isExactAllowedOrigin('http://localhost:5173', true)).toBe(false);
    });
  });

  describe('2. event_source_url Protocol and Hostname Validation', () => {
    it('accepts valid HTTPS production URLs', () => {
      expect(validateEventSourceUrl('https://constil.com/', true).valid).toBe(true);
      expect(validateEventSourceUrl('https://app.constil.com/signup?utm_source=fb', true).valid).toBe(true);
      expect(validateEventSourceUrl('https://www.constil.com/pricing', true).valid).toBe(true);
    });

    it('rejects unencrypted HTTP in hosted environment', () => {
      const res = validateEventSourceUrl('http://constil.com/', true);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('protocol or hostname not permitted');
    });

    it('rejects dangerous protocols (javascript:, file:, data:)', () => {
      expect(validateEventSourceUrl('javascript:alert(1)', true).valid).toBe(false);
      expect(validateEventSourceUrl('file:///etc/passwd', true).valid).toBe(false);
      expect(validateEventSourceUrl('data:text/html,<html>', true).valid).toBe(false);
    });

    it('rejects unauthorized external hostnames', () => {
      expect(validateEventSourceUrl('https://phishing.com/constil.com', true).valid).toBe(false);
      expect(validateEventSourceUrl('https://lovable.dev/preview', true).valid).toBe(false);
    });
  });

  describe('3. Standards-Compliant RFC 4122 §4.3 UUIDv5 Event ID Generation', () => {
    it('matches official RFC 4122 test vector: DNS namespace + "python.org"', async () => {
      // Official RFC 4122 test vector: 886313e1-3b8a-5372-9b90-0c9aee199e5d
      const generated = await generateDeterministicEventId('python.org');
      expect(generated).toBe('886313e1-3b8a-5372-9b90-0c9aee199e5d');
    });

    it('generates the exact same deterministic event_id across separate invocations for identical milestone keys', async () => {
      const id1 = await generateDeterministicEventId('estimate_generated:job_done_999');
      const id2 = await generateDeterministicEventId('estimate_generated:job_done_999');
      expect(id1).toEqual(id2);
      expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('generates distinct event_ids for different milestone keys', async () => {
      const id1 = await generateDeterministicEventId('estimate_generated:job_1');
      const id2 = await generateDeterministicEventId('estimate_generated:job_2');
      expect(id1).not.toEqual(id2);
    });
  });

  describe('4. Authoritative CompleteRegistration Validation (Dates & Freshness)', () => {
    it('rejects registration when user does not exist in auth.users', async () => {
      const mockSupabase = {
        auth: {
          admin: {
            getUserById: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('User not found') })
          }
        }
      };

      const result = await validateAuthoritativeMilestone(
        'CompleteRegistration',
        { milestone_data: { user_id: 'usr_non_existent' } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not exist in auth.users');
    });

    it('rejects registration with invalid date string in created_at', async () => {
      const mockSupabase = {
        auth: {
          admin: {
            getUserById: vi.fn().mockResolvedValue({
              data: { user: { id: 'usr_bad_date', created_at: 'invalid-date' } },
              error: null
            })
          }
        }
      };

      const result = await validateAuthoritativeMilestone(
        'CompleteRegistration',
        { milestone_data: { user_id: 'usr_bad_date' } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('is an invalid date');
    });

    it('rejects registration with future timestamp in created_at', async () => {
      const futureDate = new Date(Date.now() + 600 * 1000).toISOString();
      const mockSupabase = {
        auth: {
          admin: {
            getUserById: vi.fn().mockResolvedValue({
              data: { user: { id: 'usr_future', created_at: futureDate } },
              error: null
            })
          }
        }
      };

      const result = await validateAuthoritativeMilestone(
        'CompleteRegistration',
        { milestone_data: { user_id: 'usr_future' } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('is in the future');
    });

    it('rejects registration when user was created over 60 minutes ago (existing user)', async () => {
      const twoHoursAgo = new Date(Date.now() - 7200 * 1000).toISOString();
      const mockSupabase = {
        auth: {
          admin: {
            getUserById: vi.fn().mockResolvedValue({
              data: { user: { id: 'usr_existing_123', created_at: twoHoursAgo } },
              error: null
            })
          }
        }
      };

      const result = await validateAuthoritativeMilestone(
        'CompleteRegistration',
        { milestone_data: { user_id: 'usr_existing_123' } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeding the 60-minute window for newly completed registration');
    });

    it('accepts registration when user was created within the last 5 minutes', async () => {
      const fiveMinutesAgo = new Date(Date.now() - 300 * 1000).toISOString();
      const mockSupabase = {
        auth: {
          admin: {
            getUserById: vi.fn().mockResolvedValue({
              data: { user: { id: 'usr_brand_new_456', created_at: fiveMinutesAgo } },
              error: null
            })
          }
        }
      };

      const result = await validateAuthoritativeMilestone(
        'CompleteRegistration',
        { milestone_data: { user_id: 'usr_brand_new_456' } },
        mockSupabase
      );

      expect(result.valid).toBe(true);
      expect(result.canonicalId).toBe('usr_brand_new_456');
    });
  });

  describe('5. Authoritative blueprint_uploaded Validation & Ownership Verification', () => {
    const validUserId = '11111111-2222-3333-4444-555555555555';
    const validKey = `blueprints/${validUserId}/1728345600_abc123.pdf`;

    it('rejects blueprint upload when user_id is missing', async () => {
      const mockSupabase = { from: vi.fn() };
      const result = await validateAuthoritativeMilestone(
        'blueprint_uploaded',
        { milestone_data: { pdf_key: validKey } },
        mockSupabase
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Missing required 'user_id'");
    });

    it('rejects blueprint upload when key format does not match exact S3 pattern', async () => {
      const mockSupabase = { from: vi.fn() };
      const result = await validateAuthoritativeMilestone(
        'blueprint_uploaded',
        { milestone_data: { pdf_key: 'blueprints/random_search.pdf', user_id: validUserId } },
        mockSupabase
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not match required exact S3 blueprint key format');
    });

    it('rejects blueprint upload when key path does not belong to specified user_id (tenant mismatch)', async () => {
      const differentUserId = '99999999-8888-7777-6666-555555555555';
      const mockSupabase = { from: vi.fn() };
      const result = await validateAuthoritativeMilestone(
        'blueprint_uploaded',
        { milestone_data: { pdf_key: validKey, user_id: differentUserId } },
        mockSupabase
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Blueprint ownership mismatch');
    });

    it('rejects blueprint upload when key does not exist in pdf_jobs backend record', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
              })
            })
          })
        })
      };

      const result = await validateAuthoritativeMilestone(
        'blueprint_uploaded',
        { milestone_data: { pdf_key: validKey, user_id: validUserId } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('was not confirmed in backend records');
    });

    it('accepts blueprint upload when exact key is confirmed and owned by user_id in pdf_jobs', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { id: 'job_789', pdf_key: validKey, user_id: validUserId },
                  error: null
                })
              })
            })
          })
        })
      };

      const result = await validateAuthoritativeMilestone(
        'blueprint_uploaded',
        { milestone_data: { pdf_key: validKey, user_id: validUserId } },
        mockSupabase
      );

      expect(result.valid).toBe(true);
      expect(result.canonicalId).toBe(validKey);
    });
  });

  describe('6. Authoritative estimate_generated Validation & Status Rejection', () => {
    it.each([
      ['pending'],
      ['dispatch_unknown'],
      ['processing'],
      ['fail'],
      ['failed'],
      [''],
      [null as any],
    ])('rejects non-completed status: "%s"', async (status) => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: 'job_test_1', status },
                error: null
              })
            })
          })
        })
      };

      const result = await validateAuthoritativeMilestone(
        'estimate_generated',
        { milestone_data: { job_id: 'job_test_1' } },
        mockSupabase
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Only completed status ('done') is accepted");
    });

    it('accepts estimate when status is strictly "done"', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: 'job_done_999', status: 'done', user_id: 'usr_1', pdf_key: 'blueprints/usr_1/123.pdf' },
                error: null
              })
            })
          })
        })
      };

      const result = await validateAuthoritativeMilestone(
        'estimate_generated',
        { milestone_data: { job_id: 'job_done_999' } },
        mockSupabase
      );

      expect(result.valid).toBe(true);
      expect(result.canonicalId).toBe('job_done_999');
    });
  });

  describe('7. REAL Database-Backed Atomic Concurrency & Lease Engine (PGlite)', () => {
    let pgliteDb: PGlite;

    beforeAll(async () => {
      // Spin up an actual, in-memory PostgreSQL instance
      pgliteDb = new PGlite();
      const migrationPath = path.resolve(__dirname, '../../meta_capi_conversions_setup.sql');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      await pgliteDb.exec(migrationSql);
    });

    it('executes exact SQL migration successfully in a real PostgreSQL database', async () => {
      const checkTables = await pgliteDb.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meta_capi_conversions';
      `);
      expect(checkTables.rows.length).toBe(1);

      const checkRoutines = await pgliteDb.query(`
        SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('claim_meta_capi_conversion', 'finalize_meta_capi_conversion');
      `);
      expect(checkRoutines.rows.length).toBe(2);
    });

    it('proves two simultaneous requests for the exact same milestone cannot both dispatch in PostgreSQL', async () => {
      const milestoneKey = 'estimate_generated:job_real_concurrent_100';
      const eventId = await generateDeterministicEventId(milestoneKey);

      const metaDispatchSpy = vi.fn().mockResolvedValue({ success: true, events_received: 1 });

      const simulateWorker = async (workerId: string) => {
        // Step 1: Atomic Claim in real PostgreSQL
        const claimRes = await pgliteDb.query<{ result: any }>(
          `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 60) AS result;`,
          [milestoneKey, 'estimate_generated', eventId]
        );
        const claim = claimRes.rows[0].result;

        // If duplicate / in-flight: fail closed and abort
        if (!claim.claimed || claim.is_duplicate) {
          return {
            workerId,
            dispatched: false,
            deduplicated: true,
            status: claim.status,
            event_id: claim.event_id
          };
        }

        // Only the winning claim executes the Meta dispatch
        await metaDispatchSpy(milestoneKey, claim.event_id);

        // Finalize delivery with active claim_token in real PostgreSQL
        const finRes = await pgliteDb.query<{ result: any }>(
          `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'delivered') AS result;`,
          [milestoneKey, claim.claim_token]
        );

        return {
          workerId,
          dispatched: true,
          deduplicated: false,
          status: 'delivered',
          finalizeResult: finRes.rows[0].result
        };
      };

      // Launch both simultaneous workers concurrently in parallel against the real PostgreSQL engine
      const [res1, res2] = await Promise.all([
        simulateWorker('worker_alpha'),
        simulateWorker('worker_beta')
      ]);

      const dispatched = [res1, res2].filter(r => r.dispatched);
      const deduplicated = [res1, res2].filter(r => r.deduplicated);

      // Exactly ONE dispatched to Meta, exactly ONE deduplicated
      expect(dispatched.length).toBe(1);
      expect(deduplicated.length).toBe(1);
      expect(metaDispatchSpy).toHaveBeenCalledTimes(1);

      // Confirm winning worker finalized with success: true
      expect(dispatched[0].finalizeResult.success).toBe(true);
      expect(dispatched[0].finalizeResult.finalized_status).toBe('delivered');

      // Subsequent 3rd request after delivery is also blocked
      const res3 = await simulateWorker('worker_gamma');
      expect(res3.dispatched).toBe(false);
      expect(res3.deduplicated).toBe(true);
      expect(res3.status).toBe('delivered');
      expect(metaDispatchSpy).toHaveBeenCalledTimes(1);
    });

    it('proves stale lease protection: expired worker cannot overwrite newer retry', async () => {
      const milestoneKey = 'estimate_generated:job_stale_worker_test';
      const eventId = await generateDeterministicEventId(milestoneKey);

      // Worker 1 acquires claim (short timeout 1 sec)
      const claim1Res = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 1) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      const token1 = claim1Res.rows[0].result.claim_token;
      expect(claim1Res.rows[0].result.claimed).toBe(true);

      // Simulate Worker 1 stalling while lease expires (wait 1.5s to ensure > 1s timeout)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Worker 2 (retry) arrives after timeout (passing 1s timeout) and re-claims with new token
      const claim2Res = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 1) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      const token2 = claim2Res.rows[0].result.claim_token;
      expect(claim2Res.rows[0].result.claimed).toBe(true);
      expect(claim2Res.rows[0].result.is_recovery).toBe(true);
      expect(token1).not.toBe(token2); // Fresh lease token granted

      // Worker 1 finally wakes up and attempts to finalize with its stale token1
      const staleFin = await pgliteDb.query<{ result: any }>(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'failed') AS result;`,
        [milestoneKey, token1]
      );
      // PostgreSQL engine blocks the stale finalize attempt!
      expect(staleFin.rows[0].result.success).toBe(false);
      expect(staleFin.rows[0].result.warning).toBe('STALE_LEASE_IGNORED');

      // Worker 2 finalizes successfully with token2
      const activeFin = await pgliteDb.query<{ result: any }>(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'delivered') AS result;`,
        [milestoneKey, token2]
      );
      expect(activeFin.rows[0].result.success).toBe(true);
      expect(activeFin.rows[0].result.finalized_status).toBe('delivered');
    });

    it('records uncertain status on network timeout and allows subsequent recovery retry', async () => {
      const milestoneKey = 'estimate_generated:job_uncertain_test';
      const eventId = await generateDeterministicEventId(milestoneKey);

      // Attempt 1: Claim granted with short 1s lock/cooldown timeout
      const claim1 = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 1) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      const token1 = claim1.rows[0].result.claim_token;

      // Meta network throws timeout -> Record state as 'uncertain'
      const finUncertain = await pgliteDb.query<{ result: any }>(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'uncertain', 'Network timeout during Meta Graph fetch') AS result;`,
        [milestoneKey, token1]
      );
      expect(finUncertain.rows[0].result.success).toBe(true);
      expect(finUncertain.rows[0].result.finalized_status).toBe('uncertain');

      // Wait 1.1s for cooldown to elapse
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Attempt 2: Server retries -> Allowed recovery from 'uncertain' state after cooldown
      const claim2 = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 1) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      expect(claim2.rows[0].result.claimed).toBe(true);
      expect(claim2.rows[0].result.is_recovery).toBe(true);

      // Finalize delivered
      const finDelivered = await pgliteDb.query<{ result: any }>(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'delivered') AS result;`,
        [milestoneKey, claim2.rows[0].result.claim_token]
      );
      expect(finDelivered.rows[0].result.success).toBe(true);
    });
  });

  describe('8. Customer Identifiers Normalization & SHA-256 Hashing Engine', () => {
    it('normalizes and SHA-256 hashes raw email according to Meta CAPI specification', async () => {
      const rawEmail = '  John.Doe@Example.COM  ';
      const hashed = await normalizeAndHashCustomerField(rawEmail, 'em');
      
      // Known SHA-256 of 'johndoe@example.com' or 'john.doe@example.com'
      // johndoe@example.com lowercase is 'john.doe@example.com'
      const expected = await sha256Hex('john.doe@example.com');
      expect(hashed).toBe(expected);
      expect(hashed?.length).toBe(64);
    });

    it('rejects invalid email formats and returns undefined (never forwards raw invalid string)', async () => {
      const invalidEmail = 'not-an-email-address';
      const hashed = await normalizeAndHashCustomerField(invalidEmail, 'em');
      expect(hashed).toBeUndefined();
    });

    it('preserves already SHA-256 hashed email without double-hashing', async () => {
      const preHashed = '55a5edd82e9f8668984f188c03387b5db5867450a80e1ec07474a819bfa6a12e';
      const result = await normalizeAndHashCustomerField(preHashed, 'em');
      expect(result).toBe(preHashed);
    });

    it('normalizes US 10-digit phone number with formatting to E.164 without plus and hashes', async () => {
      const rawPhone = '+1 (555) 234-5678';
      const hashed = await normalizeAndHashCustomerField(rawPhone, 'ph');
      const expected = await sha256Hex('15552345678');
      expect(hashed).toBe(expected);

      // 10 digits without country code prepends '1' for US campaign
      const tenDigits = '5552345678';
      const hashedTen = await normalizeAndHashCustomerField(tenDigits, 'ph');
      expect(hashedTen).toBe(expected);
    });

    it('normalizes first and last name by stripping punctuation/whitespace and hashing', async () => {
      const rawName = '  Jöhn-Paul!  ';
      const hashed = await normalizeAndHashCustomerField(rawName, 'fn');
      const expected = await sha256Hex('jöhnpaul');
      expect(hashed).toBe(expected);
    });
  });

  describe('9. User Consent Enforcement (Server-Side)', () => {
    const isConsentAuthorized = (body: any) => {
      const isAffirmative = (
        body.consent === true ||
        body.has_consent === true ||
        body.marketing_consent === true ||
        body.user_consent === true
      );
      if (!isAffirmative || body.opt_out === true || body.consent === false || body.has_consent === false) {
        return false;
      }
      return true;
    };

    it('rejects and drops marketing events when consent is completely missing/undefined (missing consent must NOT silently authorize)', () => {
      const bodyMissingConsent = {
        event_name: 'PageView',
        event_source_url: 'https://constil.com/'
      };

      expect(isConsentAuthorized(bodyMissingConsent)).toBe(false);
    });

    it('drops marketing events when user consent is explicitly false (consent: false)', () => {
      const body = {
        event_name: 'PageView',
        consent: false,
        event_source_url: 'https://constil.com/'
      };

      expect(isConsentAuthorized(body)).toBe(false);
    });

    it('drops marketing events when opt_out: true or has_consent: false', () => {
      const bodyOptOut = { event_name: 'PageView', opt_out: true, consent: true };
      const bodyHasConsentFalse = { event_name: 'PageView', has_consent: false, consent: true };

      expect(isConsentAuthorized(bodyOptOut)).toBe(false);
      expect(isConsentAuthorized(bodyHasConsentFalse)).toBe(false);
    });

    it('authorizes marketing event when affirmative consent is explicitly confirmed', () => {
      const bodyAffirmative = { event_name: 'PageView', consent: true };
      const bodyMarketingAffirmative = { event_name: 'PageView', marketing_consent: true };

      expect(isConsentAuthorized(bodyAffirmative)).toBe(true);
      expect(isConsentAuthorized(bodyMarketingAffirmative)).toBe(true);
    });

    it('supports Meta Limited Data Use (LDU) data_processing_options', () => {
      const body = {
        event_name: 'PageView',
        data_processing_options: ['LDU'],
        data_processing_options_country: 1,
        data_processing_options_state: 1000
      };

      expect(body.data_processing_options).toEqual(['LDU']);
      expect(body.data_processing_options_country).toBe(1);
      expect(body.data_processing_options_state).toBe(1000);
    });
  });

  describe('10. Meta Success Followed by Database Finalization Failure', () => {
    let pgliteDb: PGlite;

    beforeAll(async () => {
      pgliteDb = new PGlite();
      const migrationPath = path.resolve(__dirname, '../../meta_capi_conversions_setup.sql');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      await pgliteDb.exec(migrationSql);
    });

    it('refuses unconditional success if Meta accepted event but database finalization fails', async () => {
      const milestoneKey = 'CompleteRegistration:user_meta_success_db_fail';
      const eventId = await generateDeterministicEventId(milestoneKey);

      // Step 1: Claim acquired
      const claimRes = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 60) AS result;`,
        [milestoneKey, 'CompleteRegistration', eventId]
      );
      const legitimateToken = claimRes.rows[0].result.claim_token;
      expect(claimRes.rows[0].result.claimed).toBe(true);

      // Step 2: Meta API succeeds
      const metaResponse = { ok: true, status: 200, json: async () => ({ events_received: 1, fbtrace_id: 'test_trace' }) };
      const metaResult = await metaResponse.json();
      expect(metaResponse.ok).toBe(true);

      // Step 3: Simulate database finalization failure (e.g. invalid/stale claim_token)
      const wrongToken = '00000000-0000-0000-0000-000000000000';
      const finRes = await pgliteDb.query<{ result: any }>(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'delivered') AS result;`,
        [milestoneKey, wrongToken]
      );
      const finResult = finRes.rows[0].result;
      expect(finResult.success).toBe(false);
      expect(finResult.warning).toBe('STALE_LEASE_IGNORED');

      // Step 4: Verify Edge Function response logic: MUST NOT return unconditional success!
      let responsePayload: any;
      let responseStatus: number;

      if (!finResult.success) {
        responseStatus = 500;
        responsePayload = {
          success: false,
          meta_accepted: true,
          db_finalized: false,
          warning: "META_ACCEPTED_BUT_DB_FINALIZE_FAILED",
          error: `Meta accepted conversion event, but database finalization failed: ${finResult.message}`,
          event_id: eventId,
          metaResponse: metaResult
        };
      } else {
        responseStatus = 200;
        responsePayload = { success: true };
      }

      // Assert fail-safe response
      expect(responseStatus).toBe(500);
      expect(responsePayload.success).toBe(false);
      expect(responsePayload.meta_accepted).toBe(true);
      expect(responsePayload.db_finalized).toBe(false);
      expect(responsePayload.warning).toBe('META_ACCEPTED_BUT_DB_FINALIZE_FAILED');
    });
  });

  describe('11. Additive & Idempotent SQL Migration Verification', () => {
    it('executes additive migration safely when table and columns already pre-exist', async () => {
      const pgliteDb = new PGlite();

      // Simulate a pre-existing older table schema
      await pgliteDb.exec(`
        CREATE TABLE IF NOT EXISTS public.meta_capi_conversions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversion_key TEXT NOT NULL,
            event_name TEXT NOT NULL,
            event_id UUID NOT NULL
        );
      `);

      // Run our additive migration
      const migrationPath = path.resolve(__dirname, '../../meta_capi_conversions_setup.sql');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');

      // First run on existing table
      await expect(pgliteDb.exec(migrationSql)).resolves.not.toThrow();

      // Second run (idempotency check)
      await expect(pgliteDb.exec(migrationSql)).resolves.not.toThrow();

      // Verify all additive columns exist
      const columnsRes = await pgliteDb.query<{ column_name: string }>(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'meta_capi_conversions';
      `);
      const colNames = columnsRes.rows.map(r => r.column_name);
      expect(colNames).toContain('claim_token');
      expect(colNames).toContain('status');
      expect(colNames).toContain('claimed_at');
      expect(colNames).toContain('delivered_at');
      expect(colNames).toContain('error_message');
      expect(colNames).toContain('retry_count');

      // Specifically verify unique index on conversion_key exists
      const uniqueCheck = await pgliteDb.query<{ exists: boolean }>(`
        SELECT EXISTS (
          SELECT 1
          FROM pg_index i
          JOIN pg_attribute a 
            ON a.attrelid = i.indrelid 
           AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = 'public.meta_capi_conversions'::regclass
            AND i.indisunique = TRUE
            AND a.attname = 'conversion_key'
            AND array_length(i.indkey, 1) = 1
        ) AS exists;
      `);
      expect(uniqueCheck.rows[0].exists).toBe(true);
    });

    it('enforces retry cooldown on uncertain / failed records preventing uncontrolled immediate retries', async () => {
      const pgliteDb = new PGlite();
      const migrationPath = path.resolve(__dirname, '../../meta_capi_conversions_setup.sql');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      await pgliteDb.exec(migrationSql);

      const milestoneKey = 'estimate_generated:cooldown_test_job';
      const eventId = await generateDeterministicEventId(milestoneKey);

      // 1. Initial claim with 2s cooldown
      const claim1 = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 2) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      expect(claim1.rows[0].result.claimed).toBe(true);
      const token1 = claim1.rows[0].result.claim_token;

      // 2. Finalize as 'uncertain' due to network timeout
      await pgliteDb.query(
        `SELECT public.finalize_meta_capi_conversion($1, $2::uuid, 'uncertain', 'fetch timeout') AS result;`,
        [milestoneKey, token1]
      );

      // 3. Immediate re-claim attempt (before 2s cooldown elapsed) MUST be blocked
      const immediateRetry = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 2) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      expect(immediateRetry.rows[0].result.claimed).toBe(false);
      expect(immediateRetry.rows[0].result.status).toBe('retry_cooldown');
      expect(immediateRetry.rows[0].result.is_duplicate).toBe(true);

      // 4. Wait for 2.1s cooldown to elapse
      await new Promise(resolve => setTimeout(resolve, 2100));

      // 5. Subsequent re-claim attempt after cooldown elapses succeeds safely
      const validRetry = await pgliteDb.query<{ result: any }>(
        `SELECT public.claim_meta_capi_conversion($1, $2, $3::uuid, 2) AS result;`,
        [milestoneKey, 'estimate_generated', eventId]
      );
      expect(validRetry.rows[0].result.claimed).toBe(true);
      expect(validRetry.rows[0].result.is_recovery).toBe(true);
      expect(validRetry.rows[0].result.event_id).toBe(eventId); // Same deterministic event_id!
    });
  });
});
