# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Blackbook is a full-stack to-do list application with a React frontend and Express backend. The application has two main components:
- **Backend**: Express.js server serving both API endpoints and the built React frontend
- **Frontend**: React app (in `bb/` directory) that communicates with the backend via REST API

## Architecture

### Backend (Root Directory)
- **Entry point**: `bin/www` - HTTP server that starts on port 5000 (or `PORT` env var)
- **Main app**: `app.js` - Express application that:
  - Loads environment variables using `dotenv` from `.env` file
  - Requires `MONGODB_URI` environment variable (exits if not set)
  - Connects to MongoDB using the configured URI
  - Serves React build from `bb/build` at root route `/`
  - Exposes API routes under `/items` and `/users`
  - Enables CORS for all origins
- **Database models**: `noidea.js` - Mongoose schema for items list with `name` and `status` fields
- **Routes**:
  - `routes/items.js` - Full CRUD operations for items at `/items/api/items`
  - `routes/users.js` - Placeholder route (not implemented)

### Frontend (bb/ Directory)
- **Main component**: `bb/src/App.js` - Single-component React app that:
  - Manages item list state with filtering and search
  - Polls backend every 30 seconds for updates
  - Supports toggle between "Show all" and "Hide completed" modes
  - Provides special search syntax: typing `<text>.` marks matching items as incomplete
  - Uses Bootstrap 4 for styling
- **API communication**: Uses axios for POST/PUT and fetch for GET/DELETE requests
- **Backend hostname**: Empty string (assumes same origin), stored in `this.nodehostname`

### Data Flow
1. Frontend makes requests to `/items/api/items` endpoints
2. Backend routes forward to `routes/items.js` handlers
3. Handlers interact with MongoDB via Mongoose models from `noidea.js`
4. Backend returns JSON responses
5. Frontend updates local state and re-renders

## Common Commands

### Running the Application

**Backend (from root):**
```bash
npm start  # Starts Express server on port 5000
```

**Frontend development (from bb/):**
```bash
npm start  # Starts React dev server on port 3006
```

**Build frontend for production:**
```bash
./run.sh  # Installs deps and builds React app to bb/build
```

### Docker

**Build and run with Docker:**
```bash
docker-compose up --build  # Runs on port 5555 (maps to 5000)
```

**Build Docker image:**
```bash
docker build -t blackbook .
```

### Frontend Commands (in bb/ directory)

**Run tests:**
```bash
npm test  # Launches react-scripts test runner
```

**Build for production:**
```bash
npm run build  # Creates optimized build in bb/build/
```

## Development Notes

### MongoDB Connection
- **REQUIRED**: `MONGODB_URI` environment variable must be set before starting the application
- The application will exit with an error if `MONGODB_URI` is not configured
- Uses `dotenv` package to load environment variables from `.env` file
- Collection: `items`

**Configuration:**
1. Copy `.env` file and set `MONGODB_URI`:
```bash
# .env file
MONGDB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true
```

2. For local MongoDB:
```bash
MONGDB_URI=mongodb://localhost:27017/listerine
```

3. For Docker Compose:
- Set `MONGODB_URI` in `.env` file
- Docker Compose will inject it as an environment variable at runtime

### Item Schema
Items have two fields:
- `name`: Mixed type (required)
- `status`: Mixed type (required) - boolean indicating if item is checked/completed

### Frontend Behavior
- Items sort with unchecked items first, then alphabetically (ignoring leading non-ASCII chars)
- Search is case-insensitive and filters by item name
- Special syntax: typing text ending with `.` marks all matching items as incomplete
- Auto-polls backend every 30 seconds to sync state
- Scroll position is preserved when toggling item status

### Build Process
The `run.sh` script:
1. Changes to `bb/` directory
2. Installs npm dependencies
3. Builds React app to `bb/build`
4. Returns to root directory

The Express server then serves this build at the root route.

## Tech Stack
- **Backend**: Express 4.16, Mongoose 6.10, dotenv 16.0, Node >=16.17.1
- **Frontend**: React 16.8, Bootstrap 4.3, axios 0.18, react-scripts 2.1.3
- **Database**: MongoDB (Atlas or local)
- **Deployment**: Docker support with Docker Compose, originally configured for Heroku
