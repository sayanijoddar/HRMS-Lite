// Simple styled components using Tailwind
export const Button = ({ children, className = '', disabled, ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm'
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)

export const Input = ({ className = '', disabled, ...props }) => (
  <input
    className={`w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
      className
    }`}
    disabled={disabled}
    {...props}
  />
)

// Simple Select components
export const Select = ({ children, value, onValueChange, ...props }) => (
  <select
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    {...props}
  >
    {children}
  </select>
)

export const SelectTrigger = ({ children, className = '', ...props }) => (
  <div className={`w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all ${className}`} {...props}>
    {children}
  </div>
)

export const SelectContent = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
)

export const SelectItem = ({ children, value, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
)

export const SelectValue = ({ placeholder = '' }) => <span>{placeholder}</span>

