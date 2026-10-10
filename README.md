# Study Planner

Study Planner is a full-stack web application that helps users organize their study subjects, tasks, and study sessions.

## Features

- Secure user login
- JWT authentication
- Password hashing with bcrypt
- Create and delete subjects
- Create, update, complete, and delete tasks
- Create and delete study sessions
- Dashboard with live statistics
- Data visualization using Recharts
- Shared state management using Redux Toolkit
- Responsive modern user interface

## Technologies

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- Recharts
- CSS

### Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- MySQL

## Project Structure

```text
study-planner/
├── client/     # React frontend
├── server/     # Express backend
├── .gitignore
└── README.md
```

## Installation

### 1. Install frontend dependencies

```bash
cd client
npm install
```

### 2. Install backend dependencies

```bash
cd ../server
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `server` folder and add the database connection information and JWT secret.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=study_planner
JWT_SECRET=your_secret_key
PORT=5000
```

Do not upload the `.env` file to GitHub.

## Running the Project

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Production Build

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm run build
```

## API

The backend runs by default at:

```text
http://localhost:5000
```

Main API resources:

- `/api/auth`
- `/api/subjects`
- `/api/tasks`
- `/api/sessions`

## Security

- Passwords are protected using bcrypt.
- Authentication uses JSON Web Tokens.
- Private API routes require an authorization token.
- Each user can access only their own planner data.

## Additional Library

Recharts was learned and used as an additional library to display a visual overview of subjects, tasks, and study sessions.

## Author

Moner