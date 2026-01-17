# HRMS-Lite

A lightweight Human Resource Management System (HRMS) built with React and FastAPI.

## Features

- **Employee Management**: Add, view, and manage employees with department information
- **Attendance Tracking**: Mark and track employee attendance (Present/Absent)
- **Responsive UI**: Modern, responsive interface built with React and Tailwind CSS
- **RESTful API**: Fast and efficient API built with FastAPI
- **Database**: PostgreSQL for reliable data persistence

## Tech Stack

### Frontend
- **React 18.3**: JavaScript library for building user interfaces
- **Vite 7.2**: Fast frontend build tool with HMR
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **React Router 6.20**: Client-side routing
- **React Hook Form 7.48**: Performant form validation
- **Zod 3.22**: TypeScript-first schema validation
- **Lucide React**: Icon library

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLModel**: Combines SQLAlchemy ORM with Pydantic models
- **PostgreSQL**: Relational database
- **Uvicorn**: ASGI server

## Project Structure

```
hrms-lite/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints (employees, attendance)
│   │   ├── models/         # SQLModel database models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── core/           # Configuration, database setup
│   │   └── main.py         # FastAPI app setup
│   ├── requirements.txt     # Python dependencies
│   └── .env               # Environment variables
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── App.jsx        # Main app component
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- PostgreSQL 12+

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file with database configuration:
   ```env
   DATABASE_URL=postgresql+psycopg2://hrms_user:strong_password@localhost:5432/hrms_lite
   ```

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Database Setup

The database is automatically created when the backend server starts. To manually create it:

```bash
psql -U postgres -h localhost -c "CREATE DATABASE hrms_lite;"
psql -U postgres -h localhost -d hrms_lite -c "GRANT ALL PRIVILEGES ON SCHEMA public TO hrms_user;"
```

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee
- `DELETE /api/employees/{id}` - Delete an employee

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance?employee_id={id}` - Get attendance for specific employee
- `POST /api/attendance` - Mark attendance

## Usage

1. Open `http://localhost:5173` in your browser
2. Navigate to **Employees** page to manage employees
3. Navigate to **Attendance** page to mark attendance
4. Use the dashboard for overview (if implemented)

## Development

### Running in Development Mode

- Backend auto-reloads on file changes with `--reload` flag
- Frontend hot-reloads automatically via Vite

### Making Changes

- Backend: Modify files in `backend/app/` and changes reload automatically
- Frontend: Modify files in `frontend/src/` and changes reload in browser

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database and user exist with correct permissions

### Frontend Won't Load
- Clear browser cache
- Check that backend API is running on port 8000
- Check browser console for errors

### API Errors
- Check backend logs for detailed error messages
- Verify request payload matches schema
- Ensure all required fields are provided

## Future Enhancements

- User authentication and authorization
- Salary management
- Leave management
- Performance reviews
- Reports and analytics
- Mobile app

## License

MIT

## Support

For issues or questions, please check the logs or open an issue in the repository.
