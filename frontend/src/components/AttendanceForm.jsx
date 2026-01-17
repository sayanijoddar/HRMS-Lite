import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui'
import { CalendarIcon } from 'lucide-react'

const schema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  status: z.enum(['Present', 'Absent'], { message: 'Status is required' })
})

export default function AttendanceForm({ onSubmit, loading, employeeName }) {
  const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { 
      date: new Date().toISOString().split('T')[0], 
      status: 'Present' 
    }
  })

  const onSubmitForm = async (data) => {
    try {
      clearErrors()
      await onSubmit({ ...data, date: data.date })
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          For: <span className="font-semibold text-gray-900">{employeeName}</span>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          <input 
            type="date" 
            className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            disabled={loading}
            {...register('date')}
          />
        </div>
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select 
          disabled={loading}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          {...register('status')}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Marking Attendance...' : 'Mark Attendance'}
      </Button>
    </form>
  )
}
