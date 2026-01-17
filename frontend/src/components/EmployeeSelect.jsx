import { Search, User } from 'lucide-react'

export default function EmployeeSelect({ employees, selectedEmployee, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <select
          onChange={(e) => {
            const selectedId = parseInt(e.target.value)
            const emp = employees.find(employee => employee.id === selectedId)
            onSelect(emp)
          }}
          value={selectedEmployee?.id || ''}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an employee...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} - {emp.department}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
