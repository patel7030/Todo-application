Todo List Application
This is a full-stack Todo List application built using Next.js, Node.js (Express), and MySQL. The frontend is deployed on Vercel and the backend API is deployed on Railway.

Live Demo
Frontend: https://demo-taskflow-app.vercel.app/

Backend: https://todolistappbackend-production-7589.up.railway.app

Tech Stack Used
Frontend: Next.js 16.0.7, Fetch API
Backend: Node.js, Express.js, MySQL (Railway), mysql2, dotenv

Project Structure
Todo-application

frontend (Next.js)

backend (Node.js, Express, MySQL)

Setup Instructions

Clone the repository.

Frontend Setup

Go to the frontend folder and run: npm install

Create a .env.local file with: NEXT_PUBLIC_API_URL=https://todolistappbackend-production-7589.up.railway.app

Start the frontend using: npm run dev

Backend Setup

Go to the backend folder and run: npm install

Create a .env file containing: MYSQLHOST=<host>, MYSQLUSER=<user>, MYSQLPASSWORD=<password>, MYSQLDATABASE=railway, MYSQLPORT=3306

Start the backend using: npm start

API Documentation
Base URL: https://todolistappbackend-production-7589.up.railway.app

GET /todos – Fetch all todos
POST /todos – Add a new todo (requires task and date fields)
PUT /todos/:id – Update todo status
DELETE /todos/:id – Delete a todo

UI Screenshots
(Add home, add-task, and mobile view screenshots inside a /screenshots folder.)

Deployment
Frontend is deployed on Vercel with the environment variable NEXT_PUBLIC_API_URL.
Backend is deployed on Railway with MySQL connected using environment variables.

Features
Add tasks, update status, delete tasks, filter tasks (All, Active, Completed), responsive UI for mobile and desktop.

Author
Himanshu Patel
