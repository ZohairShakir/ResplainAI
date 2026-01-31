# Deployment Guide for Resplain AI

This guide will help you deploy Resplain AI frontend on Netlify and backend on Render.

## 📋 Prerequisites

- GitHub account (for repository hosting)
- Netlify account (for frontend deployment)
- Render account (for backend deployment)
- MongoDB Atlas account (for database)
- Google Cloud account (for Gemini API key)

---

## 🚀 Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

1. **Ensure your backend is ready:**
   - All dependencies are in `server/package.json`
   - Environment variables are documented
   - Server listens on `process.env.PORT` (Render sets this automatically)

### Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 3: Deploy on Render

1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign up or log in

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure the Service:**
   - **Name:** `resplain-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** Leave empty (or set to `server` if your repo structure requires it)

4. **Set Environment Variables:**
   Click "Add Environment Variable" and add:
   ```
   MONGODB_URI=mongodb+srv://zoher:Truetrue88@resplain.ggbixsk.mongodb.net/?appName=Resplain
   GEMINI_API_KEY=AIzaSyCivST_1-qH-D9O_de7M_YvAM-upUbyayM
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   PORT=10000
   ```

   **⚠️ Important:** 
   - Change `JWT_SECRET` to a strong random string (use: `openssl rand -base64 32`)
   - Render will override `PORT`, but setting it doesn't hurt

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Wait for deployment to complete (usually 2-5 minutes)

6. **Get Your Backend URL:**
   - Once deployed, Render will provide a URL like: `https://resplain-backend.onrender.com`
   - Copy this URL - you'll need it for frontend configuration

### Step 4: Verify Backend Deployment

1. **Test Health Endpoint:**
   ```
   https://resplain-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Resplain AI Backend is running"}`

2. **Check Logs:**
   - Go to Render dashboard → Your service → Logs
   - Verify MongoDB connection is successful
   - Check for any errors

---

## 🎨 Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Frontend for Deployment

1. **Update API Configuration:**
   - The frontend is already configured to use `VITE_API_URL` environment variable
   - In production, it will automatically use: `https://resplain-backend.onrender.com/api`

2. **Build Configuration:**
   - `netlify.toml` is already configured
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 2: Deploy on Netlify

1. **Go to Netlify Dashboard:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up or log in

2. **Create New Site:**
   - Click "Add new site" → "Import an existing project"
   - Connect to Git provider (GitHub)
   - Select your repository

3. **Configure Build Settings:**
   - **Base directory:** Leave empty (or set if your frontend is in a subdirectory)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Netlify should auto-detect these from `netlify.toml`

4. **Set Environment Variables (CRITICAL - DO NOT SKIP):**
   - Go to Site settings → Environment variables
   - Click "Add variable"
   - Add:
     ```
     Key: VITE_API_URL
     Value: https://resplain-backend.onrender.com/api
     Scope: Production (or All scopes)
     ```
   - **⚠️ CRITICAL:** The `VITE_` prefix is required for Vite to expose the variable
   - **⚠️ CRITICAL:** Without this, the frontend will try to use localhost and fail
   - Click "Save variable"

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy your frontend
   - Wait for deployment to complete (usually 1-3 minutes)

6. **Get Your Frontend URL:**
   - Netlify will provide a URL like: `https://resplainai.netlify.app`
   - You can customize the domain name in Site settings → Domain management

### Step 3: Update Backend CORS (If Needed)

If you haven't already, make sure your backend CORS includes your Netlify domain:

```javascript
// In server/index.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://resplainai.netlify.app',
  ],
  credentials: true
}));
```

Then redeploy the backend on Render.

---

## ✅ Part 3: Post-Deployment Verification

### Test Frontend → Backend Connection

1. **Open your Netlify site:** `https://resplainai.netlify.app`

2. **Test Authentication:**
   - Try signing up with a new account
   - Check browser console (F12) for any errors
   - Verify API calls are going to Render backend

3. **Test Paper Processing:**
   - Upload a paper
   - Verify it processes correctly
   - Check that data is saved to MongoDB

