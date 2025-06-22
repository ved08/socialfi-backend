# SocialFi Backend

This is the backend service for the SocialFi application, built with Node.js, Express, and Prisma. It provides the API endpoints for managing users, posts, and token-related operations.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd social-fi-backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/socialfi?schema=public"

# Vybe API (for token data)
VYBE_API="your-vybe-api-key"

# JWT Secret (for authentication)
JWT_SECRET="your-jwt-secret"

# Server
PORT=3000
NODE_ENV=development
```

### 4. Set up the database

Run database migrations using Prisma:

```bash
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
# Development mode with hot-reload
npm run dev

# Production start
npm start
```

The server will start on `http://localhost:3000` by default.

## Environment Variables

| Variable       | Description                  | Required            | Default     |
| -------------- | ---------------------------- | ------------------- | ----------- |
| `DATABASE_URL` | PostgreSQL connection URL    | Yes                 | -           |
| `VYBE_API`     | API key for Vybe Network     | No                  | -           |
| `JWT_SECRET`   | Secret for JWT token signing | Yes (in production) | -           |
| `PORT`         | Port to run the server on    | No                  | 3000        |
| `NODE_ENV`     | Environment mode             | No                  | development |

## Available Scripts

- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the production server
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio for database management

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `GET /posts/:id` - Get a specific post

### Token Data

- `POST /token-history` - Get historical token data
- `GET /token-price/:mintAddress` - Get current token price

## Database Schema

The application uses PostgreSQL with the following main tables:

### User
- id: Int (Primary Key)
- name: String (Unique)
- avatar: String
- createdAt: DateTime

### Post
- id: Int (Primary Key)
- userName: String (Foreign Key to User.name)
- mint: String
- boughtAmt: Float
- holding: Boolean
- soldAmt: Float
- createdAt: DateTime

## Deployment

For production deployment, make sure to:

1. Set `NODE_ENV=production`
2. Configure a production-ready database
3. Set up proper CORS and security headers
4. Use a process manager like PM2 or systemd

## License

MIT
