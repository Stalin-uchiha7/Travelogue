# Deploying Travelogue to Netlify

This guide will help you deploy your Travelogue application to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup) (free)
2. Your Firebase configuration values
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Push Your Code to Git

If you haven't already, push your code to a Git repository:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Login to Netlify**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Sign in with your account

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your `Travelogue` repository

3. **Configure Build Settings**
   - The settings should auto-detect from `netlify.toml`:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: `20`
   - If not auto-detected, enter these manually

4. **Add Environment Variables**
   - Before deploying, click "Show advanced"
   - Click "New variable" and add each Firebase config variable:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   
   > **Note**: You can find these values in your Firebase Console:
   > Project Settings > General > Your apps > SDK setup and configuration

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-3 minutes)

6. **Your Site is Live!**
   - Netlify will provide a URL like `https://random-name-123456.netlify.app`
   - You can customize this domain in Site settings

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   ```
   - Follow the prompts to link your repository
   - Add environment variables when prompted

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. Go to your site's dashboard on Netlify
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your domain's DNS

## Step 4: Enable Continuous Deployment

Netlify automatically sets up continuous deployment:
- Every push to your `main` branch will trigger a new deployment
- Pull requests create preview deployments

## Updating Environment Variables

To update environment variables after deployment:

1. Go to your site's dashboard
2. Click "Site settings" → "Environment variables"
3. Update or add variables as needed
4. Trigger a new deploy from "Deploys" tab

## Troubleshooting

### Build Fails

- Check the deploy logs in Netlify dashboard
- Ensure all environment variables are set correctly
- Verify Node version is set to 20

### Firebase Errors

- Double-check all Firebase environment variables
- Ensure your Firebase project allows your Netlify domain in authorized domains:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add your `*.netlify.app` domain

### 404 Errors on Page Refresh

- This should be handled by the `netlify.toml` redirect rule
- If issues persist, check that `netlify.toml` is committed to your repository

## Monitoring Your Site

- **Netlify Dashboard**: View deploy logs, analytics, and site performance
- **Firebase Console**: Monitor authentication, database usage, and errors

## Need Help?

- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

