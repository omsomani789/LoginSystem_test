# Project Rules and Guidelines

## Technology Stack
### Frontend
- Next.js (Latest Version)
- Tailwind CSS for styling
- Client-side form validation
- Protected routes using middleware

### Backend
- Node.js (Latest LTS Version)
- Express.js (Latest Version)
- MySQL Database
- JWT for authentication

## Project Structure
```
project/
├── frontend/                 # Next.js application
│   ├── app/                 # App router directory
│   │   ├── signup/         # Signup page
│   │   ├── login/          # Login page
│   │   ├── profile/        # Profile page (protected)
│   │   └── api/            # API routes
│   ├── components/         # Reusable components
│   └── lib/               # Utility functions
│
└── backend/                # Node.js/Express application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── middleware/    # Custom middleware
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   └── utils/         # Utility functions
    └── config/            # Configuration files
```

## Authentication Rules
1. JWT Token:
   - Generated upon successful login/signup
   - Stored in HTTP-only cookies
   - Verified for protected routes
   - Expires after 24 hours

2. Protected Routes:
   - Profile page must be protected
   - Profile update must be protected
   - Password update must be protected

## API Endpoints
1. Authentication:
   - POST /api/auth/signup
     - Request Body: { full_name, mobile_number, password }
     - Response: { success, message, token }
   - POST /api/auth/login
     - Request Body: { mobile_number, password }
     - Response: { success, message, token, user }

2. User Profile:
   - GET /api/profile (protected)
     - Response: { success, user: { full_name, mobile_number } }
   - PUT /api/profile (protected)
     - Request Body: { full_name, mobile_number }
     - Response: { success, message, user }
   - PUT /api/profile/password (protected)
     - Request Body: { current_password, new_password }
     - Response: { success, message }

3. Error Responses:
   - 400: Bad Request (Invalid input)
   - 401: Unauthorized (Invalid/Expired token)
   - 500: Server Error

## Database Rules
1. User Table Fields:
   - id (Primary Key)
   - full_name
   - mobile_number (Unique)
   - password (Hashed)
   - created_at
   - updated_at

## Security Rules
1. Password:
   - Must be hashed using bcrypt
   - Minimum 8 characters
   - Must contain uppercase, lowercase, number, and special character

2. Mobile Number:
   - Must be unique
   - Must be 10 digits

3. JWT:
   - Must be signed with a secure secret key
   - Must be stored in environment variables

## Code Style Rules
1. Naming Conventions:
   - Components: PascalCase (e.g., UserProfile.tsx)
   - Functions: camelCase (e.g., handleSubmit)
   - Variables: camelCase (e.g., userData)
   - Constants: UPPER_SNAKE_CASE (e.g., API_URL)

2. File Structure:
   - One component per file
   - Separate API calls into service files
   - Keep components small and focused

## Error Handling Rules
1. Frontend:
   - Display user-friendly error messages
   - Handle network errors gracefully
   - Validate form inputs before submission

2. Backend:
   - Return appropriate HTTP status codes
   - Provide clear error messages
   - Log errors for debugging

## Testing Rules
1. API Testing:
   - Test all endpoints
   - Test authentication
   - Test error cases

2. Component Testing:
   - Test form validation
   - Test protected routes
   - Test user interactions

## Documentation Rules
1. Code Documentation:
   - Document complex functions
   - Document API endpoints
   - Include setup instructions

2. API Documentation:
   - Document request/response formats
   - Document error responses
   - Document authentication requirements 