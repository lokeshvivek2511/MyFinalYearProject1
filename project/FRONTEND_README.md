# Farmer Assistance Platform - Frontend

A professional React + Vite frontend application for the Farmer Assistance Platform.

## Features Implemented

### Authentication
- User registration with 3-step form (Auth details → Profile → Background)
- Login with phone and password
- Admin login with separate flow
- Role selection (Farmer/Expert) during registration
- JWT token-based authentication

### Dashboard
- Overview statistics (total questions, user questions, user answers)
- Trending questions display
- Quick links to all major features
- Personalized welcome message

### Crop Recommendation
- Manual input form for soil parameters (N, P, K, pH)
- Weather data input (Temperature, Humidity, Rainfall)
- Top 3 crop recommendations with confidence scores
- Clean, professional results display

### Government Schemes
- Advanced filter system with user profile pre-filled defaults
- Grid layout (2 columns × 3 rows) with pagination
- Modal for detailed scheme information
- 6 schemes per page with navigation
- Displays benefits, eligibility, conditions, steps, and official links

### Community Q&A
- Three tabs: All Questions, My Questions, My Answers
- Search functionality across questions
- Question/Answer posting with authentication
- Translation feature for multilingual support
- Voting system (upvote/downvote) with reputation tracking
- Expert badge display for verified experts
- Answer sorting (user's answer → expert answers → others by reputation)

### Profile Management
- View and edit personal information
- Update location and background details
- Display role status (Farmer/Expert/Pending)
- Statistics display (questions, answers, reputation)

### Admin Panel
- Separate admin login with password
- View pending expert approval requests
- Approve users as experts with one click
- Detailed user information display

## Technical Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

## Project Structure

```
src/
├── api/              # API service files
├── components/
│   ├── common/       # Reusable components (Button, Input, Card, Loading)
│   └── layout/       # Layout components (Navbar, Sidebar, PageWrapper)
├── pages/
│   ├── auth/         # Login, Register
│   ├── dashboard/    # Dashboard
│   ├── crop/         # Crop Recommendation
│   ├── schemes/      # Government Schemes
│   ├── community/    # Community Q&A
│   ├── profile/      # Profile Management
│   └── admin/        # Admin Login & Dashboard
├── context/          # Auth context
├── routes/           # Protected route component
└── App.jsx           # Main app with routing
```

## API Integration

All API calls are made to `http://localhost:5000/api` with the following endpoints:

- `/auth/register` - User registration
- `/auth/login` - User login
- `/users/me` - Get/Update user profile
- `/crop/recommend` - Get crop recommendations
- `/schemes/eligible` - Get eligible schemes
- `/questions` - Get/Post questions
- `/answers` - Get/Post/Vote answers
- `/translate` - Translate text
- `/admin/login` - Admin login
- `/admin/approve-expert/:userId` - Approve expert

## Design Principles

- **Professional & Clean** - Neutral color palette with green accent
- **Responsive** - Mobile-first design with proper breakpoints
- **Accessible** - Proper form labels, focus states, and ARIA attributes
- **Consistent** - Reusable components with standardized spacing
- **User-Friendly** - Clear navigation, loading states, and error handling

## Running the Application

1. Make sure the backend is running on `http://localhost:5000`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

## Notes

- No hardcoded data - all information fetched from API
- Proper error handling with user feedback
- Loading states for async operations
- Form validation and required field indicators
- Secure authentication with token management
- Clean code with proper separation of concerns
