# Degap Backend API

Backend API server for the Degap learning platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/degap
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

### Health Check

Visit `http://localhost:5000/api/health` to verify the server is running.

## 📁 Project Structure

```
degap-backend/
├── src/
│   ├── config/          # Configuration files (database, env, passport)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── env.example          # Environment variables template
└── package.json
```

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Environment Variables

See `env.example` for all available environment variables. Key variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `CORS_ORIGIN` - Frontend URL for CORS

## 📝 API Endpoints

API base URL: `/api`

- `GET /api/health` - Health check endpoint

More endpoints will be added as development progresses.

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication (to be implemented)
- Input validation with Zod

## 📚 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Passport.js (OAuth)
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit
- **Logging:** Morgan

## 🧪 Testing

Testing setup will be added in Phase 12.

## 📖 Documentation

Full API documentation will be available once endpoints are implemented.

