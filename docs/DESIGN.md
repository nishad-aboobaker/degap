# Degap - Technical Design Document

**Version:** 1.0  
**Date:** 2026  
**Status:** Design Phase

---

## 📋 Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Project Structure](#2-project-structure)
- [3. Database Design](#3-database-design)
- [4. API Design](#4-api-design)
- [5. Frontend Design](#5-frontend-design)
- [6. Authentication & Authorization](#6-authentication--authorization)
- [7. User Flows](#7-user-flows)
- [8. UI/UX Design Guidelines](#8-uiux-design-guidelines)
- [9. Technical Decisions](#9-technical-decisions)
- [10. Security Considerations](#10-security-considerations)

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   React Frontend │────────▶│  Express Backend │
│  (degap-frontend)│  HTTP   │ (degap-backend) │
└─────────────────┘         └────────┬─────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │   MongoDB       │
                              │   Database     │
                              └─────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │   Google    │  │   GitHub    │  │   Email     │
            │   OAuth     │  │   OAuth     │  │   Service   │
            └─────────────┘  └─────────────┘  └─────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- React 18+ (Vite)
- React Router v6
- Axios for API calls
- React Query (TanStack Query) for state management
- Tailwind CSS + shadcn/ui (or Material-UI)
- React Hook Form for forms
- Zustand/Context API for global state

**Backend:**
- Node.js 18+
- Express.js
- MongoDB with Mongoose
- Passport.js for OAuth
- JWT for authentication
- bcrypt for password hashing
- Nodemailer/SendGrid for emails
- Multer for file uploads

**Database:**
- MongoDB Atlas (cloud) or local MongoDB
- Mongoose ODM

**DevOps:**
- Git for version control
- Environment variables (.env)
- CORS configuration
- Rate limiting

---

## 2. Project Structure

### 2.1 Repository Structure

```
degap/
├── degap-frontend/          # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types (if using TS)
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── degap-backend/           # Express backend application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── services/        # Business logic services
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
├── PRD.md                   # Product Requirements Document
├── DESIGN.md                # This file
└── TODO.md                   # Development TODO tracker
```

### 2.2 Frontend Folder Structure (Detailed)

```
degap-frontend/src/
├── components/
│   ├── common/              # Common reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── Modal.jsx
│   │   └── Toast.jsx
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── OAuthButtons.jsx
│   ├── course/              # Course-related components
│   │   ├── CourseCard.jsx
│   │   ├── CourseList.jsx
│   │   ├── CourseDetail.jsx
│   │   └── CourseForm.jsx
│   ├── roadmap/             # Roadmap components
│   │   ├── RoadmapViewer.jsx
│   │   ├── StepCard.jsx
│   │   ├── RoadmapBuilder.jsx
│   │   └── StepForm.jsx
│   └── admin/               # Admin components
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       └── SubmissionReview.jsx
│
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Courses.jsx
│   ├── CourseDetail.jsx
│   ├── CreateCourse.jsx
│   ├── MyCourses.jsx
│   ├── Progress.jsx
│   ├── Profile.jsx
│   └── Admin/
│       ├── Dashboard.jsx
│       ├── Users.jsx
│       └── Submissions.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useCourse.js
│
├── services/
│   ├── api.js               # Axios instance & interceptors
│   ├── authService.js
│   ├── courseService.js
│   ├── roadmapService.js
│   └── adminService.js
│
├── contexts/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
│
└── utils/
    ├── validators.js
    ├── formatters.js
    └── constants.js
```

### 2.3 Backend Folder Structure (Detailed)

```
degap-backend/src/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── passport.js           # Passport strategies
│   └── env.js                # Environment validation
│
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Roadmap.js
│   ├── UserProgress.js
│   └── Submission.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── course.routes.js
│   ├── roadmap.routes.js
│   ├── progress.routes.js
│   ├── submission.routes.js
│   └── admin.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── course.controller.js
│   ├── roadmap.controller.js
│   ├── progress.controller.js
│   ├── submission.controller.js
│   └── admin.controller.js
│
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── authorize.middleware.js # Role-based access
│   ├── validate.middleware.js # Input validation
│   ├── error.middleware.js   # Error handling
│   └── upload.middleware.js  # File upload
│
├── services/
│   ├── email.service.js
│   ├── jwt.service.js
│   └── validation.service.js
│
└── utils/
    ├── logger.js
    ├── pagination.js
    └── response.js
```

---

## 3. Database Design

### 3.1 Entity Relationship Diagram

```
User ──┬── creates ──▶ Course ──┬── has ──▶ Roadmap
       │                        │
       │                        └── has ──▶ Submission
       │
       ├── tracks ──▶ UserProgress
       │
       └── submits ──▶ Submission
```

### 3.2 User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  password: String (hashed, required if authProvider === 'email'),
  authProvider: String (enum: ['email', 'google', 'github'], default: 'email'),
  authProviderId: String (for OAuth providers),
  profilePicture: String (URL),
  bio: String,
  role: String (enum: ['student', 'contributor', 'admin'], default: 'student'),
  accountStatus: String (enum: ['active', 'suspended', 'banned'], default: 'active'),
  emailVerified: Boolean (default: false),
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `authProviderId` + `authProvider` (compound, for OAuth lookups)

### 3.3 Course Model

```javascript
{
  _id: ObjectId,
  title: String (required, indexed),
  description: String (required),
  category: String (required, indexed), // e.g., 'Web Development', 'Data Science'
  technologyStack: [String], // e.g., ['React', 'Node.js']
  difficultyLevel: String (enum: ['beginner', 'intermediate', 'advanced']),
  prerequisites: [String],
  estimatedDuration: Number, // in hours
  tags: [String],
  
  // Co-ownership support
  createdBy: ObjectId (ref: 'User', required, indexed),
  coOwners: [{
    userId: ObjectId (ref: 'User'),
    addedAt: Date,
    addedBy: ObjectId (ref: 'User')
  }],
  
  status: String (enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'taken_down'], default: 'draft', indexed),
  
  // Approval fields
  approvedBy: ObjectId (ref: 'User'),
  approvedAt: Date,
  rejectionReason: String,
  
  // Metadata
  viewCount: Number (default: 0),
  favoriteCount: Number (default: 0),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `title` (text search)
- `category`
- `status`
- `createdBy`
- `technologyStack` (for filtering)

### 3.4 Roadmap Model

```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required, indexed),
  title: String (required), // e.g., "Beginner Path", "Advanced Path"
  description: String,
  
  steps: [{
    stepNumber: Number (required),
    title: String (required),
    description: String,
    estimatedTime: Number, // in hours
    difficultyLevel: String,
    
    resources: [{
      type: String (enum: ['article', 'video', 'documentation', 'course', 'project', 'book']),
      title: String (required),
      url: String (required),
      description: String
    }],
    
    exercises: [{
      title: String,
      description: String,
      url: String
    }]
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `courseId`

### 3.5 UserProgress Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  courseId: ObjectId (ref: 'Course', required, indexed),
  roadmapId: ObjectId (ref: 'Roadmap', required),
  completedSteps: [Number], // Array of step numbers
  progressPercentage: Number (default: 0),
  startedAt: Date,
  lastAccessedAt: Date,
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` + `courseId` (compound, unique)
- `userId`
- `courseId`

### 3.6 Submission Model

```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required, indexed),
  submittedBy: ObjectId (ref: 'User', required, indexed),
  status: String (enum: ['submitted', 'under_review', 'approved', 'rejected', 'changes_requested'], default: 'submitted', indexed),
  
  // Review fields
  reviewedBy: ObjectId (ref: 'User'),
  reviewedAt: Date,
  reviewNotes: String,
  rejectionReason: String,
  changesRequested: String, // Feedback for resubmission
  
  // History (for tracking changes)
  history: [{
    status: String,
    reviewedBy: ObjectId (ref: 'User'),
    reviewedAt: Date,
    notes: String
  }],
  
  submittedAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `status`
- `submittedBy`
- `courseId`
- `submittedAt` (for sorting)

### 3.7 Favorite Model (Optional - can be embedded in User)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  courseId: ObjectId (ref: 'Course', required, indexed),
  createdAt: Date
}
```

**Indexes:**
- `userId` + `courseId` (compound, unique)

---

## 4. API Design

### 4.1 Base URL Structure

```
Production: https://api.degap.com/api
Development: http://localhost:5000/api
```

### 4.2 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| GET | `/auth/verify-email/:token` | Verify email address | No |
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| GET | `/auth/github` | Initiate GitHub OAuth | No |
| GET | `/auth/github/callback` | GitHub OAuth callback | No |
| POST | `/auth/refresh` | Refresh access token | Yes (refresh token) |

### 4.3 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| GET | `/users/:id` | Get public user profile | No |
| PUT | `/users/settings` | Update account settings | Yes |
| PUT | `/users/password` | Change password | Yes |
| PUT | `/users/email` | Update email | Yes |
| DELETE | `/users/account` | Delete account | Yes |

### 4.4 Course Endpoints

| Method | Endpoint | Description | Auth Required | Access |
|--------|----------|-------------|---------------|--------|
| GET | `/courses` | Get all approved courses | No | Public |
| GET | `/courses/search` | Search courses | No | Public |
| GET | `/courses/:id` | Get course details | No | Public |
| POST | `/courses` | Create new course | Yes | Contributor+ |
| PUT | `/courses/:id` | Update course | Yes | Owner/Co-owner/Admin |
| DELETE | `/courses/:id` | Delete course | Yes | Owner/Admin |
| POST | `/courses/:id/favorite` | Toggle favorite | Yes | Student+ |
| GET | `/courses/my-courses` | Get user's courses | Yes | Contributor+ |
| GET | `/courses/my-favorites` | Get favorite courses | Yes | Student+ |
| POST | `/courses/:id/co-owner` | Add co-owner | Yes | Owner/Admin |
| DELETE | `/courses/:id/co-owner/:userId` | Remove co-owner | Yes | Owner/Admin |

**Query Parameters for GET `/courses`:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `difficulty` - Filter by difficulty level
- `technology` - Filter by technology stack
- `sort` - Sort by (popular, recent, alphabetical)
- `search` - Search query

### 4.5 Roadmap Endpoints

| Method | Endpoint | Description | Auth Required | Access |
|--------|----------|-------------|---------------|--------|
| GET | `/roadmaps/course/:courseId` | Get roadmaps for course | No | Public |
| GET | `/roadmaps/:id` | Get roadmap details | No | Public |
| POST | `/roadmaps` | Create roadmap | Yes | Contributor+ |
| PUT | `/roadmaps/:id` | Update roadmap | Yes | Course Owner/Co-owner/Admin |
| DELETE | `/roadmaps/:id` | Delete roadmap | Yes | Course Owner/Admin |

### 4.6 Progress Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/progress` | Get user's all progress | Yes |
| GET | `/progress/course/:courseId` | Get progress for course | Yes |
| POST | `/progress/step` | Mark step as complete | Yes |
| PUT | `/progress/step` | Update step progress | Yes |
| DELETE | `/progress/course/:courseId` | Reset course progress | Yes |

**Request Body for POST `/progress/step`:**
```json
{
  "courseId": "course_id",
  "roadmapId": "roadmap_id",
  "stepNumber": 1,
  "completed": true
}
```

### 4.7 Submission Endpoints

| Method | Endpoint | Description | Auth Required | Access |
|--------|----------|-------------|---------------|--------|
| POST | `/submissions` | Submit course for review | Yes | Contributor+ |
| GET | `/submissions/my-submissions` | Get user's submissions | Yes | Contributor+ |
| GET | `/submissions/:id` | Get submission details | Yes | Submitter/Admin |
| PUT | `/submissions/:id` | Resubmit after changes | Yes | Submitter |

**Request Body for POST `/submissions`:**
```json
{
  "courseId": "course_id",
  "message": "Optional message for admin"
}
```

### 4.8 Admin Endpoints

| Method | Endpoint | Description | Auth Required | Access |
|--------|----------|-------------|---------------|--------|
| GET | `/admin/users` | Get all users | Yes | Admin |
| GET | `/admin/users/:id` | Get user details | Yes | Admin |
| PUT | `/admin/users/:id/status` | Update user status | Yes | Admin |
| GET | `/admin/submissions` | Get all submissions | Yes | Admin |
| GET | `/admin/submissions/:id` | Get submission details | Yes | Admin |
| PUT | `/admin/submissions/:id/approve` | Approve submission | Yes | Admin |
| PUT | `/admin/submissions/:id/reject` | Reject submission | Yes | Admin |
| PUT | `/admin/submissions/:id/request-changes` | Request changes | Yes | Admin |
| PUT | `/admin/courses/:id/takedown` | Take down course | Yes | Admin |
| GET | `/admin/analytics` | Get platform analytics | Yes | Admin |

**Request Body for PUT `/admin/submissions/:id/reject`:**
```json
{
  "reason": "Reason for rejection"
}
```

**Request Body for PUT `/admin/submissions/:id/request-changes`:**
```json
{
  "feedback": "Detailed feedback for improvements"
}
```

### 4.9 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

### 4.10 HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

---

## 5. Frontend Design

### 5.1 Routing Structure

```javascript
/                           # Landing page (public)
/login                      # Login page (public)
/register                   # Registration page (public)
/forgot-password            # Password reset (public)
/verify-email/:token        # Email verification (public)

/dashboard                  # User dashboard (protected)
/courses                    # Course catalog (public)
/courses/:id                # Course detail (public)
/courses/:id/roadmap        # Roadmap viewer (protected - requires login to start)

/create-course              # Create course (protected - contributor+)
/my-courses                 # My courses (protected - contributor+)
/progress                   # My progress (protected - student+)
/favorites                  # Favorite courses (protected - student+)

/profile                    # User profile (protected)
/settings                   # Account settings (protected)

/admin                      # Admin dashboard (protected - admin)
/admin/users                # User management (protected - admin)
/admin/submissions          # Submission review (protected - admin)
/admin/analytics            # Analytics (protected - admin)
```

### 5.2 Component Hierarchy

```
App
├── AuthContext
├── NotificationContext
├── Router
    ├── Public Routes
    │   ├── Landing
    │   ├── Login
    │   ├── Register
    │   └── CourseDetail (view only)
    │
    ├── Protected Routes
    │   ├── Dashboard
    │   ├── CourseDetail (with start functionality)
    │   ├── RoadmapViewer
    │   ├── CreateCourse
    │   ├── MyCourses
    │   ├── Progress
    │   ├── Profile
    │   └── Settings
    │
    └── Admin Routes
        ├── AdminDashboard
        ├── UserManagement
        └── SubmissionReview
```

### 5.3 State Management Strategy

**React Query (TanStack Query)** for:
- Server state (courses, roadmaps, user data)
- Caching and synchronization
- Background updates

**Context API** for:
- Authentication state
- User profile
- Global notifications

**Local State (useState)** for:
- Form inputs
- UI state (modals, dropdowns)
- Component-specific state

### 5.4 API Service Layer

**Structure:**
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // For httpOnly cookies
});

// Request interceptor - add token if available
api.interceptors.request.use((config) => {
  // Token handled by httpOnly cookies
  return config;
});

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Service Examples:**
```javascript
// services/courseService.js
import api from './api';

export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  favorite: (id) => api.post(`/courses/${id}/favorite`),
  addCoOwner: (id, userId) => api.post(`/courses/${id}/co-owner`, { userId }),
};
```

---

## 6. Authentication & Authorization

### 6.1 Authentication Flow

**Email/Password:**
1. User registers → Password hashed with bcrypt
2. Email verification token sent
3. User verifies email
4. User logs in → JWT access token + refresh token generated
5. Tokens stored in httpOnly cookies

**OAuth (Google/GitHub):**
1. User clicks OAuth button → Redirected to provider
2. User authorizes → Callback with code
3. Backend exchanges code for user info
4. User created/logged in → JWT tokens generated
5. Tokens stored in httpOnly cookies

### 6.2 Token Management

**Access Token:**
- Expires in: 15 minutes
- Stored in: httpOnly cookie
- Contains: userId, role, email

**Refresh Token:**
- Expires in: 7 days
- Stored in: httpOnly cookie
- Used to: Generate new access token

**Token Refresh Flow:**
1. Access token expires
2. Frontend automatically calls `/auth/refresh`
3. Backend validates refresh token
4. New access token issued
5. User continues seamlessly

### 6.3 Authorization (Role-Based Access Control)

**Roles:**
- `student` - Can view courses, start roadmaps, track progress
- `contributor` - All student permissions + create/edit courses
- `admin` - All permissions + moderation and management

**Authorization Checks:**
- Middleware: `requireAuth` - Checks if user is authenticated
- Middleware: `requireRole(['contributor', 'admin'])` - Checks role
- Middleware: `requireAdmin` - Checks if admin
- Controller: Check course ownership (createdBy or coOwners)

**Course Ownership:**
- Owner: `createdBy === userId`
- Co-owner: `coOwners.includes(userId)`
- Admin: `role === 'admin'`

---

## 7. User Flows

### 7.1 Student Flow: Browse and Learn

1. **Landing Page** → Browse featured courses
2. **Course Catalog** → Search/filter courses
3. **Course Detail** → View course info (public)
4. **Click "Start Learning"** → Redirected to login (if not logged in)
5. **Login** → Redirected back to course
6. **Roadmap Viewer** → View steps, mark complete, track progress
7. **Progress Dashboard** → View all courses in progress

### 7.2 Contributor Flow: Create Course

1. **Login** → Navigate to "Create Course"
2. **Course Form** → Fill course details, save as draft
3. **Roadmap Builder** → Add steps, resources, exercises
4. **Preview** → Review course and roadmap
5. **Submit** → Submit for admin review
6. **My Submissions** → Track submission status
7. **If Changes Requested** → Edit and resubmit
8. **If Approved** → Course goes live

### 7.3 Co-Ownership Flow

1. **Course Owner** → Navigate to course settings
2. **Add Co-Owner** → Enter email or username
3. **Co-Owner Receives Notification** → Accepts invitation
4. **Co-Owner Can** → Edit course, add roadmaps, submit for review
5. **Owner Can** → Remove co-owners, manage permissions

### 7.4 Admin Flow: Content Moderation

1. **Admin Dashboard** → View pending submissions
2. **Review Submission** → View course details and roadmap
3. **Decision:**
   - **Approve** → Course goes live
   - **Reject** → Provide reason, course stays draft
   - **Request Changes** → Provide feedback, course status changes
4. **User Receives Notification** → Updates course if needed
5. **Resubmission** → Admin reviews again

### 7.5 Public Access Flow

1. **Non-logged-in User** → Can browse courses
2. **View Course Detail** → See all course information
3. **View Roadmap** → See roadmap structure (read-only)
4. **Click "Start Learning"** → Redirected to login
5. **After Login** → Can mark steps complete, track progress

---

## 8. UI/UX Design Guidelines

### 8.1 Design System

**Color Palette:**
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale (#F9FAFB to #111827)

**Typography:**
- Headings: Bold, 24px-48px
- Body: Regular, 16px
- Small: Regular, 14px
- Font Family: Inter, system-ui, sans-serif

**Spacing:**
- Base unit: 4px
- Common: 8px, 16px, 24px, 32px, 48px

**Components:**
- Buttons: Primary, Secondary, Outline, Ghost
- Cards: Elevated with shadow, rounded corners
- Forms: Clear labels, helpful error messages
- Modals: Centered, backdrop blur

### 8.2 Key Pages Design

**Landing Page:**
- Hero section with value proposition
- Featured courses carousel
- Categories grid
- Call-to-action buttons

**Course Catalog:**
- Search bar at top
- Filter sidebar (collapsible on mobile)
- Course grid (3 columns desktop, 2 tablet, 1 mobile)
- Pagination at bottom

**Course Detail:**
- Course header with image/banner
- Course info card (difficulty, duration, etc.)
- Action buttons (Start, Favorite, Share)
- Description section
- Roadmap preview
- Creator info

**Roadmap Viewer:**
- Progress bar at top
- Step list (expandable cards)
- Each step shows:
  - Title and description
  - Resources (links)
  - Exercises
  - Checkbox to mark complete
- Smooth scrolling between steps

**Roadmap Builder:**
- Drag-and-drop step reordering
- Step form (inline editing)
- Resource management (add/remove)
- Live preview
- Save draft button

**Admin Dashboard:**
- Statistics cards (users, courses, submissions)
- Recent activity feed
- Quick actions
- Navigation to management pages

### 8.3 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Considerations:**
- Hamburger menu
- Collapsible filters
- Single column layouts
- Touch-friendly buttons (min 44px)
- Bottom navigation (optional)

### 8.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Alt text for images
- ARIA labels where needed
- Color contrast ratios

---

## 9. Technical Decisions

### 9.1 Project Structure Decision

**Decision:** Separate folders (`degap-frontend` and `degap-backend`)

**Rationale:**
- Clear separation of concerns
- Independent deployment
- Easier to scale teams
- Different dependencies and build processes

### 9.2 Co-Ownership Implementation

**Decision:** Support multiple co-owners per course

**Implementation:**
- `coOwners` array in Course model
- Co-owners can edit course and roadmaps
- Co-owners can submit for review
- Owner can add/remove co-owners
- Admin can manage co-ownership

**Considerations:**
- Conflict resolution (last edit wins or merge)
- Notification system for co-owner actions
- Permission levels (future: read-only, edit, admin)

### 9.3 Public Access Strategy

**Decision:** Non-logged-in users can view courses but need login to start

**Implementation:**
- Public routes for course browsing
- Protected routes for progress tracking
- Conditional rendering based on auth state
- Redirect to login when starting course

**Benefits:**
- Better SEO
- Lower barrier to entry
- Users can explore before committing

### 9.4 Resubmission Flow

**Decision:** Admin can request changes, user can resubmit

**Implementation:**
- `changes_requested` status in Submission
- Admin provides feedback
- User edits course
- User resubmits (creates new submission or updates existing)
- Admin reviews again

**Considerations:**
- Track submission history
- Limit resubmission attempts (optional)
- Auto-approve after X successful reviews (optional)

### 9.5 State Management Choice

**Decision:** React Query + Context API

**Rationale:**
- React Query handles server state efficiently
- Context API for global UI state
- Less boilerplate than Redux
- Built-in caching and synchronization

### 9.6 UI Library Choice

**Recommendation:** Tailwind CSS + shadcn/ui

**Rationale:**
- Highly customizable
- Modern design system
- Good performance
- Easy to maintain
- Alternative: Material-UI (if preferred)

---

## 10. Security Considerations

### 10.1 Authentication Security

- Passwords hashed with bcrypt (salt rounds: 10+)
- JWT tokens in httpOnly cookies (prevents XSS)
- CSRF protection for state-changing operations
- Rate limiting on authentication endpoints
- Email verification required

### 10.2 Authorization Security

- Role-based access control (RBAC)
- Ownership checks (createdBy, coOwners)
- Admin-only endpoints protected
- Input validation on all endpoints
- SQL injection prevention (MongoDB parameterized queries)

### 10.3 Data Security

- Input sanitization
- XSS prevention
- URL validation before saving
- File upload restrictions (type, size)
- Environment variables for secrets
- HTTPS in production

### 10.4 API Security

- CORS configuration
- Rate limiting per IP/user
- Request size limits
- Error messages don't expose sensitive info
- Logging without sensitive data

---

## 11. Development Workflow

### 11.1 Environment Setup

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/degap
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Degap
```

### 11.2 Development Commands

**Backend:**
```bash
cd degap-backend
npm install
npm run dev        # Development with nodemon
npm start          # Production
npm test           # Run tests
```

**Frontend:**
```bash
cd degap-frontend
npm install
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Run tests
```

### 11.3 Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes

**Commit Convention:**
```
feat: Add course creation form
fix: Fix authentication token refresh
docs: Update API documentation
style: Format code with Prettier
refactor: Refactor roadmap builder
test: Add tests for course service
chore: Update dependencies
```

---

## 12. Next Steps

1. **Review and Approve Design** - Team review of this document
2. **Setup Projects** - Initialize frontend and backend folders
3. **Database Setup** - Create MongoDB database and collections
4. **Implement Authentication** - Start with email/password, then OAuth
5. **Build Core Features** - Course browsing, creation, roadmap builder
6. **Admin Features** - Moderation and management tools
7. **Testing** - Unit, integration, and E2E tests
8. **Deployment** - Setup production environments

---

**Document Status:** Ready for Review  
**Last Updated:** 2024  
**Next Review:** After implementation begins

