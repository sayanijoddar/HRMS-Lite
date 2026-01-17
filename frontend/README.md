# HRMS-Lite Frontend

React + Vite frontend for the HRMS-Lite application.

## Tech Stack

- **React 18.3**: UI library
- **Vite 7.2**: Build tool with HMR
- **React Router 6.20**: Client-side routing
- **Tailwind CSS 3.4**: Styling
- **React Hook Form 7.48**: Form handling
- **Zod 3.22**: Schema validation
- **Lucide React**: Icons

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running (local: `http://localhost:8000` or production: `https://hrms-lite-ltbb.onrender.com`)

### Installation

\\\ash
npm install
\\\

### Development

\\\ash
npm run dev
\\\

Runs at \http://localhost:5173\ with HMR enabled.

## Project Structure

`
src/
 components/          # Reusable UI components
    EmployeeForm.jsx
    EmployeeList.jsx
    EmployeeSelect.jsx
    AttendanceForm.jsx
    AttendanceList.jsx
    ui.jsx
 pages/              # Page components
    Employees.jsx
    Attendance.jsx
 hooks/              # Custom React hooks
    useApi.js       # HTTP request hook
 App.jsx             # Main app with routing
 main.jsx            # Entry point
 index.css           # Global styles
`

## Features

### Employees Page
- View all employees in a table
- Add new employees with form validation
- Delete employees
- Form validation with Zod schemas

### Attendance Page
- Select an employee from dropdown
- Mark attendance (Present/Absent)
- View attendance history

## API Integration

### Development
The app communicates with the local backend API at `http://localhost:8000`.

### Production
In production (Vercel), the app communicates with the deployed backend at `https://hrms-lite-ltbb.onrender.com`.

### Configured Routes
- `GET /api/employees` - Fetch employees
- `POST /api/employees` - Create employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/attendance` - Fetch attendance
- `POST /api/attendance` - Mark attendance

Environment variables are set in `.env.development` and `.env.production`.

## Deployment

This application is deployed on **Vercel**.

- **Live URL**: https://hrms-lite-hlujgow1p-sayanijoddars-projects.vercel.app
- **Backend API**: https://hrms-lite-ltbb.onrender.com

See [Deployment Guide](./DEPLOYMENT.md) for complete setup instructions.

## Building for Production

\\\ash
npm run build
\\\

This creates an optimized build in the \dist/\ folder ready for deployment.
