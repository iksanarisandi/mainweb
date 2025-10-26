# 🛡️ Security Implementation Plan - Main Web Platform

## 📋 Overview
Implementasi keamanan bertahap untuk mencegah abuse, melindungi database, dan mengontrol biaya operasional.

**Timeline Total:** 2-3 minggu
**Approach:** Incremental deployment dengan testing di setiap fase

---

## 🔥 PHASE 1: CRITICAL PROTECTION (Week 1, Days 1-3)
**Goal:** Mencegah spam registration dan brute force attacks
**Risk Level:** CRITICAL
**Effort:** Medium
**Impact:** HIGH - Proteksi immediate terhadap abuse terbesar

### 1.1 Rate Limiting Infrastructure Setup
**Duration:** 4 hours
**Files to create:**
- `workers/src/middleware/rateLimiter.ts`
- `workers/src/utils/ipExtractor.ts`

**Implementation:**
```typescript
// Cloudflare Workers Rate Limiter using Durable Objects
// - Uses Workers KV for simple counter-based limiting
// - IP-based tracking
// - Configurable limits per endpoint
```

**Rate Limits:**
| Endpoint | Limit | Window | Action on Exceed |
|----------|-------|--------|------------------|
| `POST /auth/register` | 3 requests | 1 hour per IP | 429 Too Many Requests |
| `POST /auth/login` | 10 requests | 15 minutes per IP | 429 + temporary block |
| `POST /progress/submit` | 30 requests | 1 hour per user | 429 with retry-after |

**Cost:** FREE (KV included in Workers plan)

### 1.2 Apply Rate Limiting to Auth Routes
**Duration:** 2 hours
**Files to modify:**
- `workers/src/routes/auth.ts`

**Changes:**
- Add rate limiter middleware to register endpoint
- Add rate limiter middleware to login endpoint
- Add proper error responses with retry-after headers

**Testing:**
- Test normal user flow (should work)
- Test spam attempts (should block)
- Test after cooldown period (should work again)

### 1.3 Apply Rate Limiting to Progress Routes
**Duration:** 2 hours
**Files to modify:**
- `workers/src/routes/progress.ts`

**Changes:**
- Add user-based rate limiting for submit endpoint
- Track attempts in KV with user ID as key
- Differentiate between correct and incorrect submissions

**Testing:**
- Test normal submission flow
- Test rapid submissions (should throttle)
- Test multiple users (should be isolated)

### 1.4 Deploy & Monitor Phase 1
**Duration:** 2 hours
**Tasks:**
- Deploy to production
- Monitor error rates in Cloudflare dashboard
- Check for false positives
- Adjust limits if needed

**Success Metrics:**
- Zero spam registrations detected
- Normal users can still register/login
- Response time < 200ms added overhead

**Rollback Plan:**
- Keep rate limiter as separate middleware
- Can disable by removing from route chain
- No data loss risk

---

## ⚡ PHASE 2: INPUT VALIDATION (Week 1, Days 4-5)
**Goal:** Prevent database bloat and invalid data
**Risk Level:** HIGH
**Effort:** Low
**Impact:** MEDIUM - Proteksi database dari spam data

### 2.1 Request Body Size Limits
**Duration:** 2 hours
**Files to modify:**
- `workers/src/index.ts`

**Implementation:**
```typescript
// Global middleware untuk body size limit
// - Max 100KB per request
// - Return 413 Payload Too Large
// - Log oversized requests
```

**Configuration:**
```typescript
const MAX_BODY_SIZE = {
  default: 100 * 1024,        // 100KB
  '/auth/register': 10 * 1024, // 10KB
  '/progress/submit': 50 * 1024 // 50KB for code
};
```

### 2.2 Field-Specific Validation
**Duration:** 3 hours
**Files to modify:**
- `workers/src/routes/auth.ts` - enhance validation
- `workers/src/routes/progress.ts` - add code length check
- `workers/src/routes/admin.ts` - add content length check

