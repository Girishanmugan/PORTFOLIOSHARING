# Portfolio Sharing Backend

Requirements:
- Node.js (>=16)
- npm
- MongoDB connection string (set `MONGO_URI` in `.env`)

Setup:
1. cd to `PROJECT/BACKEND`
2. npm install
3. create a `.env` file (there is one example in repo). Ensure `MONGO_URI` and `JWT_SECRET` set.

Run:
- Start dev server:

```powershell
npm run dev
```

- Start production:

```powershell
npm start
```

Create a demo admin user (optional):

```powershell
node scripts/createAdmin.js
```

API endpoints:
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/portfolio/all` (public)
- Protected routes require `Authorization: Bearer <token>`

If you get a 500 on register, check the backend terminal for logged error details. Ensure MongoDB is reachable and `.env` values are correct.
