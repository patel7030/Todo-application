Todo List Application
This is a full-stack Todo List application built using Next.js, Node.js (Express), and MySQL. The frontend is deployed on Vercel and the backend API is deployed on Railway.

Live Demo
Frontend: https://demo-taskflow-app.vercel.app/

Backend: https://todolistappbackend-production-96c0.up.railway.app

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
1)<img width="1906" height="957" alt="todo-active" src="https://github.com/user-attachments/assets/d1ac627f-fcaa-43c8-84fd-d5bc603a0652" />
2)<img width="266" height="577" alt="todo-completed-mobile" src="https://github.com/user-attachments/assets/0197d9ab-8103-45c6-9eb3-250dafb4bc18" />
3)<img width="267" height="553" alt="todo-empty-mobile" src="https://github.com/user-attachments/assets/4d14eab0-ced5-40ff-95f2-f09de8b7d1e1" />
4)<img width="1915" height="967" alt="todo-full" src="https://github.com/user-attachments/assets/d88e433d-c337-4408-a601-aa7ed38c5c7c" />


Deployment
Frontend is deployed on Vercel with the environment variable NEXT_PUBLIC_API_URL.
Backend is deployed on Railway with MySQL connected using environment variables.

Why Not Use a Single Platform?
Vercel is optimized for Next.js and provides fast global delivery for frontend apps, whereas Railway offers easier setup for backend servers and managed MySQL hosting.  
Using both platforms ensures better performance, simpler configuration, and smooth scaling compared to deploying everything on one platform.

Features
Add tasks, update status, delete tasks, filter tasks (All, Active, Completed), responsive UI for mobile and desktop.

Author
Himanshu Patel
