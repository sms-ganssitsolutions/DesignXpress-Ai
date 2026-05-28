# Testing Guide

This document outlines the testing strategy, tools, and practices for DesignXpress AI Story Video Studio.

## Current Testing State

As of v1.0, the project has **limited automated testing**. Most verification is done manually during development.

The goal is to grow a practical testing suite focused on the most critical paths:
- FFmpeg rendering pipeline
- Export queue reliability
- Authentication and authorization
- Real-time collaboration flows
- AI service integrations (with mocking)

## Recommended Testing Stack

### Frontend (Next.js)
- **Unit/Component**: Vitest + React Testing Library
- **E2E**: Playwright (recommended for UI-heavy app like the Studio)
- **Visual Regression**: Optional (Chromatic or Percy)

### Backend (Express + TypeScript)
- **Unit**: Vitest or Jest
- **Integration**: Supertest for API routes
- **E2E / Contract**: Testcontainers for database/Redis isolation

### FFmpeg & Media
- Golden file testing (compare output hashes or use perceptual diff tools)
- Mock heavy FFmpeg calls during CI

## Running Tests (When Implemented)

```powershell
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

## What to Test (Priority Order)

### High Priority (Must Have Soon)
1. **Export Queue & FFmpeg**
   - Job queuing, status transitions, error handling
   - Successful render with video + voiceover + music
   - Failure cases (missing files, invalid durations)

2. **Authentication**
   - JWT validation
   - Protected route access
   - Login/Register flows

3. **Real-time Collaboration**
   - Socket room joining
   - Event broadcasting (cursors, scene updates, chat)

### Medium Priority
- AI service fallbacks and error paths
- Project version history (save/restore)
- Media upload validation and storage
- Public template publishing and loading

### Lower Priority (Nice to Have)
- Full E2E user journeys in the Studio
- Performance benchmarks for rendering

## Testing Strategy Recommendations

### 1. Test Pyramid
- **Many unit tests** for pure functions (e.g., scene duration calculations, prompt builders)
- **Fewer integration tests** for API + DB interactions
- **Critical E2E flows** only (e.g., create project → add scene with video → queue export → verify output)

### 2. Mocking Strategy
- Mock external AI APIs (OpenAI, ElevenLabs, Stability) to avoid costs and flakiness
- Use test doubles for FFmpeg during unit tests
- Use real Redis/Postgres in integration tests (via Testcontainers or Docker Compose test profile)

### 3. Test Data
- Use the existing Prisma seed for consistent demo data
- Create factories for Scenes, Projects, Users in tests

### 4. CI/CD
- Run lint + type check on every push
- Run unit + integration tests on pull requests
- Run E2E only on main branch or manually (due to time cost)

## Example Test Structure (Future)

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
frontend/
├── __tests__/
│   ├── components/
│   ├── lib/
│   └── e2e/
```

## Manual Testing Checklist (Current)

Until automated tests are added, use this checklist before major releases:

- [ ] Fresh install via `install.ps1` + `setup.ps1` works on clean Windows machine
- [ ] Create project → Add scene with real video → Attach voiceover → Export with music → Verify output plays correctly
- [ ] Two browser tabs on same project: cursors visible, scene edits sync, chat works
- [ ] AI Script generation works (both with and without OpenAI key)
- [ ] Version History: Save changes → Restore previous version successfully
- [ ] BullMQ export job: Queue multiple exports → Verify they process without race conditions
- [ ] Public template: Publish → Load in new project → Scenes appear correctly

## Next Steps for Testing

1. Add Vitest + React Testing Library to frontend
2. Add basic API integration tests with Supertest in backend
3. Create a small set of E2E tests with Playwright focused on the Studio export flow
4. Set up GitHub Actions workflow for CI

## Example Test Ideas

**Frontend Component Test (Vitest + RTL)**

```ts
import { render, screen } from '@testing-library/react';
import { StudioTimeline } from '../components/StudioTimeline';

test('renders scenes correctly', () => {
  render(<StudioTimeline scenes={[{id:1, title:'Opening', duration:10}]} />);
  expect(screen.getByText('Opening')).toBeInTheDocument();
});
```

**Backend Integration Test (Supertest)**

```ts
import request from 'supertest';
import app from '../src/index';

test('POST /export/video returns jobId', async () => {
  const res = await request(app)
    .post('/api/export/video')
    .set('Authorization', `Bearer ${testToken}`)
    .send({ projectId: 'test', scenes: [] });

  expect(res.body.jobId).toBeDefined();
});
```

---

**Contribution Opportunity**: Adding a solid testing foundation is one of the highest-impact ways to help the project at this stage.
