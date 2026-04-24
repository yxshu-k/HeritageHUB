# HeritageHUB

HeritageHUB is a premium antique and heritage collectibles marketplace built with a MERN stack.

## Features
- Buyer & seller authentication with JWT
- Product listing with Cloudinary image upload
- Search, filters, verified item badges
- Wishlist saving and bid placement
- Premium dark luxury UI with Tailwind CSS
- Wikipedia heritage data integration and mock fallback
- Admin verification panel
- Responsive design for desktop and mobile

## Project Structure
- `backend/` - Express API, MongoDB models, authentication, Cloudinary uploads
- `frontend/` - Vite + React app, Tailwind CSS, premium interface

## Backend Setup
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` from `.env.example` and set values:
   ```bash
   MONGO_URI=your-mongodb-atlas-uri
   PORT=5000
   JWT_SECRET=super-secret-value
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   FRONTEND_URL=http://localhost:5173
   ```
3. Start backend server:
   ```bash
   npm start
   ```

## Frontend Setup
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` from `.env.example` and configure:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run frontend locally:
   ```bash
   npm run dev
   ```

## Deployment
- Frontend: deploy `frontend/` to Vercel
- Backend: deploy `backend/` to Render
- Database: MongoDB Atlas

### Environment Variables
#### Backend
- `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL`

#### Frontend
- `VITE_API_URL`

## API Key Placement
- Cloudinary keys go in `backend/.env`
- There is no paid heritage API key required; the app uses Wikipedia open API and a local fallback service.

## Production-Ready Notes
- CORS is configured for frontend origins
- JWT protected routes implemented
- Admin verification is available at `/admin`
- Wishlist, bidding, product details, and heritage history pages are fully integrated
