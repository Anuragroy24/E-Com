# ShopCRUD — Auth (JWT Access + Refresh) & Product CRUD API

A small e-commerce backend with a complete JWT authentication flow
(access + refresh tokens, rotation, revocation) and full CRUD for a
`Product` resource, plus a React frontend that consumes it.

Built for the Sheryians Coding School assignment: *Authentication &
Product CRUD APIs*.

## Tech stack

- **Backend:** Node.js, Express, MongoDB/Mongoose, express-validator, JWT, bcrypt
- **Frontend:** React (Vite), react-router, axios

## Project structure

```
.
├── server/                 # Express API
│   └── src/
│       ├── app/            # express app wiring (middleware, routes mount)
│       ├── config/         # env config + DB connection
│       ├── controllers/    # route handler logic
│       ├── middlewares/    # authenticate + validate-request
│       ├── models/         # Mongoose schemas (User, Product)
│       ├── routes/         # route definitions
│       ├── utils/          # token generate/verify/hash helpers
│       └── server.js       # entry point
└── client/                 # React (Vite) frontend
    └── src/
        ├── app/             # App shell, router, layout
        └── modules/
            ├── auth/        # AuthProvider (context), Login/Register/Profile
            ├── products/    # product list/detail/create/edit pages
            └── shared/      # useApi (axios instance + refresh interceptor)
```

## How the auth flow works

1. **Register** (`POST /api/auth/register`) only creates the account
   (name/email/hashed password) — no tokens are issued here.
2. **Login** (`POST /api/auth/login`) verifies the password, then:
   - signs a short-lived **access token** (15 min) and returns it in
     the JSON response body,
   - signs a long-lived **refresh token** (7 days), sends it back as
     an **httpOnly cookie**, and stores a **bcrypt hash** of it on the
     user document (never the raw token) so it can be revoked later.
3. On the frontend, the access token is kept **only in memory**
   (React state) — never in `localStorage` — and is attached to every
   API request via an axios request interceptor.
4. When a request comes back `401` (access token expired), an axios
   **response interceptor** automatically calls
   `POST /api/auth/refresh-token`. The browser sends the httpOnly
   cookie automatically; the server verifies it against the stored
   hash, and — if valid — **rotates** it: issues a brand new access
   token *and* a brand new refresh token (the old one is immediately
   invalidated). The original request is then retried once with the
   new access token.
5. On app load, the same `refresh-token` call runs once to silently
   restore a session from the cookie, so a page refresh doesn't log
   the user out.
6. **Logout** (`POST /api/auth/logout`) deletes the stored refresh
   token hash and clears the cookie, so that refresh token can never
   be used again even if it leaks.

Because the DB only ever stores a **hash** of the refresh token, a
database leak can't be replayed as a valid session — this is a small
improvement over storing the raw token, while keeping the exact same
generate → store → verify → rotate flow.

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in MONGO_URI + your own JWT secrets
npm install
npm run dev             # starts on http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev              # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:3000`, so
the browser only ever talks to one origin and the refresh cookie is
sent same-site without extra CORS/cookie configuration.

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new account (`name`, `email`, `password`, `confirmPassword`) |
| POST | `/login` | Public | Verify credentials, return an access token + set refresh cookie |
| POST | `/refresh-token` | Public (needs refresh cookie) | Issue a new access token (rotates the refresh token) |
| POST | `/logout` | Authenticated | Revoke the stored refresh token, clear the cookie |
| GET | `/me` | Authenticated | Return the logged-in user's profile |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Authenticated | Create a product |
| GET | `/` | Public | List products (`?page=&limit=` optional) |
| GET | `/:id` | Public | Get a single product |
| PUT | `/:id` | Authenticated | Update a product (`:id` is checked to exist first) |
| DELETE | `/:id` | Authenticated | Delete a product (`:id` is checked to exist first) |

All request bodies/params/queries are validated with
`express-validator`; invalid requests get a `400` with a field-level
error list:

```json
{
  "message": "Validation failed",
  "errors": [
    { "path": "email", "message": "Enter a valid email address" }
  ]
}
```

### Authenticated requests

Send the access token as a Bearer token:

```
Authorization: Bearer <accessToken>
```

## Security checklist

- [x] Passwords hashed with bcrypt (10 salt rounds), never returned or logged
- [x] JWT secrets read from `.env`, never hardcoded
- [x] Refresh tokens stored server-side (as a bcrypt hash) so they can be revoked
- [x] Refresh token delivered as an `httpOnly` cookie (`secure` + `sameSite=none` in production)
- [x] Refresh token rotation — reuse of an old/invalidated refresh token forces re-login
- [x] Login attempts rate-limited (20 requests / 15 min per IP)
- [x] Generic "Invalid email or password" message — never reveals which field was wrong

## Deployment note

Replace `Project Live Link` below once deployed:

- **Backend:** deploy `server/` (e.g. Render/Railway) with the env vars from `.env.example`
- **Frontend:** deploy `client/` (e.g. Vercel/Netlify), set the API base URL / proxy to the deployed backend
- **Live link:** _add here_
