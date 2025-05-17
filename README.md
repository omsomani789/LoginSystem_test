# Login System

A modern login system built with Next.js (Frontend) and Node.js (Backend) with MySQL database integration.

## Project Structure

```
login/
├── frontend/           # Next.js frontend application
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
│
├── backend/           # Node.js backend application
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   └── package.json  # Backend dependencies
```

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd login
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Features

- User Authentication (Login/Register)
- Secure Password Hashing
- JWT Token-based Authentication
- Protected Routes
- Responsive Design
- Form Validation
- Error Handling

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/verify - Verify JWT token

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 