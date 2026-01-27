# Degap Frontend

Frontend application for the Degap learning platform built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Degap
```

### Running the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173` (Vite default port).

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
degap-frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Header, Footer, Loading, etc.
│   │   ├── auth/        # Authentication components
│   │   ├── course/      # Course-related components
│   │   ├── roadmap/     # Roadmap components
│   │   └── admin/       # Admin components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/         # API service layer
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .eslintrc.cjs         # ESLint configuration
├── .prettierrc           # Prettier configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The design system includes:

- **Colors:** Primary (Blue), Secondary (Purple)
- **Components:** Buttons, Cards, Forms
- **Responsive:** Mobile-first approach

## 📚 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **State Management:** React Query (TanStack Query) + Context API
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)
- `VITE_APP_NAME` - Application name

## 📖 Development

The app uses:
- **React Query** for server state management
- **Context API** for authentication state
- **React Router** for navigation
- **Axios** for API calls with interceptors

## 🧪 Testing

Testing setup will be added in Phase 12.
