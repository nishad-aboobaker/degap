# Degap - Learning Roadmap Platform

A collaborative learning platform designed for self-learners to discover structured learning paths, contribute custom courses and roadmaps, and access curated study materials.

## 🎯 Overview

Degap empowers students with technical backgrounds (developers, engineers, etc.) by providing a community-driven platform where structured learning roadmaps are easily accessible, discoverable, and continuously improved through collaborative contributions.

## ✨ Features

- **Course Discovery**: Browse and search courses by category, technology stack, and difficulty level
- **Structured Roadmaps**: Follow step-by-step learning paths with curated resources
- **Progress Tracking**: Track your learning progress across multiple courses
- **Course Contribution**: Create and submit custom courses and roadmaps
- **Admin Moderation**: Quality-controlled content through admin review
- **User Authentication**: Email/password and OAuth (Google, GitHub) login support
- **Favorites**: Save courses you're interested in for later

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Vite
- **React Router** v6 for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hook Form** for form handling

### Backend
- **Node.js** 18+
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for email notifications

## 📁 Project Structure

```
degap/
├── degap-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── contexts/        # React contexts
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── degap-backend/           # Express backend application
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   └── server.js        # Entry point
│   └── package.json
│
└── docs/                    # Documentation
    ├── PRD.md               # Product Requirements
    ├── DESIGN.md            # Technical Design
    └── TODO.md              # Development Progress
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd degap-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@degap.com
   CLIENT_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd degap-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📚 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/degap` |
| `JWT_SECRET` | Secret key for JWT | Random secure string |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email account | `your@email.com` |
| `EMAIL_PASSWORD` | Email password/app password | Your password |
| `EMAIL_FROM` | From email address | `noreply@degap.com` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🔌 API Endpoints

API documentation is available in the [DESIGN.md](docs/DESIGN.md) file.

Base URL: `http://localhost:5000/api`

### Key Endpoints

- **Auth**: `/api/auth/*` - Registration, login, password reset
- **Courses**: `/api/courses/*` - Browse, create, update courses
- **Roadmaps**: `/api/roadmaps/*` - View and manage roadmaps
- **Progress**: `/api/progress/*` - Track learning progress
- **Admin**: `/api/admin/*` - Admin moderation and analytics

## 👥 User Roles

- **Student**: Browse courses, track progress, favorite courses
- **Contributor**: All student permissions + create and submit courses
- **Admin**: All permissions + content moderation and user management

## 🧪 Testing

```bash
# Backend tests
cd degap-backend
npm test

# Frontend tests
cd degap-frontend
npm test
```

## 📖 Documentation

- [Product Requirements Document (PRD)](docs/PRD.md)
- [Technical Design Document](docs/DESIGN.md)
- [Development Progress Tracker](docs/TODO.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ for the self-learning community.