**New Validations:**
```typescript
// auth.ts
- email: max 100 chars
- username: 3-20 chars, alphanumeric only
- password: 6-100 chars

// progress.ts
- code_submitted: max 10KB (10,240 chars)
- material_id: valid integer

// admin.ts
- content: max 50KB
- code_example: max 20KB
```

### 2.3 Sanitization Layer
**Duration:** 2 hours
**Files to create:**
- `workers/src/utils/sanitizer.ts`

**Features:**
- Strip dangerous characters from user input
- Normalize unicode to prevent bypass
- Trim excessive whitespace
- Prevent SQL injection patterns

### 2.4 Deploy & Test Phase 2
**Duration:** 1 hour
**Tasks:**
- Deploy to production
- Test with large payloads (should reject)
- Test with normal payloads (should accept)
- Monitor database size growth

**Success Metrics:**
- No requests > 100KB accepted
- Database growth rate normalized
- No false positives on legitimate content

**Rollback Plan:**
- Increase limits if too restrictive
- Can adjust per-endpoint limits independently

---

## 🌐 PHASE 3: CORS & ACCESS CONTROL (Week 2, Days 1-2)
**Goal:** Restrict API access to authorized domains only
**Risk Level:** MEDIUM
**Effort:** Low
**Impact:** MEDIUM - Prevent unauthorized domain usage

### 3.1 CORS Whitelist Configuration
**Duration:** 1 hour
**Files to modify:**
- `workers/src/index.ts`
- Create `workers/src/config/cors.ts`

**Implementation:**
```typescript
const ALLOWED_ORIGINS = [
  'https://mainweb.akses.digital',
  'https://*.mainweb-2i7.pages.dev', // Cloudflare Pages previews
  'http://localhost:3000', // Development
  'http://127.0.0.1:3000'
];

// Dynamic origin checking
// Only allow if origin matches whitelist
```

### 3.2 Environment-Based CORS
**Duration:** 1 hour
**Files to modify:**
- `wrangler.toml` - add env variables

**Configuration:**
```toml
[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGINS = "https://mainweb.akses.digital,https://*.mainweb-2i7.pages.dev"

[env.development]
ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
```

### 3.3 Deploy & Verify Phase 3
**Duration:** 1 hour
**Tasks:**
- Deploy to production
- Test from mainweb.akses.digital (should work)
- Test from random domain (should fail)
- Test CORS preflight requests

**Success Metrics:**
- Only whitelisted domains can access API
- OPTIONS requests handled correctly
- No CORS errors on legitimate requests

**Rollback Plan:**
- Revert to `origin: '*'` if issues detected
- No data changes, pure configuration

---

## 🔍 PHASE 4: MONITORING & LOGGING (Week 2, Days 3-5)
**Goal:** Detect abuse patterns and suspicious activity
**Risk Level:** LOW-MEDIUM
**Effort:** Medium
**Impact:** HIGH - Visibility untuk future security

### 4.1 Request Logging Infrastructure
**Duration:** 4 hours
**Files to create:**
- `workers/src/middleware/logger.ts`
- `workers/src/utils/analytics.ts`

**What to Log:**
```typescript
interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  userId?: number;
  statusCode: number;
  duration: number;
  blocked: boolean;
  reason?: string;
}
```

**Storage:**
- Use Cloudflare Workers Analytics Engine (FREE)
- Or Workers KV with TTL for temporary logs
- Keep last 7 days of suspicious activity

### 4.2 Abuse Detection Patterns
**Duration:** 3 hours
**Files to create:**
- `workers/src/utils/abuseDetector.ts`

**Detection Rules:**
```typescript
// Patterns to detect:
- 5+ failed login attempts from same IP in 5 minutes
- 10+ registration attempts from same IP in 1 hour
- 50+ API requests from same IP in 1 minute
- Repeated wrong answers (>20 in 1 hour)
- Suspicious user agents (bots, scrapers)
```

**Actions:**
- Log to analytics
- Send alert (optional: email/webhook)
- Automatic temporary block (15-60 minutes)

