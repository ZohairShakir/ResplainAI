# Netlify Environment Variable Setup

## ⚠️ IMPORTANT: Set Environment Variable in Netlify

The frontend needs to know where your backend API is located. You **MUST** set the environment variable in Netlify.

## Steps to Fix the `ERR_BLOCKED_BY_CLIENT` Error

### Option 1: Set Environment Variable in Netlify (Recommended)

1. **Go to Netlify Dashboard:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Select your site: `resplainai`

2. **Navigate to Environment Variables:**
   - Click **Site settings** (gear icon)
   - Scroll down to **Environment variables**
   - Click **Add variable**

3. **Add the Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://resplain-backend.onrender.com/api`
   - **Scopes:** Select "All scopes" or "Production"
   - Click **Save**

4. **Redeploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait for deployment to complete

### Option 2: Verify Current Settings

If you already set the variable, verify it's correct:

1. Go to **Site settings** → **Environment variables**
2. Check that `VITE_API_URL` exists
3. Verify the value is: `https://resplain-backend.onrender.com/api`
4. Make sure there are no extra spaces or typos

### Option 3: Check Build Logs

1. Go to **Deploys** tab
2. Click on the latest deploy
3. Check **Build log**
4. Look for any errors related to environment variables
5. Verify the build completed successfully

## Why This Happens

The error `ERR_BLOCKED_BY_CLIENT` when accessing `localhost:3000` from a deployed site means:

1. The frontend is trying to call `http://localhost:3000/api` (which doesn't exist on Netlify)
2. The browser blocks this because it's a localhost URL from a remote site
3. The production detection or environment variable isn't working

## Solution

The code now has multiple fallbacks:
- ✅ Checks `VITE_API_URL` environment variable first
- ✅ Detects production by checking hostname
- ✅ Falls back to Render backend URL in production
- ✅ Uses localhost only in development

**But you still need to set `VITE_API_URL` in Netlify for the most reliable setup.**

## Verification

After setting the environment variable and redeploying:

1. Open your site: `https://resplainai.netlify.app`
2. Open browser console (F12)
3. Look for log message: `API Base URL: https://resplain-backend.onrender.com/api`
4. Try logging in
5. Check Network tab - requests should go to Render backend, not localhost

## Troubleshooting

### Still seeing localhost in console?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check that environment variable is set correctly
- Verify the deploy completed after setting the variable

### Still getting ERR_BLOCKED_BY_CLIENT?
- Check browser console for the actual API URL being used
- Verify backend is accessible: `https://resplain-backend.onrender.com/api/health`
- Check CORS settings in backend
- Try incognito/private browsing mode

### Environment variable not working?
- Ensure variable name is exactly: `VITE_API_URL` (with `VITE_` prefix)
- Make sure it's set for "Production" scope
- Redeploy after setting the variable
- Check build logs for any errors

---

**Quick Fix Checklist:**
- [ ] Set `VITE_API_URL` = `https://resplain-backend.onrender.com/api` in Netlify
- [ ] Redeploy the site
- [ ] Clear browser cache
- [ ] Test login functionality
- [ ] Verify API calls go to Render backend (check Network tab)
