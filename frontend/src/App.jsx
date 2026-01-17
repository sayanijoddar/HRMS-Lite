import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Home, Users, Calendar } from 'lucide-react'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">HRMS Lite</h1>
              </div>
              <nav className="flex space-x-4">
                <NavLink to="/" className={({ isActive }) => `flex items-center space-x-2 px-3 py-2 text-sm border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-700 border-transparent hover:text-blue-600'}`}>
                  <Home size={18} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/employees" className={({ isActive }) => `flex items-center space-x-2 px-3 py-2 text-sm border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-700 border-transparent hover:text-blue-600'}`}>
                  <Users size={18} />
                  <span>Employees</span>
                </NavLink>
                <NavLink to="/attendance" className={({ isActive }) => `flex items-center space-x-2 px-3 py-2 text-sm border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-700 border-transparent hover:text-blue-600'}`}>
                  <Calendar size={18} />
                  <span>Attendance</span>
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HRMS Lite</h2>
                <p className="text-lg text-gray-600">Manage employees and track attendance</p>
              </div>
            } />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