4. **Check Network Tab:**
   - Open DevTools → Network tab
   - Verify API requests are going to: `https://resplain-backend.onrender.com/api`
   - Check for CORS errors (should be none)

### Common Issues & Solutions

#### Issue: CORS Errors
**Solution:** 
- Verify backend CORS includes your Netlify domain
- Check that `credentials: true` is set in CORS config
- Ensure backend is using HTTPS

#### Issue: Environment Variables Not Working
**Solution:**
- Frontend: Ensure variables start with `VITE_` prefix
- Backend: Check Render environment variables are set correctly
- Redeploy after changing environment variables

#### Issue: Backend Not Responding
**Solution:**
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure `NODE_ENV=production` is set
- Check that server is listening on `process.env.PORT`

#### Issue: Build Fails on Netlify
**Solution:**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (Netlify uses Node 18 by default)

---

## 🔧 Part 4: Continuous Deployment

Both Netlify and Render support automatic deployments:

### Netlify Auto-Deploy
- Automatically deploys on every push to `main` branch
- Configure in: Site settings → Build & deploy → Continuous Deployment

### Render Auto-Deploy
- Automatically deploys on every push to `main` branch
- Configure in: Service settings → Auto-Deploy

### Manual Deployment
If you need to manually trigger a deployment:
- **Netlify:** Go to Deploys tab → Trigger deploy
- **Render:** Go to Manual Deploy → Deploy latest commit

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://zoher:Truetrue88@resplain.ggbixsk.mongodb.net/?appName=Resplain
GEMINI_API_KEY=AIzaSyCivST_1-qH-D9O_de7M_YvAM-upUbyayM
JWT_SECRET=<generate-a-strong-secret>
NODE_ENV=production
PORT=10000
```

### Frontend (Netlify)
```
VITE_API_URL=https://resplain-backend.onrender.com/api
```

---

## 🔒 Security Best Practices

1. **JWT Secret:**
   - Use a strong, random secret (32+ characters)
   - Never commit secrets to Git
   - Use different secrets for dev/prod

2. **MongoDB:**
   - Use MongoDB Atlas IP whitelist
   - Enable authentication
   - Use strong passwords

3. **API Keys:**
   - Never expose API keys in frontend code
   - Keep Gemini API key in backend only
   - Rotate keys periodically

4. **HTTPS:**
   - Both Netlify and Render provide HTTPS by default
   - Ensure all API calls use HTTPS

---

## 📊 Monitoring & Logs

### Render Logs
- Access: Render Dashboard → Your Service → Logs
- Monitor: API errors, MongoDB connections, server crashes

### Netlify Logs
- Access: Netlify Dashboard → Your Site → Deploys → Build logs
- Monitor: Build errors, deployment status

### Application Monitoring
- Add error tracking (e.g., Sentry)
- Monitor API response times
- Track user authentication issues

---

## 🎯 Quick Reference

| Service | URL | Purpose |
|--------|-----|---------|
| Frontend | https://resplainai.netlify.app | User interface |
| Backend | https://resplain-backend.onrender.com | API server |
| Health Check | https://resplain-backend.onrender.com/api/health | Backend status |

---

## 🆘 Support

If you encounter issues:

1. **Check Logs:**
   - Render: Service → Logs
   - Netlify: Site → Deploys → Build logs

2. **Verify Environment Variables:**
   - Both services have correct values
   - No typos or extra spaces

3. **Test Locally:**
   - Ensure everything works locally first
   - Use production URLs in local testing

4. **Common Fixes:**
   - Redeploy after environment variable changes
   - Clear browser cache
   - Check CORS configuration
   - Verify MongoDB connection

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check passes
- [ ] MongoDB connection working
- [ ] Environment variables set on Render
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set on Netlify
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] Paper processing working
- [ ] Gallery loading correctly
- [ ] No console errors
- [ ] HTTPS enabled on both services

---

**🎉 Congratulations! Your Resplain AI application is now live!**

For updates, simply push to your GitHub repository and both services will automatically redeploy.
