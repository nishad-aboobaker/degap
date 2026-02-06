# Degap Development Environment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

### Initial Setup

1. **Clone the repository** (if not already done):
   ```powershell
   git clone <repository-url>
   cd degap
   ```

2. **Backend Setup**:
   ```powershell
   cd degap-backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**:
   ```powershell
   cd degap-frontend
   npm install
   ```

4. **Start MongoDB** (if using local):
   ```powershell
   Start-Service MongoDB
   ```

---

## 🛠️ Development Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm run seed` | Run database seed script |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |

---

## 🔥 Hot Reload Configuration

### Backend (Nodemon)

**Configuration**: `nodemon.json`

- Watches `src` directory for changes
- Monitors `.js` and `.json` files
- Automatically restarts server on file changes
- Ignores test files and node_modules

**Usage**:
```powershell
cd degap-backend
npm run dev
```

### Frontend (Vite)

**Built-in HMR (Hot Module Replacement)**

- Instant updates without full page reload
- Preserves application state
- Fast refresh for React components

**Usage**:
```powershell
cd degap-frontend
npm run dev
```

---

## 🌐 Running the Full Stack

### Option 1: Separate Terminals

**Terminal 1 - Backend**:
```powershell
cd degap-backend
npm run dev
```

**Terminal 2 - Frontend**:
```powershell
cd degap-frontend
npm run dev
```

### Option 2: VS Code Tasks (Recommended)

Create `.vscode/tasks.json` in the root directory:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/degap-backend"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/degap-frontend"
      },
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start Full Stack",
      "dependsOn": ["Start Backend", "Start Frontend"],
      "problemMatcher": []
    }
  ]
}
```

Then run: **Terminal → Run Task → Start Full Stack**

---

## 🔗 Application URLs

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:5000 | 5000 |
| Frontend | http://localhost:5173 | 5173 |
| MongoDB | mongodb://localhost:27017 | 27017 |

---

## 📝 Environment Variables

### Backend (.env)

Required variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/degap
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend (.env)

Create `.env` in `degap-frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing the Setup

### 1. Test Backend

```powershell
# Health check
curl http://localhost:5000/api/health

# Expected response:
# {"ok":true,"service":"degap-backend","env":"development"}
```

### 2. Test Frontend

Open browser: http://localhost:5173

You should see the React application running.

### 3. Test Hot Reload

**Backend**:
1. Edit any file in `degap-backend/src`
2. Save the file
3. Check terminal - server should restart automatically

**Frontend**:
1. Edit any component in `degap-frontend/src`
2. Save the file
3. Browser should update instantly

---

## 🐛 Troubleshooting

### Backend won't start

```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (replace PID)
taskkill /PID <PID> /F

# Check MongoDB is running
Get-Service MongoDB
```

### Frontend won't start

```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Clear Vite cache
cd degap-frontend
rm -r node_modules/.vite
npm run dev
```

### MongoDB connection errors

```powershell
# Verify MongoDB is running
Get-Service MongoDB

# Start if stopped
Start-Service MongoDB

# Check connection string in .env
```

### Hot reload not working

**Backend**:
- Verify `nodemon.json` exists
- Check file is being watched (not in ignore list)
- Restart the dev server

**Frontend**:
- Clear browser cache
- Restart Vite dev server
- Check browser console for errors

---

## 📚 Code Quality Tools

### ESLint

Enforces code style and catches errors.

```powershell
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

Formats code consistently.

```powershell
# Format all files
npm run format
```

---

## 🔄 Git Workflow

### Recommended Workflow

1. Create feature branch:
   ```powershell
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```powershell
   git add .
   git commit -m "feat: description of changes"
   ```

3. Push and create PR:
   ```powershell
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

---

## 📦 Database Management

### Seed Database

```powershell
cd degap-backend
npm run seed
```

### MongoDB Shell Commands

```powershell
# Connect to MongoDB
mongosh

# Switch to degap database
use degap

# Show all collections
show collections

# View users
db.users.find()

# Clear a collection
db.users.deleteMany({})
```

---

## 🎯 Next Steps

1. ✅ Development environment is set up
2. ✅ Core authentication, database models, and initial APIs implemented
3. ✅ Course browsing, roadmap viewing, progress tracking basics, and course creation UI implemented
4. 🔄 Continue aligning features with `PRD.md`, `DESIGN.md`, and `TODO.md` (see `GAP_MATRIX.md` for current gaps)

---

## 💡 Tips

- Keep both backend and frontend running during development
- Use browser DevTools for frontend debugging
- Check backend terminal for API errors
- Use MongoDB Compass for visual database management
- Run linters before committing code
