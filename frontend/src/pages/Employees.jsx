import { useState, useEffect } from 'react'
import { Trash2, Plus, Users } from 'lucide-react'
import EmployeeForm from '../components/EmployeeForm'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const createEmployee = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create employee')
      }
      
      setShowForm(false)
      fetchEmployees()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async (id) => {
    if (!confirm('Delete this employee?')) return
    
    try {
      setLoading(true)
      await fetch(`/api/employees/${id}`, { method: 'DELETE' })
      fetchEmployees()
    } catch (err) {
      setError('Failed to delete employee')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  if (loading && employees.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            showForm
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          <Plus size={18} />
          <span>{showForm ? 'Cancel' : 'Add Employee'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
          <EmployeeForm onSubmit={createEmployee} loading={loading} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {employees.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto h-14 w-14 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first employee.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{employee.employee_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
