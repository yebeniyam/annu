# Deployment Verification for Annu ERP

## Files required for Render deployment (Backend)
- backend/server.js ✓
- backend/package.json ✓
- backend/Dockerfile ✓
- backend/.env ✓ (for local dev, configured in Render UI for production)

## Files required for Vercel deployment (Frontend)
- package.json ✓
- vercel.json ✓
- src/ ✓ (source code)
- public/ ✓ (static assets)
- .env ✓ (for local dev, configured in Vercel UI for production)

## Files required for Supabase setup
- supabase/schema.sql ✓
- Environment variables configured in both frontend and backend ✓

## Build and test commands
To test locally:
1. cd backend && npm install && npm run dev (in one terminal)
2. cd .. && npm install && npm start (in another terminal)

To build frontend:
- npm run build

## Environment Variables Needed

### For Vercel (Frontend):
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=your_backend_url

### For Render (Backend):
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
PORT=5000 (or as required)