### 4.3 Admin Dashboard Integration
**Duration:** 3 hours
**Files to modify:**
- `workers/src/routes/admin.ts` - add logs endpoint
- `frontend/admin.html` - add logs viewer
- `frontend/js/admin.js` - fetch and display logs

**Features:**
- View recent suspicious activities
- See blocked IPs
- Manual IP block/unblock
- Export logs for analysis

### 4.4 Deploy & Monitor Phase 4
**Duration:** 2 hours
**Tasks:**
- Deploy to production
- Test logging (should see requests)
- Test abuse detection (trigger patterns)
- Verify admin dashboard shows logs

**Success Metrics:**
- All requests logged with < 5ms overhead
- Abuse patterns detected correctly
- Admin can view and manage blocks

**Rollback Plan:**
- Logging is non-blocking
- Can disable without affecting functionality

---

## 🔐 PHASE 5: ADVANCED PROTECTION (Week 3)
**Goal:** Additional security layers
**Risk Level:** LOW
**Effort:** Medium
**Impact:** MEDIUM - Defense in depth

### 5.1 Failed Attempt Tracking
**Duration:** 3 hours
**Files to create:**
- `workers/src/utils/attemptTracker.ts`

**Features:**
- Track failed login by email (not just IP)
- Track wrong submission attempts per material
- Progressive delays (exponential backoff)
- Account lockout after persistent failures

### 5.2 Duplicate Submission Prevention
**Duration:** 2 hours
**Files to modify:**
- `workers/src/routes/progress.ts`

**Implementation:**
```typescript
// Prevent rapid duplicate submissions
// - Track last submission time per user+material
// - Require 5 second cooldown between attempts
// - Prevent submission spam
```

### 5.3 IP Reputation Integration (Optional)
**Duration:** 4 hours
**Files to create:**
- `workers/src/utils/ipReputation.ts`

**Features:**
- Check IP against known VPN/proxy lists
- Flag suspicious IP ranges
- Optional: Block known bad actors
- Use external service (e.g., IPQualityScore API)

**Cost:** May require paid API ($10-50/month)

### 5.4 Content Validation Enhancement
**Duration:** 2 hours
**Files to modify:**
- `workers/src/routes/progress.ts`
- `workers/src/routes/admin.ts`

**Features:**
- Detect and reject malicious code patterns
- XSS prevention in user-submitted code
- SQL injection pattern detection
- Script tag filtering

### 5.5 Deploy & Test Phase 5
**Duration:** 2 hours
**Tasks:**
- Deploy to production
- Test all new protections
- Monitor for false positives
- Fine-tune detection rules

**Success Metrics:**
- Zero false positives on legitimate users
- Malicious patterns blocked
- Progressive delays working correctly

**Rollback Plan:**
- Each feature independent
- Can disable specific protections

---

## 📊 IMPLEMENTATION SCHEDULE

### Week 1: Critical Protection
```
Day 1-2: Phase 1 (Rate Limiting) ⭐⭐⭐ CRITICAL
Day 3: Phase 1 Testing & Monitoring
Day 4-5: Phase 2 (Input Validation) ⭐⭐ HIGH
```

### Week 2: Access Control & Monitoring
```
Day 1-2: Phase 3 (CORS) ⭐ MEDIUM
Day 3-5: Phase 4 (Logging) ⭐⭐ HIGH
```

### Week 3: Advanced Features
```
Day 1-3: Phase 5.1-5.2 (Attempt Tracking)
Day 4-5: Phase 5.3-5.5 (Optional Advanced)
```

---

## 🎯 SUCCESS CRITERIA

### Phase 1 Complete:
- [ ] No spam registrations detected in 7 days
- [ ] Rate limiting working without false positives
- [ ] Response time impact < 50ms

### Phase 2 Complete:
- [ ] Database size growth < 5% per week
- [ ] No oversized payloads accepted
- [ ] All validation working correctly

