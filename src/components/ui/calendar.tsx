import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  onSelectDate?: (date: Date) => void
  habitData?: Record<string, 'success' | 'slip' | 'warning' | 'neutral'> // "YYYY-MM-DD": status
}

export function Calendar({ onSelectDate, habitData = {} }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10 sm:h-12 sm:w-12"></div>)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const status = habitData[dateStr]
    
    let statusClass = "bg-secondary/50 text-foreground hover:bg-secondary border-transparent"
    if (status === 'success') statusClass = "bg-success text-success-foreground border-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]"
    if (status === 'slip') statusClass = "bg-destructive text-destructive-foreground border-transparent"
    if (status === 'warning') statusClass = "bg-warning text-warning-foreground border-transparent"
    
    const isToday = dateStr === new Date().toISOString().split('T')[0]
    if (isToday && !status) statusClass = "border-primary text-primary font-bold"

    days.push(
      <button
        key={d}
        onClick={() => onSelectDate && onSelectDate(new Date(year, month, d))}
        className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 border",
          statusClass
        )}
      >
        {d}
      </button>
    )
  }

  return (
    <div className="p-4 bg-card/50 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-display font-bold text-lg">{monthNames[month]} {year}</h2>
        <button onClick={handleNextMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-semibold text-muted-foreground">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days}
      </div>
    </div>
  )
}
