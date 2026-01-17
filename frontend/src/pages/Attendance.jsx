import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import AttendanceForm from '../components/AttendanceForm'
import EmployeeSelect from '../components/EmployeeSelect'

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load employees')
    }
  }

  const fetchAttendance = async (employeeId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/attendance?employee_id=${employeeId}`)
      const data = await response.json()
      setAttendanceRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          date: formData.date,
          status: formData.status
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to mark attendance')
      }
      
      fetchAttendance(selectedEmployee.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee.id)
    } else {
      setAttendanceRecords([])
    }
  }, [selectedEmployee])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mark Attendance - 1/3 width */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar size={24} />
              <span>Mark Attendance</span>
            </h2>
            
            <EmployeeSelect
              employees={employees}
              selectedEmployee={selectedEmployee}
              onSelect={setSelectedEmployee}
            />
            
            {selectedEmployee && (
              <AttendanceForm
                onSubmit={markAttendance}
                loading={loading}
                employeeName={selectedEmployee.full_name}
              />
            )}
          </div>
        </div>

        {/* Right: Attendance Records - 2/3 width */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {selectedEmployee ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEmployee.full_name}'s Attendance
                </h3>
                <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="mx-auto h-14 w-14 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
                  <p className="text-gray-500">Mark attendance to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'Present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <Calendar className="mx-auto h-14 w-14 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an employee</h3>
              <p className="text-gray-500">Choose an employee to view or mark attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
