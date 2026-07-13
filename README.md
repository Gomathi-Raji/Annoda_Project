# Kase Brothers

Full-stack T-shirt customization platform.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Canvas Editor: Fabric.js
- Export Tools: json2csv, exceljs, pdfkit

## Project Structure

```
/
├─ src/                     # React frontend (current active client)
├─ server/                  # Express backend
│  ├─ config/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ .env.example
│  └─ server.js
└─ client/                  # Placeholder folder for future frontend move
```

## Features

- T-shirt customization page
	- Size and color selection
	- Add editable text on canvas
	- Upload and place logo/image
	- Drag/resize/rotate via Fabric.js
	- Live preview
- Order form
	- Validation for name, phone, address, pincode
	- Saves orders to backend with preview image
- Admin dashboard
	- View all orders in table
	- Filter by status
	- Update status inline
	- Export CSV / Excel / PDF

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Setup

Use a common root environment file for both frontend and backend:

- `.env` (project root)

Create it from:

- `.env.example`

Minimum required values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/kase_brothers
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Optional server override file:

- `server/.env` (overrides matching values from root `.env`)

## Installation

From root project directory:

```bash
npm install
cd server
npm install
cd ..
```

## Run the App

From root project directory:

- Frontend only:

```bash
npm run client:dev
```

- Backend only:

```bash
npm run server:dev
```

- Frontend + Backend together:

```bash
npm run dev:full
```

Default URLs:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

## API Reference

### Health

- `GET /api/health`

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order by MongoDB id
- `PUT /api/orders/:id` - Update order status (`Pending`, `Contacted`, `Completed`)

### Export

- `GET /api/export/csv` - Download orders CSV
- `GET /api/export/excel` - Download orders Excel (`.xlsx`)
- `GET /api/export/pdf` - Download orders PDF

Exported fields:

- Order ID
- Name
- Phone
- Product
- Size
- Color
- Status
- Date

## Scripts

### Root scripts

- `npm run dev` - Frontend dev server
- `npm run client:dev` - Frontend dev server
- `npm run server:dev` - Backend dev server (from `server`)
- `npm run dev:full` - Run frontend + backend together
- `npm run build` - Frontend production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Server scripts

Inside `server` directory:

- `npm run dev` - Start backend in watch mode
- `npm run start` - Start backend normally

## Notes

- Frontend uses Vite proxy for API routes (`/api`) to backend.
- Keep `.env` and `server/.env` private and never commit secrets.

## Troubleshooting

- If MongoDB connection fails:
	- Verify `MONGO_URI` in `.env` (or `server/.env` if using overrides)
	- Confirm MongoDB service is running
- If export download fails:
	- Ensure backend is running
	- Check endpoint accessibility at `/api/export/*`
- If lint fails:
	- Run `npm run lint` and fix the reported files
