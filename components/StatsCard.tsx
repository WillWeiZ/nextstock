import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  colorClass?: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, colorClass = 'text-blue-600' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="mt-2">
          <p className={`text-3xl font-bold ${colorClass}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard