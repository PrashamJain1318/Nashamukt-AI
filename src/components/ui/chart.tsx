import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/components/theme-provider'

// eslint-disable-next-line react-refresh/only-export-components
export const chartColors = {
  light: {
    primary: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    grid: '#e2e8f0',
    text: '#64748b'
  },
  dark: {
    primary: '#38bdf8',
    success: '#065f46',
    warning: '#b45309',
    danger: '#7f1d1d',
    grid: '#334155',
    text: '#94a3b8'
  }
}

export function ProgressChart({ data, dataKey, xKey = "name", color = "primary" }: { data: Record<string, unknown>[], dataKey: string, xKey?: string, color?: "primary" | "success" | "warning" | "danger" }) {
  const { theme } = useTheme()
  const activeTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  const colors = chartColors[activeTheme as 'light' | 'dark']
  const chartColor = colors[color]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey={xKey} stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={2} fillOpacity={1} fill={`url(#color${color})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
