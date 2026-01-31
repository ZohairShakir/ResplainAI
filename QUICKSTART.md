# Quick Start Guide

## Step 1: Install Dependencies

### Option A: Using the batch script (Windows)
```bash
install-dependencies.bat
```

### Option B: Manual installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 2: Start the Servers

You need to run **two terminals**:

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
Backend will run on: `http://localhost:3000`

### Terminal 2 - Frontend Server
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

## Step 3: Access the Application

Open your browser and go to: `http://localhost:5173`

## What's Already Configured

✅ MongoDB connection string  
✅ Gemini API key  
✅ JWT authentication secret  
✅ All backend routes and models  
✅ Frontend API client  
✅ Environment variables in `server/.env`

## Testing the Application

1. **Sign Up**: Create a new account with email and password
2. **Login**: Use your credentials to login
3. **Upload Paper**: Upload a research paper (filename is used)
4. **Select Age Level**: Choose explanation complexity
5. **View Explanation**: See AI-generated explanation
6. **Post to Gallery**: Share your paper publicly
7. **Browse Gallery**: See papers from other users

## Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct in `server/.env`
- Ensure port 3000 is not in use
- Check if all dependencies are installed: `cd server && npm install`

### Frontend won't start
- Check if port 5173 is not in use
- Ensure all dependencies are installed: `npm install`
- Check browser console for errors

### API errors
- Ensure backend is running on port 3000
- Check `server/.env` file has correct credentials
- Verify MongoDB connection is working

## Project Structure

```
resplain-ai/
├── index.html              # Main HTML
├── index.tsx              # React app
├── package.json           # Frontend deps
├── vite.config.js        # Vite config
├── src/
│   └── api/
│       └── client.js     # API client
└── server/
    ├── index.js          # Express server
    ├── .env              # Environment vars
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── services/         # Business logic
    └── middleware/       # Auth middleware
```

## Next Steps

- Customize the UI
- Add more features
- Deploy to production
- Set up proper environment variables for production
