import { useState, useEffect } from 'react'
import { Calendar, Filter } from 'lucide-react'
import AttendanceForm from '../components/AttendanceForm'
import EmployeeSelect from '../components/EmployeeSelect'

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  })
  const [presentDays, setPresentDays] = useState(0)

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
      const records = Array.isArray(data) ? data : []
      setAttendanceRecords(records)
      applyDateFilter(records)
      
      // Calculate present days
      const present = records.filter(r => r.status === 'Present').length
      setPresentDays(present)
    } catch (err) {
      setError('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const applyDateFilter = (records) => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      setFilteredRecords(records)
      return
    }

    const filtered = records.filter(record => {
      const recordDate = new Date(record.date)
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : new Date('1900-01-01')
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : new Date('2100-12-31')
      
      return recordDate >= start && recordDate <= end
    })

    setFilteredRecords(filtered)
  }

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target
    const newFilter = { ...dateFilter, [name]: value }
    setDateFilter(newFilter)
    applyDateFilter(attendanceRecords)
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

              {/* Date Filter */}
              <div className="px-4 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Filter size={16} className="text-gray-600" />
                  <label className="text-sm font-semibold text-gray-700">Filter by Date</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="date"
                      name="startDate"
                      value={dateFilter.startDate}
                      onChange={handleDateFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Start date"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      name="endDate"
                      value={dateFilter.endDate}
                      onChange={handleDateFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{presentDays}</p>
                    <p className="text-xs text-gray-600">Present Days</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{attendanceRecords.length - presentDays}</p>
                    <p className="text-xs text-gray-600">Absent Days</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{attendanceRecords.length}</p>
                    <p className="text-xs text-gray-600">Total Records</p>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredRecords.length === 0 ? (
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
                      {filteredRecords.map((record) => (
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
