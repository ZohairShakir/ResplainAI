# Resplain AI

Research papers explained simply. An AI-powered platform that transforms complex academic papers into easy-to-understand explanations.

## Features

- 🔐 User Authentication (Signup/Login)
- 📄 Research Paper Processing with Gemini AI
- 📚 Personal Library Management
- 🖼️ Public Gallery of Explained Papers
- 🎯 Multiple Age-Level Explanations (Preschool, Middle School, College, Professional)
- 💾 MongoDB Database Integration

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Framer Motion
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini AI

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Environment Configuration

The `.env` file in the `server` directory is already configured with:
- MongoDB URI
- Gemini API Key
- JWT Secret
- Server Port

### 4. Start the Development Servers

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

The backend will run on `http://localhost:3000`

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Papers
- `POST /api/papers/process` - Process a research paper
- `GET /api/papers/my-papers` - Get user's papers
- `GET /api/papers/:paperId` - Get specific paper
- `DELETE /api/papers/:paperId` - Delete paper

### Gallery
- `GET /api/gallery` - Get all public papers
- `POST /api/gallery/:paperId` - Post paper to gallery
- `DELETE /api/gallery/:paperId` - Remove from gallery

### Library
- `GET /api/library` - Get user's library

## Project Structure

```
resplain-ai/
├── index.html          # Main HTML file
├── index.tsx          # React frontend application
├── package.json       # Frontend dependencies
├── vite.config.js     # Vite configuration
├── src/
│   └── api/
│       └── client.js  # API client for backend communication
└── server/
    ├── index.js       # Express server entry point
    ├── package.json   # Backend dependencies
    ├── .env           # Environment variables
    ├── models/        # MongoDB models
    │   ├── User.js
    │   └── Paper.js
    ├── routes/        # API routes
    │   ├── auth.js
    │   ├── papers.js
    │   ├── gallery.js
    │   └── library.js
    ├── services/      # Business logic
    │   └── gemini.js
    └── middleware/    # Express middleware
        └── auth.js
```

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Upload Paper**: Upload a research paper PDF (filename is used for processing)
3. **Select Age Level**: Choose the complexity level for explanation
4. **View Explanation**: Get AI-generated explanation of the paper
5. **Post to Gallery**: Share your explained papers publicly
6. **Browse Gallery**: Discover papers explained by the community

## Notes

- Free tier users get 3 papers per month
- Pro users have unlimited access
- All papers are stored in MongoDB
- Gemini AI is used for generating explanations
- JWT tokens are used for authentication

## License

MIT
