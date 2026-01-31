# 🔧 Fix: ERR_BLOCKED_BY_CLIENT Login Error

## Problem
Getting `POST http://localhost:3000/api/auth/login net::ERR_BLOCKED_BY_CLIENT` when trying to login from deployed frontend.

## Root Cause
The frontend is trying to call `localhost:3000` instead of your Render backend URL (`https://resplain-backend.onrender.com/api`).

## ✅ Solution (Choose One)

### Option 1: Set Environment Variable in Netlify (Recommended - Most Reliable)

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com
   - Select your site: `resplainai`

2. **Add Environment Variable:**
   - Click **Site settings** (gear icon)
   - Scroll to **Environment variables**
   - Click **Add variable**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://resplain-backend.onrender.com/api`
   - **Scope:** Production (or All scopes)
   - Click **Save**

3. **Redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait 1-3 minutes for deployment

4. **Test:**
   - Open your site: https://resplainai.netlify.app
   - Open browser console (F12)
   - You should see: `API Base URL: https://resplain-backend.onrender.com/api`
   - Try logging in - it should work now!

### Option 2: Redeploy with Auto-Detection (Quick Fix)

The code now auto-detects if you're on Netlify. Just:

1. **Push the updated code to GitHub:**
   ```bash
   git add .
   git commit -m "Fix API URL detection for production"
   git push
   ```

2. **Netlify will auto-deploy:**
   - Wait for deployment to complete
   - The code will detect you're on `netlify.app` and use the Render backend

3. **Test:**
   - Open your site
   - Check console for: `Using production API URL: https://resplain-backend.onrender.com/api`
   - Try logging in

## 🔍 Verification Steps

After applying the fix:

1. **Open Browser Console (F12)**
   - Look for log message showing the API URL
   - Should show: `https://resplain-backend.onrender.com/api`
   - Should NOT show: `http://localhost:3000/api`

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Try logging in
   - Look for the login request
   - URL should be: `https://resplain-backend.onrender.com/api/auth/login`
   - Status should be 200 (not blocked)

3. **Test Login:**
   - Enter email and password
   - Click login
   - Should work without errors

## 🐛 If Still Not Working

### Check Backend is Running:
```
https://resplain-backend.onrender.com/api/health
```
Should return: `{"status":"ok","message":"Resplain AI Backend is running"}`

### Check Environment Variable:
1. Go to Netlify → Site settings → Environment variables
2. Verify `VITE_API_URL` exists
3. Verify value is exactly: `https://resplain-backend.onrender.com/api`
4. No extra spaces or typos

### Clear Browser Cache:
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Clear cached images and files
- Or use Incognito/Private mode

### Check Build Logs:
1. Netlify → Deploys → Latest deploy
2. Check build log for errors
3. Verify build completed successfully

## 📝 What Changed

The API client now:
- ✅ Checks `VITE_API_URL` environment variable first
- ✅ Auto-detects Netlify by hostname
- ✅ Falls back to Render backend in production
- ✅ Logs the API URL being used (for debugging)

## 🎯 Quick Checklist

- [ ] Set `VITE_API_URL` in Netlify (or push updated code)
- [ ] Redeploy site
- [ ] Clear browser cache
- [ ] Check console for correct API URL
- [ ] Test login functionality
- [ ] Verify requests go to Render backend (Network tab)

---

**Still having issues?** Check the browser console and Network tab for specific error messages, then check:
- Backend health: https://resplain-backend.onrender.com/api/health
- CORS configuration in backend
- Environment variables are set correctly
