import type { ReactNode } from "react"

interface SensorCardProps {
  title: string
  sensorType: string
  children: ReactNode
  gradient: string
}

export function SensorCard({ title, sensorType, children, gradient }: SensorCardProps) {
  return (
    <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${gradient} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 flex items-center">{title}</h2>
        <StatusBadge>{sensorType}</StatusBadge>
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}

interface StatusBadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatusBadge({ children, variant = "default" }: StatusBadgeProps) {
  const variantClasses = {
    default: "bg-white/30 dark:bg-black/30 text-cyan-900 dark:text-cyan-100",
    success: "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200",
    warning: "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200",
    danger: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200",
  }

  return <span className={`text-sm px-2 py-1 rounded-full ${variantClasses[variant]}`}>{children}</span>
}

interface CardFooterProps {
  children: ReactNode
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <div className="mt-auto pt-4 border-t border-white/30 dark:border-black/30">
      <div className="flex justify-between text-sm">{children}</div>
    </div>
  )
}

interface FooterItemProps {
  icon: ReactNode
  children: ReactNode
}

export function FooterItem({ icon, children }: FooterItemProps) {
  return (
    <div className="flex items-center">
      {icon}
      <span>{children}</span>
    </div>
  )
}

interface SensorValueProps {
  value: string
  unit: string
  textColor?: string
}

export function SensorValue({ value, unit, textColor = "text-cyan-900 dark:text-cyan-100" }: SensorValueProps) {
  return (
    <div className="flex items-end justify-center">
      <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
      <span className={`text-lg font-medium ml-1 ${textColor.replace("900", "800").replace("100", "200")}`}>
        {unit}
      </span>
    </div>
  )
}

interface SensorLabelProps {
  icon: ReactNode
  label: string
  textColor?: string
}

export function SensorLabel({ icon, label, textColor = "text-cyan-700 dark:text-cyan-300" }: SensorLabelProps) {
  return (
    <div className="flex items-center justify-center mb-3">
      {icon}
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  )
}
