# Event Planner

This project is a React frontend application that interfaces with the Planner API backend. It allows admins to create connected authors and events,while allowing all users to like/dislike them. 

## Features

- Login/registration as a user or admin
- Every user can view the event and author tables
- Detail pages for every event,author,user
- Like or dislike events
- User profile management (change password/email/name)
- As an admin, view users, and edit tables (add,edit or delete data, except that of other admins)
- Filtering for user role, sorting by clicking the specific table column header

## How to run

- Clone repository
- Run npm install in both projects
- Create a .env file using .env.example, replace variables with own values
- Run npm run start in the backend, and npm run dev in the frontend
- Connect to the localhost of the frontend and try the project