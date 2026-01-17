import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from './ui'

const schema = z.object({
  employee_id: z.string().trim().min(1, { message: 'Employee ID is required' }),
  full_name: z.string().trim().min(1, { message: 'Full name is required' }),
  email: z.string().trim().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  department: z.string().trim().min(1, { message: 'Department is required' })
})

export default function EmployeeForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      employee_id: '',
      full_name: '',
      email: '',
      department: ''
    }
  })

  const onSubmitForm = async (data) => {
    try {
      clearErrors()
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
        <input 
          type="text"
          placeholder="E.g., E001, E002, E003"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          disabled={loading}
          {...register('employee_id')}
        />
        {errors.employee_id && <p className="mt-1 text-sm text-red-600">{errors.employee_id.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input 
          type="text"
          placeholder="E.g., John Doe"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          disabled={loading}
          {...register('full_name')}
        />
        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email"
          placeholder="E.g., john@example.com"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          disabled={loading}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <input 
          type="text"
          placeholder="E.g., IT, HR, Sales"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          disabled={loading}
          {...register('department')}
        />
        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Adding Employee...' : 'Add Employee'}
      </Button>
    </form>
  )
}
