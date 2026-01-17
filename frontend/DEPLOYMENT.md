# Vercel Deployment Guide

This guide walks you through deploying the HRMS-Lite frontend on Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub account with the repository pushed

## Steps to Deploy

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your HRMS-Lite repository
4. Choose the `frontend` directory as the root

### 3. Configure Environment Variables

In the Vercel dashboard:

1. Go to your project settings → Environment Variables
2. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://hrms-lite-ltbb.onrender.com`
   - **Environments**: Production, Preview, Development

### 4. Configure Build Settings

The build settings should auto-detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## API Routing

The `vercel.json` file handles API routing:

- All `/api/*` requests are automatically routed to `https://hrms-lite-ltbb.onrender.com/api/*`
- All other requests are routed to `index.html` for React Router

## Environment Variables

Two environment files are provided:

- `.env.development` - Used when running `npm run dev`
- `.env.production` - Used when building for production

Both contain `VITE_API_URL` pointing to the appropriate backend.

## CORS Configuration

Ensure your backend (Render) has CORS enabled for your Vercel domain:

The backend should include `https://your-vercel-domain.vercel.app` in its CORS origins.

## Testing After Deployment

1. Visit your Vercel deployment URL
2. Test Employees page:
   - Load employees
   - Add new employee
   - Delete employee
3. Test Attendance page:
   - Select employee
   - Mark attendance
   - View history

## Troubleshooting

### API Returns 404
- Check backend URL in environment variables
- Verify backend is running and accessible
- Check CORS settings on backend

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### React Router Not Working
- Vercel's rewrites in `vercel.json` handle this
- All non-file routes redirect to `index.html`

## Monitoring

In Vercel dashboard you can:
- View build logs
- Check deployment status
- Monitor performance
- View function logs (serverless API calls)

## Updating Deployment

Every push to the main branch automatically triggers a new deployment.

To manually trigger a deployment:
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click "Redeploy" on a previous deployment or push new code

## Custom Domain

To use a custom domain:
1. Go to project Settings → Domains
2. Add your domain
3. Follow DNS instructions

## Next Steps

- Set up CI/CD workflows
- Add performance monitoring
- Configure analytics
- Set up error tracking
