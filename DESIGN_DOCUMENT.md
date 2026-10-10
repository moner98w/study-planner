# Study Planner – Design Document

## 1. Project Overview

Study Planner is a full-stack web application designed to help students organize their study activities in one place.

The application allows each user to manage:

- Study subjects
- Study tasks
- Study sessions
- Personal study statistics

## 2. Problem

Students often manage subjects, tasks, and study schedules using separate applications or notes. This can make planning difficult and information easy to forget.

Study Planner solves this problem by combining these features in one simple and organized application.

## 3. Target Users

The main target users are students who need an easy way to plan their studies, follow their tasks, and schedule study sessions.

## 4. Main Goals

- Provide a simple study-management system.
- Protect each user’s private information.
- Store data permanently in a database.
- Display a clear summary of study activity.
- Support use on desktop and smaller screens.

## 5. Main Features

### Authentication

- Secure login using email and password.
- Password protection using bcrypt.
- Authentication using JSON Web Tokens.
- Protected API endpoints.

### Subjects

- View subjects.
- Add a new subject.
- Delete a subject.

### Tasks

- View tasks.
- Add a new task.
- Update task status.
- Delete a task.

### Study Sessions

- View study sessions.
- Add a session with title, date, and duration.
- Delete a study session.

### Dashboard

- Display the number of subjects.
- Display the number of tasks.
- Display the number of study sessions.
- Display these statistics using a Recharts bar chart.

## 6. Technologies

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

### Database

- MySQL

## 7. System Architecture

The system uses a client-server architecture.

```text
User
  ↓
React Frontend
  ↓ HTTP / JSON
Express REST API
  ↓ SQL Queries
MySQL Database
```

The frontend sends HTTP requests to the backend. The backend validates the request, communicates with MySQL, and returns a JSON response.

## 8. Frontend Design

The application contains the following views:

1. Login page
2. Dashboard
3. Subjects page
4. Tasks page
5. Study Sessions page

Redux Toolkit stores the shared subjects, tasks, and study-session data.

React local state is used for forms, login information, loading states, messages, and page navigation.

## 9. Backend Design

The backend is divided into:

- Configuration
- Middleware
- Routes
- Database connection

Main route groups:

```text
/api/auth
/api/subjects
/api/tasks
/api/sessions
```

Authentication middleware checks the JWT before allowing access to protected routes.

## 10. Database Design

### Users

Stores account information.

Main fields:

- id
- email
- password

### Subjects

Stores the subjects belonging to each user.

Main fields:

- id
- user_id
- name
- color

### Tasks

Stores the tasks belonging to each user.

Main fields:

- id
- user_id
- title
- status

### Study Sessions

Stores planned study sessions.

Main fields:

- id
- user_id
- title
- session_date
- start_time
- duration_minutes

## 11. Database Relationships

- One user can have many subjects.
- One user can have many tasks.
- One user can have many study sessions.
- Each record is connected to its owner using `user_id`.

## 12. Security Design

- Passwords are hashed using bcrypt.
- JWT is used after a successful login.
- Protected requests send the token in the Authorization header.
- Database queries filter records using `user_id`.
- Environment variables are stored in `.env`.
- `.env` is excluded from Git using `.gitignore`.

## 13. User Flow

```text
Login
  ↓
Dashboard
  ↓
Choose Subjects, Tasks, or Study Sessions
  ↓
View, add, update, or delete data
  ↓
Return to Dashboard
  ↓
Logout
```

## 14. Additional Library

Recharts is used to create a bar chart showing the current totals of subjects, tasks, and study sessions.

This provides a quick visual overview of the user’s study plan.

## 15. Testing

The following functionality is tested:

- Valid and invalid login
- Loading user-specific data
- Adding and deleting subjects
- Adding, updating, and deleting tasks
- Adding and deleting sessions
- Dashboard statistics
- Logout
- Frontend production build
- Backend TypeScript build

## 16. Future Improvements

- User registration page
- Task deadlines and priorities
- Subject-specific tasks
- Calendar view
- Notifications and reminders
- Editing subjects and sessions
- Dark mode
- Online deployment