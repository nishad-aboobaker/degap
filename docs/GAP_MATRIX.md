## Degap Gap Matrix (TODO vs DESIGN/PRD vs Code)

This file summarizes where the current implementation diverges from the plan. It is a living artifact to be kept in sync with `TODO.md`, `DESIGN.md`, and `PRD.md`.

### Phase 2 – Authentication & Session (PRD 3.1, DESIGN 6, TODO Phase 2)

- **Email/password auth**
  - **Status**: Implemented and aligned.
  - **Code**: `degap-backend/src/controllers/auth.controller.js`, `degap-backend/src/models/User.js`, `degap-backend/src/routes/auth.routes.js`, `degap-frontend/src/contexts/AuthContext.jsx`, `degap-frontend/src/services/auth.service.js`.
- **OAuth (Google/GitHub)**
  - **Status**: Planned (PRD/DESIGN/TODO) but **not yet implemented**.
  - **Expected**: Passport strategies and routes for Google/GitHub login + callback, user creation/linking, token issuance.
  - **Code today**: No Passport config, no `/auth/google`/`/auth/github` routes.
- **Session management & refresh**
  - **Status**: Implemented and aligned with DESIGN (access + refresh tokens via httpOnly cookies, refresh endpoint).
  - **Code**: `auth.controller.js` (`login`, `refreshToken`), `degap-frontend/src/services/api.js` interceptor, `AuthContext`.

### Phase 3 – Database Models (DESIGN 3, PRD 4.3, TODO Phase 3)

- **User model**
  - **Status**: Matches DESIGN/PRD fields for auth provider, profile, role, accountStatus, email verification, reset tokens, refresh tokens.
  - **Code**: `degap-backend/src/models/User.js`.
- **Course model**
  - **Status**: **Partially aligned**.
  - **Matches**: Core fields (title, description, category, difficulty, prerequisites, estimatedDuration, viewCount, favoriteCount, createdBy, approvedBy, approvedAt, status).
  - **Missing vs DESIGN/PRD**:
    - `technologyStack` vs current `technologies`.
    - `tags` array.
    - Co-ownership fields (`coOwners` subdocuments).
    - Extended status values (`under_review`, `taken_down`) and `rejectionReason`.
  - **Code**: `degap-backend/src/models/Course.js`.
- **Roadmap, UserProgress, Submission, Favorite models**
  - **Status**: Largely aligned with DESIGN structures and PRD schemas; minor differences are mostly naming/optional metadata.
  - **Code**: `degap-backend/src/models/{Roadmap.js,UserProgress.js,Submission.js,Favorite.js}`.

### Phase 4 – Backend API (DESIGN 4, PRD 4.4–4.7, TODO Phase 4)

- **Auth & user endpoints**
  - **Status**: Implemented and generally aligned with DESIGN/PRD (register, login, logout, forgot/reset password, verify email, refresh, profile endpoints).
  - **Gap**: Missing OAuth endpoints and any `/auth/*` passport-based flows.
- **Course endpoints**
  - **Status**: CRUD, listing, and basic filtering implemented.
  - **Gaps vs DESIGN/PRD/TODO**:
    - Co-owner endpoints (`POST /courses/:id/co-owner`, `DELETE /courses/:id/co-owner/:userId`) not implemented.
    - Response format is ad-hoc per controller, not using the standardized success/error/paginated response shape from DESIGN.
    - Some filtering/sorting options exist but are not fully wired up to all PRD fields (e.g., technology stack naming).
- **Roadmap, Progress, Submission, Admin endpoints**
  - **Status**: Core endpoints exist and roughly match the route list in DESIGN/PRD.
  - **Gaps**: Some status transitions, error codes, and response envelopes differ from the standardized format in DESIGN.

### Phase 5–7 – Frontend (DESIGN 5, PRD 3.2–3.3, TODO Phases 5–7)

- **Routing & protected routes**
  - **Status**: Routing and protected routes are in place and broadly follow DESIGN (public auth pages, protected dashboard/course creation, etc.).
  - **Code**: `degap-frontend/src/App.jsx`, `components/common/{ProtectedRoute,AdminRoute}.jsx`, page components under `src/pages`.
- **Course listing & discovery (Phase 6 / PRD 3.2.1)**
  - **Implemented**: Basic listing, filtering, and detail view.
  - **Missing**:
    - Empty state when there are no courses.
    - Visual filter chips/tags to show active filters.
    - Some of the richer UX from DESIGN (e.g., full filter/sort combinations).
- **Roadmap viewing & progress (Phase 6 / PRD 3.2.2)**
  - **Implemented**: Roadmap viewer UI and step rendering.
  - **Missing**:
    - UI/logic to mark steps complete and show accurate progress percentage/bar.
    - Full persistence wiring to progress endpoints.
- **Course creation & roadmap builder (Phase 7 / PRD 3.3)**
  - **Implemented**: Basic create-course page and roadmap creation support.
  - **Missing**:
    - Draft save functionality and explicit draft status handling.
    - Tags/keywords input.
    - Richer editor experience for course description (currently simple input/textarea).

### Phase 8–10 – Roadmap Builder, Progress Tracking, Admin

- **Roadmap builder**
  - **Status**: Basic roadmap creation/editing is present but lacks all UX niceties from DESIGN (drag-and-drop reordering, live preview).
- **Progress tracking**
  - **Status**: Backend model and endpoints exist; frontend integration is partially wired (no full-progress UI in viewer yet).
- **Admin features**
  - **Status**: Admin controllers and routes exist; basic moderation flow is present.
  - **Gap**: Admin analytics and some advanced queue/filters from PRD are not yet implemented.

### Cross-cutting – Response format, utilities, and tracking

- **Standardized response & pagination**
  - **Status**: Not yet centralized; controllers return slightly different JSON shapes.
  - **Planned**: `response` and `pagination` utilities to standardize success/error/paginated responses.
- **TODO.md progress summary**
  - **Status**: Out of sync with actual implementation (several phases have many `[x]` items but 0/x in the summary).

