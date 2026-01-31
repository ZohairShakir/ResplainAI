# 🚀 Quick Deployment Guide

## Backend on Render (5 minutes)

1. **Go to [render.com](https://render.com)** → Sign up/Login
2. **New +** → **Web Service**
3. **Connect GitHub** → Select your repo
4. **Configure:**
   - Name: `resplain-backend`
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
5. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://zoher:Truetrue88@resplain.ggbixsk.mongodb.net/?appName=Resplain
   GEMINI_API_KEY=AIzaSyCivST_1-qH-D9O_de7M_YvAM-upUbyayM
   JWT_SECRET=<generate-strong-secret>
   NODE_ENV=production
   ```
6. **Deploy** → Wait 2-5 minutes
7. **Copy URL:** `https://resplain-backend.onrender.com`

---

## Frontend on Netlify (3 minutes)

1. **Go to [netlify.com](https://netlify.com)** → Sign up/Login
2. **Add new site** → **Import from Git**
3. **Connect GitHub** → Select your repo
4. **Build settings** (auto-detected):
   - Build: `npm run build`
   - Publish: `dist`
5. **Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Add: `VITE_API_URL` = `https://resplain-backend.onrender.com/api`
6. **Deploy** → Wait 1-3 minutes
7. **Your site:** `https://resplainai.netlify.app`

---

## ✅ Verify

1. **Backend:** Visit `https://resplain-backend.onrender.com/api/health`
   - Should see: `{"status":"ok","message":"Resplain AI Backend is running"}`

2. **Frontend:** Visit `https://resplainai.netlify.app`
   - Should load without errors
   - Try signing up/login
   - Check browser console (F12) for API calls

---

## 🔧 Troubleshooting

**CORS Error?**
- Check backend CORS includes: `https://resplainai.netlify.app`
- Redeploy backend after CORS changes

**API Not Working?**
- Verify `VITE_API_URL` is set in Netlify
- Check backend logs in Render dashboard
- Ensure backend URL is correct

**Build Fails?**
- Check build logs for errors
- Verify all dependencies in `package.json`
- Ensure Node version is compatible

---

**Need detailed steps?** See [DEPLOYMENT.md](./DEPLOYMENT.md)
