# Annu ERP - F&B Cost Controlling Application

A comprehensive web application designed to help restaurants, cafes, bars, and catering businesses track, analyze, and optimize food, beverage, and operational costs.

## Features

- **Multi-department inventory management** (Kitchen, Bar, Hot Beverage)
- **Controller role** with daily & monthly counts
- **Non-food items tracking** (napkins, cleaning supplies, etc.)
- **Manager-level configuration** of departments, categories, and users
- **XLS/CSV import/export** at all key stages
- **Accurate cost % calculation** with sales input
- **Real-time reporting** and analytics

## Tech Stack

- **Frontend**: React 18, React Router, Material-UI, Chart.js
- **Backend**: Node.js, Express, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier

## Architecture

The application follows a three-tier architecture:
- **Frontend (Client)**: React application deployed on Vercel
- **Backend (API)**: Node.js/Express API deployed on Render
- **Database/Auth**: Supabase (PostgreSQL + Authentication)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benn402/annu.git
   cd annuerp
   ```

2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   # Frontend (root directory)
   cp .env.example .env
   # Backend (backend directory)
   cd backend && cp .env.example .env && cd ..
   ```
   Update both `.env` files with your configuration.

### Running the Application

1. Start both frontend and backend development servers:
   ```bash
   npm run dev:full
   ```
   This requires `concurrently` to be installed globally or as a dev dependency.

2. If you just want to run the frontend (with mock backend):
   ```bash
   npm start
   ```

3. To run the backend server separately:
   ```bash
   npm run backend:dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start`: Start the frontend development server
- `npm run backend`: Start the backend server in production mode
- `npm run backend:dev`: Start the backend server in development mode
- `npm run dev:full`: Start both backend and frontend in development mode
- `npm run build`: Build the application for production
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### Deploying to Vercel (Frontend)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Set environment variables in Vercel dashboard
4. Deploy!

### Deploying to Render (Backend)
1. Push code to GitHub
2. Connect Render to your repository
3. Configure Docker deployment with `backend/Dockerfile`
4. Set environment variables in Render dashboard
5. Deploy!

### Setting up Supabase (Database/Auth)
1. Create Supabase project
2. Execute schema from `supabase/schema.sql`
3. Configure authentication settings
4. Set up environment variables

## Project Structure

```
annuerp/
├── backend/          # Backend API server
│   ├── server.js     # Main server file
│   └── package.json
├── supabase/         # Supabase schema and config
│   └── schema.sql    # Database schema
├── src/
│   ├── components/   # Reusable UI components
│   ├── context/      # React context providers
│   ├── pages/        # Page components
│   ├── services/     # API and Supabase services
│   └── styles/       # Global styles
├── public/           # Static assets
├── dist/             # Production build
└── package.json
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
