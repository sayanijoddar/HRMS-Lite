import { useState, useEffect } from 'react'
import { Users, CheckCircle2, Calendar } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendanceRecords: 0,
    presentToday: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch employees count
      const employeesRes = await fetch('/api/employees')
      const employees = await employeesRes.json()
      const totalEmployees = Array.isArray(employees) ? employees.length : 0

      // Fetch attendance records for each employee
      let allAttendanceRecords = []
      let presentTodayCount = 0
      const today = new Date().toISOString().split('T')[0]

      if (totalEmployees > 0 && Array.isArray(employees)) {
        for (const employee of employees) {
          try {
            const attendanceRes = await fetch(`/api/attendance?employee_id=${employee.id}`)
            const attendanceData = await attendanceRes.json()
            
            if (Array.isArray(attendanceData)) {
              allAttendanceRecords = [...allAttendanceRecords, ...attendanceData]
              
              // Count present today
              const presentToday = attendanceData.filter(
                record => record.date === today && record.status === 'Present'
              ).length
              if (presentToday > 0) {
                presentTodayCount++
              }
            }
          } catch (err) {
            console.error(`Failed to fetch attendance for employee ${employee.id}:`, err)
          }
        }
      }

      const totalAttendanceRecords = allAttendanceRecords.length

      setStats({
        totalEmployees,
        totalAttendanceRecords,
        presentToday: presentTodayCount
      })
    } catch (err) {
      setError('Failed to load statistics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg opacity-10`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <div className="flex justify-center py-12">Loading statistics...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={stats.totalEmployees}
          color="text-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="Total Attendance Records"
          value={stats.totalAttendanceRecords}
          color="text-green-600"
        />
        <StatCard
          icon={CheckCircle2}
          title="Present Today"
          value={stats.presentToday}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Average Attendance Rate:{' '}
            <span className="font-semibold text-gray-900">
              {stats.totalEmployees > 0
                ? ((stats.totalAttendanceRecords / (stats.totalEmployees * 30)) * 100).toFixed(1)
                : 0}
              %
            </span>
          </p>
          <p>
            Employees Marked Today:{' '}
            <span className="font-semibold text-gray-900">{stats.presentToday} / {stats.totalEmployees}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
