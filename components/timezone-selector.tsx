'use client'

import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

const TIMEZONES = [
  { value: 'UTC', label: 'UTC', offset: '+0' },
  { value: 'Asia/Shanghai', label: '北京 (UTC+8)', offset: '+8' },
  { value: 'Asia/Tokyo', label: '东京 (UTC+9)', offset: '+9' },
  { value: 'Europe/London', label: '伦敦 (UTC+0)', offset: '+0' },
  { value: 'Europe/Paris', label: '巴黎 (UTC+1)', offset: '+1' },
  { value: 'America/New_York', label: '纽约 (UTC-5)', offset: '-5' },
  { value: 'America/Los_Angeles', label: '洛杉矶 (UTC-8)', offset: '-8' },
]

export function TimezoneSelector() {
  const [timezone, setTimezone] = useState('UTC')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('timezone')
    if (saved) {
      setTimezone(saved)
    }
  }, [])

  const handleChange = (value: string) => {
    setTimezone(value)
    localStorage.setItem('timezone', value)
    window.dispatchEvent(new Event('timezoneChange'))
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={timezone}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-muted/10 hover:bg-muted/30 border border-border rounded-md px-3 py-2 text-sm font-mono transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-chart-3"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  )
}
