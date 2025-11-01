'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function TerminalHeader() {
  const [currentTime, setCurrentTime] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTimezone = localStorage.getItem('timezone') || 'UTC'
    setTimezone(savedTimezone)

    const updateTime = () => {
      const now = new Date()
      const tz = localStorage.getItem('timezone') || 'UTC'

      if (tz === 'UTC') {
        const utcTime = now.toISOString().slice(11, 19)
        setCurrentTime(utcTime)
      } else {
        const time = now.toLocaleTimeString('en-US', {
          timeZone: tz,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        setCurrentTime(time)
      }
      setTimezone(tz)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    const handleTimezoneChange = () => {
      updateTime()
    }

    window.addEventListener('timezoneChange', handleTimezoneChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('timezoneChange', handleTimezoneChange)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="border-b border-border bg-black/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between font-mono text-sm">
          <span className="text-chart-3 font-bold">root@xystatus:~$</span>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {timezone === 'UTC' ? 'UTC' : timezone.split('/')[1]} {currentTime}
            </span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-lg bg-muted/10 hover:bg-muted/30 flex items-center justify-center transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
