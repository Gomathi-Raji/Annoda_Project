# Kase Brothers - T-shirt Customization Platform

Full-stack setup with:

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)

## Project Structure

- `/server` -> Express API + MongoDB connection
- `/client` -> Frontend folder placeholder
- Frontend source is currently implemented at workspace root (`src`, `vite.config.ts`, `tailwind.config.ts`)

## Backend Setup

Backend entrypoint: `/server/server.js`

- Express server initialized
- MongoDB connection via Mongoose in `/server/config/db.js`
- Health route: `GET /api/health`

## Frontend Setup

Frontend is already implemented with:

- Vite React app (root)
- Tailwind CSS configured (`tailwind.config.ts`, `postcss.config.js`, `src/index.css`)

## Installation

From project root:

1. Install frontend/root dependencies:

	 `npm install`

2. Install backend dependencies:

	 `cd server && npm install`

3. Create backend env file:

	 - copy `/server/.env.example` to `/server/.env`
	 - set `MONGO_URI` to your MongoDB connection string

## Run

From project root:

- Run frontend only:

	`npm run client:dev`

- Run backend only:

	`npm run server:dev`

- Run frontend + backend together:

	`npm run dev:full`

## Available Root Scripts

- `dev` -> Starts frontend (Vite)
- `client:dev` -> Starts frontend (Vite)
- `server:dev` -> Starts backend from `/server`
- `dev:full` -> Runs frontend + backend concurrently
