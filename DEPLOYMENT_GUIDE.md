# Annu ERP Deployment Guide

This guide provides detailed instructions for deploying the Annu ERP application on Render (backend), Vercel (frontend), and Supabase (database/auth).

## Architecture Overview

The application follows a three-tier architecture:
- **Frontend (Client)**: React application deployed on Vercel
- **Backend (API)**: Node.js/Express API deployed on Render
- **Database/Auth**: Supabase (PostgreSQL + Authentication)

## Prerequisites

1. GitHub account with access to the repository: https://github.com/benn402/annu.git
2. Render account (https://render.com)
3. Vercel account (https://vercel.com)
4. Supabase account (https://supabase.com)

## Step 1: Set up Supabase Database

### 1.1 Create Supabase Project
1. Go to https://supabase.com and create an account
2. Create a new project
3. Note down your Project URL and Project API keys (anon and service_role)

### 1.2 Set up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and execute the schema from `supabase/schema.sql` file in the repository
4. This will create all necessary tables for the application

### 1.3 Configure Authentication (Optional)
By default, Supabase handles authentication. You can customize email templates and providers in the Auth section of your dashboard.

## Step 2: Deploy Backend API to Render

### 2.1 Prepare Backend Code
The backend code is located in the `backend/` directory of the repository.

### 2.2 Deploy to Render
1. Push the code to your GitHub repository
2. Log in to Render (https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect to your GitHub repository
5. Select the repository: `benn402/annu`
6. Environment: `Docker`
7. Region: Choose your preferred region
8. Branch: `main`
9. Dockerfile path: `backend/Dockerfile`
10. Add Environment Variables:
    - `SUPABASE_URL`: Your Supabase project URL
    - `SUPABASE_ANON_KEY`: Your Supabase anon key
    - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
    - `JWT_SECRET`: A secret string for JWT signing
    - `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://annu-erp.vercel.app)
11. Click "Create Web Service"

Your backend API will be deployed at a URL like: `https://your-app-name.onrender.com`

### 2.3 Update Backend Environment Variables
After deployment, update the `FRONTEND_URL` environment variable with your actual Vercel deployment URL.

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend Code
The frontend code is located in the root directory of the repository and uses Create React App.

### 3.2 Deploy to Vercel
1. Push the code to your GitHub repository
2. Go to https://vercel.com and create an account/ log in
3. Click "New Project" → "Import Git Repository"
4. Select your repository: `benn402/annu`
5. Configure the project:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (from webpack build)
   - Root Directory: `/`
6. Add Environment Variables:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., https://your-app-name.onrender.com/api)
7. Click "Deploy"

Your frontend will be deployed at a URL like: `https://annu-erp.vercel.app`

### 3.3 Update Frontend Environment Variables
After deployment, if you need to update any environment variables, go to your Vercel dashboard → your project → Settings → Environment Variables.

## Step 4: Configure Environment Variables

### 4.1 Frontend Environment Variables (Vercel)
- `REACT_APP_SUPABASE_URL`: Supabase project URL (starts with https://)
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anon public key
- `REACT_APP_API_URL`: Backend API URL (e.g., https://your-backend.onrender.com/api)

### 4.2 Backend Environment Variables (Render)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `JWT_SECRET`: Secret for JWT signing
- `FRONTEND_URL`: Frontend URL for CORS

## Step 5: Configure Authentication

### 5.1 Supabase Auth Settings
1. In your Supabase dashboard, go to Authentication → Settings
2. Update the "Site URL" to your frontend URL (e.g., https://annu-erp.vercel.app)
3. If using email confirmations, update the "Redirect URLs" as needed
4. Configure email templates in Authentication → Templates as desired

### 5.2 Update CORS Settings
1. In your Supabase dashboard, go to Settings → API
2. Add your frontend URL to the "CORS allowed origins" list

## Step 6: Test the Deployment

### 6.1 Verify Backend API
1. Visit your backend URL: `https://your-backend.onrender.com/health`
2. You should see a JSON response indicating the service is running

### 6.2 Verify Frontend
1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try registering a new account and logging in
3. Verify that all features work correctly

### 6.3 Troubleshooting
- Check browser console for any errors
- Verify all environment variables are correctly set on both platforms
- Ensure CORS is properly configured in Supabase
- Check that the backend API can connect to Supabase

## Step 7: Production Considerations

### 7.1 Security
- Never commit sensitive keys to the repository
- Use strong, unique passwords for JWT_SECRET
- Regularly rotate your API keys

### 7.2 Performance
- Monitor your Render and Vercel dashboards for performance metrics
- Consider upgrading to paid plans for production use
- Set up custom domains for professional appearance

### 7.3 Updates
- To deploy updates, simply push changes to the main branch
- Both platforms will automatically build and deploy the new version
- Monitor the deployment logs for any issues

## Additional Notes

- The application uses Supabase for authentication and database
- Data from the original `db.json` has been migrated to the Supabase schema
- All API calls now go through the backend API server
- The frontend communicates with Supabase directly for authentication and with the backend API for business logic