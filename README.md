# React Collaboration App

A real-time collaboration application built with React, TypeScript, and Socket.IO.

## Features

- 🔐 **Authentication**: Login and registration with JWT
- 🏠 **Room Management**: Create, join, and manage public/private rooms
- 🔄 **Real-time Updates**: Live room updates via Socket.IO
- 🎨 **Modern UI**: Clean design with Tailwind CSS
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔒 **Protected Routes**: Authentication-based routing
- 💾 **Persistent State**: Auth state persisted in localStorage

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## Prerequisites

- Node.js 16+
- Backend server running on `http://localhost:3001`

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Backend API

The app expects a backend server with the following endpoints:

### Authentication

- `POST /auth/login` - Login with email/password
- `POST /users/register` - Register new user
- `GET /users/:id` - Get user info (protected)

### Socket.IO Events

- **Server emits**: `rooms:list`, `room:created`, `room:deleted`, `user:joined`, `user:left`
- **Client emits**: `room:create`, `room:join`, `room:leave`, `room:delete`
- **Collaboration**: `cursor:move`, `cursor:leave`

## Project Structure

```
src/
├── api/              # API services and axios config
├── components/       # Reusable UI components
│   └── layout/      # Layout components (Header, Sidebar)
├── features/        # Custom hooks and business logic
├── pages/           # Page components
├── store/           # Jotai atoms and state
├── router.tsx       # Routing configuration
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

No environment variables are required for the frontend. The backend URLs are hardcoded:

- API: `http://localhost:3001`
- Socket.IO: `ws://localhost:3001`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License
