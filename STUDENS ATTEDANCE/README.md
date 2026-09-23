# Student Attendance System

This repository contains a deployable MERN starter:

- `server/` - Express API with MongoDB connection and a health endpoint.
- `client/` - React + Vite client.

## Local setup

1. Install Node.js 18 or newer.
2. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Copy `client/.env.example` to `client/.env`.
4. Install and run the API:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

5. In another terminal, install and run the client:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

The API health check is available at `http://localhost:5000/api/health`.

## Backend API

The Express API includes:

- `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me`
- Protected student CRUD at `GET/POST /api/students`, `PATCH/DELETE /api/students/:id`
- Protected attendance endpoints at `GET /api/attendance?date=YYYY-MM-DD` and `PUT /api/attendance`
- JWT authentication using `Authorization: Bearer <token>`
- Student fields for parent/guardian contacts and full address
- Student list search and pagination with `page`, `limit`, and `search`

The frontend Axios client is in `client/src/services/api.js`. It automatically attaches the saved JWT to API requests. The current browser demo continues to use local sample data until you connect MongoDB and choose to load the API data.

## Production environment checklist

### Render API

- Create a MongoDB Atlas database and add the Render outbound IP access rule.
- Set `MONGO_URI` to the Atlas connection string.
- Set `JWT_SECRET` to a long, random secret; never commit it.
- Set `CLIENT_URL` to the deployed Vercel/Netlify client URL.
- Set `PORT` to Render's provided port (the included `render.yaml` uses `10000`).

### Vercel or Netlify client

- Set `VITE_API_URL` to the deployed Render API URL ending in `/api`.
- Run `npm run build` from `client/`.
- Publish the `client/dist` directory.
- Configure SPA fallback rewrites so React Router routes serve `index.html`.

Never commit `.env` files. Only the `.env.example` files belong in source control.
