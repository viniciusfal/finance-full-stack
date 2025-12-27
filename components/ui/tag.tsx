import { cn } from '@/lib/utils'

type CategoryColor =
  | 'blue'
  | 'purple'
  | 'orange'
  | 'green'
  | 'pink'
  | 'yellow'
  | 'red'

interface TagProps {
  label: string
  color?: CategoryColor
  className?: string
}

const colorStyles: Record<CategoryColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-light', text: 'text-blue-dark' },
  purple: { bg: 'bg-purple-light', text: 'text-purple-dark' },
  orange: { bg: 'bg-orange-light', text: 'text-orange-dark' },
  green: { bg: 'bg-green-light', text: 'text-green-dark' },
  pink: { bg: 'bg-pink-light', text: 'text-pink-dark' },
  yellow: { bg: 'bg-yellow-light', text: 'text-yellow-dark' },
  red: { bg: 'bg-red-light', text: 'text-red-dark' },
}

export function Tag({ label, color = 'blue', className }: TagProps) {
  const styles = colorStyles[color]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
        styles.bg,
        styles.text,
        className
      )}
    >
      {label}
    </span>
  )
}

