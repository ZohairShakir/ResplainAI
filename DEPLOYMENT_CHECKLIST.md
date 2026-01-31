# ✅ Deployment Checklist

Use this checklist to ensure everything is configured correctly before and after deployment.

## Pre-Deployment

### Backend Preparation
- [ ] All dependencies listed in `server/package.json`
- [ ] `server/index.js` uses `process.env.PORT` for port
- [ ] CORS configured with Netlify domain
- [ ] MongoDB connection string ready
- [ ] Gemini API key ready
- [ ] JWT secret generated (use: `openssl rand -base64 32`)
- [ ] Code pushed to GitHub

### Frontend Preparation
- [ ] `netlify.toml` configured correctly
- [ ] `vite.config.js` has build settings
- [ ] API client uses environment variables
- [ ] All dependencies in `package.json`
- [ ] Code pushed to GitHub

---

## Backend Deployment (Render)

### Initial Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] New Web Service created
- [ ] Service name: `resplain-backend`

### Configuration
- [ ] Environment: `Node`
- [ ] Build Command: `cd server && npm install`
- [ ] Start Command: `cd server && npm start`
- [ ] Root Directory: (empty or `server`)

### Environment Variables Set
- [ ] `MONGODB_URI` = `mongodb+srv://zoher:Truetrue88@resplain.ggbixsk.mongodb.net/?appName=Resplain`
- [ ] `GEMINI_API_KEY` = `AIzaSyCivST_1-qH-D9O_de7M_YvAM-upUbyayM`
- [ ] `JWT_SECRET` = (strong random string)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (optional, Render sets this)

### Deployment
- [ ] Service deployed successfully
- [ ] Build logs show no errors
- [ ] Backend URL obtained: `https://resplain-backend.onrender.com`

### Verification
- [ ] Health check works: `https://resplain-backend.onrender.com/api/health`
- [ ] MongoDB connection successful (check logs)
- [ ] No errors in Render logs
- [ ] Server responding to requests

---

## Frontend Deployment (Netlify)

### Initial Setup
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] New site created from Git

### Configuration
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Base directory: (empty if root)

### Environment Variables Set
- [ ] `VITE_API_URL` = `https://resplain-backend.onrender.com/api`
- [ ] Variable name has `VITE_` prefix

### Deployment
- [ ] Site deployed successfully
- [ ] Build logs show no errors
- [ ] Frontend URL obtained: `https://resplainai.netlify.app`

### Verification
- [ ] Site loads without errors
- [ ] No console errors (F12 → Console)
- [ ] API calls going to Render backend (check Network tab)
- [ ] No CORS errors

---

## Post-Deployment Testing

### Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] JWT token stored in localStorage
- [ ] User session persists

### Paper Processing
- [ ] Upload paper works
- [ ] Paper processing completes
- [ ] Explanation generated
- [ ] Paper saved to MongoDB

### Gallery
- [ ] Gallery loads papers
- [ ] Search works
- [ ] Post to gallery works
- [ ] Papers visible to other users

### Library
- [ ] User library loads
- [ ] Papers listed correctly
- [ ] Delete paper works

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Invalid inputs show error messages
- [ ] API errors display user-friendly messages

---

## Security Checks

- [ ] JWT secret is strong and unique
- [ ] API keys not exposed in frontend code
- [ ] MongoDB credentials secure
- [ ] HTTPS enabled on both services
- [ ] CORS only allows trusted domains
- [ ] Environment variables not in Git

---

## Performance Checks

- [ ] Backend response time < 2s
- [ ] Frontend loads < 3s
- [ ] API calls complete successfully
- [ ] No memory leaks (check logs)
- [ ] Database queries optimized

---

## Monitoring Setup

- [ ] Render logs accessible
- [ ] Netlify logs accessible
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring (optional)

---

## Documentation

- [ ] Deployment guide created
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide available

---

## Final Verification

- [ ] **Backend Health:** ✅ `https://resplain-backend.onrender.com/api/health`
- [ ] **Frontend Live:** ✅ `https://resplainai.netlify.app`
- [ ] **Full Flow Test:** ✅ Sign up → Upload → Process → Gallery
- [ ] **No Errors:** ✅ Check both frontend and backend logs
- [ ] **CORS Working:** ✅ No CORS errors in browser console

---

## 🎉 Deployment Complete!

If all items are checked, your application is successfully deployed and ready for users!

### Quick Links
- **Frontend:** https://resplainai.netlify.app
- **Backend:** https://resplain-backend.onrender.com
- **Health Check:** https://resplain-backend.onrender.com/api/health

### Next Steps
- Monitor logs for first few days
- Set up custom domain (optional)
- Configure analytics (optional)
- Set up error tracking (optional)

---

**Need Help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
