# MentorBridge Deployment Guide

## Overview
This guide explains how to deploy MentorBridge with:
- **Backend:** Render (Node.js/Express)
- **Frontend:** Vercel (Vite/React)

---

## BACKEND DEPLOYMENT (Render)

### Prerequisites
- Render account ([render.com](https://render.com))
- GitHub repository connected to Render
- MongoDB Atlas connection string

### Step-by-Step

#### 1. Create Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select **GitHub** as source
4. Authorize and connect your GitHub account
5. Select the `addyy-dot/MENTOS` repository

#### 2. Configure Web Service
Fill in the following details:

| Setting | Value |
|---------|-------|
| **Name** | `mentos-backend` |
| **Environment** | `Node` |
| **Region** | Choose nearest region |
| **Branch** | `master` |
| **Build Command** | `npm install` |
| **Start Command** | `node backend/server.js` |

#### 3. Add Environment Variables
In the **Environment** section, add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET = your_secure_jwt_secret_key
NODE_ENV = production
PORT = 5000
CLIENT_URL = https://your-vercel-frontend-url.vercel.app
```

**Important:** Update `CLIENT_URL` after deploying frontend to Vercel.

#### 4. Deploy
- Click **Create Web Service**
- Wait for build completion (2-3 minutes)
- Your backend URL: `https://mentos-backend.onrender.com`

#### 5. Keep Alive (Free Tier)
If using Render's free tier, add a monitoring service to prevent spindown:
- Use [Uptime Robot](https://uptimerobot.com) (free)
- Monitor your backend URL: `https://mentos-backend.onrender.com`

---

## FRONTEND DEPLOYMENT (Vercel)

### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository
- Backend URL from Render

### Step-by-Step

#### 1. Import Project to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New +** → **Project**
3. Click **Import Git Repository**
4. Select `addyy-dot/MENTOS`

#### 2. Configure Project Settings
In the project import wizard:

| Setting | Value |
|---------|-------|
| **Project Name** | `mentos-frontend` |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./frontend` |

#### 3. Build Configuration
Vercel should auto-detect these:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### 4. Add Environment Variables
Under **Environment Variables**, add:

```
VITE_API_URL = https://mentos-backend.onrender.com
```

Replace the URL with your actual Render backend URL.

#### 5. Deploy
- Click **Deploy**
- Wait for build completion (1-2 minutes)
- Your frontend URL: `https://mentos-frontend.vercel.app`

---

## POST-DEPLOYMENT STEPS

### 1. Update Backend CORS
After frontend deployment, update your Render backend environment variables:

1. Go to Render dashboard
2. Select your web service
3. Edit **Environment** variables
4. Update `CLIENT_URL` to your Vercel URL: `https://your-vercel-url.vercel.app`
5. Your backend will auto-redeploy

### 2. Test the Connection
1. Visit your Vercel frontend URL
2. Register/Login to test API connectivity
3. Check browser DevTools console for errors

### 3. Enable Custom Domain (Optional)
**Vercel:**
- Settings → Domains
- Add your custom domain
- Update DNS records

**Render:**
- Settings → Custom Domain
- Point your backend domain
- Configure DNS

---

## TROUBLESHOOTING

### Backend Build Fails
**Error:** `Cannot find module 'backend/server.js'`
- Ensure `Build Command`: `npm install`
- Ensure `Start Command`: `node backend/server.js`
- Check that git repository has `/backend` folder

### Frontend Shows 404 on Routes
**Solution:** 
- In Vercel, go to Settings → Build & Development Settings
- Set **Override** → **Output Directory** to `frontend/dist`

### API Calls Fail (CORS Error)
**Solution:**
- Verify `VITE_API_URL` is set correctly in Vercel
- Verify `CLIENT_URL` is set correctly in Render
- Both must include `https://`

### Slow First Request
**Issue:** Render free tier spins down after 15 mins inactivity
**Solution:** 
- Use [Uptime Robot](https://uptimerobot.com) to ping backend every 10 mins
- Upgrade to Render paid tier

---

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
PORT=5000
CLIENT_URL=https://your-vercel-url.vercel.app
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-render-url.onrender.com
```

---

## Monitoring & Maintenance

### Check Backend Logs
```bash
# In Render dashboard
Services → mentos-backend → Logs
```

### Check Frontend Logs
```bash
# In Vercel dashboard
Deployments → View Build Logs
```

### Revert Deployment
Both platforms allow instant rollback:
- **Render:** Choose previous build under "Deploys"
- **Vercel:** Select previous deployment under "Deployments"

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Render | Free | $0 (spins down after 15 min) |
| Render | Starter | $7 |
| Vercel | Free | $0 |
| MongoDB Atlas | Free | $0 |
| **Total** | | **$0-7** |

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Common Issues:** Check above Troubleshooting section

Happy deploying! 🚀