### Phase 3 Complete:
- [ ] Only whitelisted domains can access API
- [ ] No CORS errors on production
- [ ] Development environment still works

### Phase 4 Complete:
- [ ] All suspicious activity logged
- [ ] Admin dashboard shows real-time data
- [ ] Abuse patterns detected and blocked

### Phase 5 Complete:
- [ ] Advanced protections active
- [ ] Zero false positives in 7 days
- [ ] All security layers working together

---

## 💰 COST ESTIMATE

### Current (No Protection):
- Potential abuse cost: $80-360/month
- Risk: HIGH

### After Phase 1-2 (Critical):
- Protection cost: $0 (included in Workers)
- Abuse prevented: ~90%
- Risk: LOW-MEDIUM

### After Phase 3-4 (Full Basic):
- Protection cost: $0
- Abuse prevented: ~95%
- Risk: LOW

### After Phase 5 (Advanced):
- Protection cost: $0-50/month (if using IP reputation)
- Abuse prevented: ~99%
- Risk: VERY LOW

**ROI:** Even with $50/month added cost, preventing $80-360/month abuse = **$30-310/month saved**

---

## 🚀 DEPLOYMENT STRATEGY

### Per Phase:
1. **Develop locally** with test cases
2. **Deploy to staging** (use wrangler dev)
3. **Test thoroughly** with abuse scenarios
4. **Deploy to production** during low-traffic hours
5. **Monitor for 24 hours** for issues
6. **Adjust/rollback** if needed
7. **Proceed to next phase**

### Rollback Procedure:
```bash
# If issues detected:
git revert <commit-hash>
cd workers
npx wrangler deploy

# Or disable specific middleware:
# Comment out middleware in route files
# Redeploy
```

---

## 📝 TESTING CHECKLIST

### Before Each Deploy:
- [ ] Test normal user flows (register, login, submit)
- [ ] Test rate limiting (spam attempts)
- [ ] Test input validation (oversized data)
- [ ] Test error handling (bad requests)
- [ ] Check response times (< 200ms)
- [ ] Verify no console errors
- [ ] Test on multiple browsers
- [ ] Test mobile devices

### After Each Deploy:
- [ ] Monitor Cloudflare Workers dashboard
- [ ] Check error rates (should be low)
- [ ] Verify legitimate traffic works
- [ ] Test abuse scenarios
- [ ] Monitor costs in billing
- [ ] Check database size
- [ ] Review logs for anomalies

---

## 🆘 EMERGENCY CONTACTS & PROCEDURES

### If Abuse Detected:
1. Check Cloudflare Workers Analytics
2. Identify attack pattern (IP, endpoint, etc)
3. Temporarily block via Cloudflare Firewall
4. Deploy emergency rate limit reduction
5. Review logs and adjust rules

### If Legitimate Users Affected:
1. Check error logs for patterns
2. Identify which protection caused issue
3. Adjust limits (increase threshold)
4. Or temporarily disable problematic rule
5. Notify affected users
6. Deploy fix ASAP

### Escalation:
- **Minor Issues:** Adjust configuration, redeploy
- **Major Issues:** Disable protection layer, investigate
- **Critical Issues:** Rollback to previous version

---

## 📚 DOCUMENTATION TO UPDATE

### After Implementation:
- [ ] Update README.md with security features
- [ ] Document rate limits for frontend devs
- [ ] Add API documentation for error codes
- [ ] Create runbook for common issues
- [ ] Document monitoring procedures
- [ ] Update deployment guide

---

## ✅ SIGN-OFF CHECKLIST

### Before Starting:
- [ ] Backup database
- [ ] Review current metrics (baseline)
- [ ] Test environment ready
- [ ] Git repository clean
- [ ] Time allocated for each phase

### Before Production Deploy:
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Rollback plan ready
- [ ] Monitoring setup
- [ ] Low-traffic deployment window

---

**Next Steps:** 
Shall we start with **Phase 1.1: Rate Limiting Infrastructure**?
