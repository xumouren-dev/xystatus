'use client'

import type { UptimeDataPoint } from '@/lib/types'

interface UptimeBarProps {
  data: UptimeDataPoint[]
}

export function UptimeBar({ data }: UptimeBarProps) {
  const getColor = (uptime: number, checks: number) => {
    if (checks === 0) return 'bg-muted/30' // 没有数据
    if (uptime >= 98) return 'bg-chart-3' // 绿色
    if (uptime >= 85) return 'bg-chart-5' // 黄色
    return 'bg-destructive' // 红色
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatUptime = (uptime: number) => {
    return uptime.toFixed(1) + '%'
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground font-mono">最近30天</div>
      <div className="flex gap-[2px] h-8">
        {data.map((point, index) => {
          const color = getColor(point.uptime, point.checks)

          return (
            <div
              key={index}
              className="group relative flex-1 flex items-end"
            >
              <div
                className={`${color} rounded-sm transition-all cursor-help w-full`}
                style={{ height: point.checks === 0 ? '4px' : '100%' }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-card border border-border rounded-md px-2 py-1 text-xs font-mono whitespace-nowrap shadow-lg">
                  <div className="text-muted-foreground">{formatDate(point.timestamp)}</div>
                  <div className="text-foreground font-bold">
                    {point.checks > 0 ? formatUptime(point.uptime) : '无数据'}
                  </div>
                  {point.checks > 0 && (
                    <div className="text-muted-foreground text-[10px]">
                      {point.checks} 次检查
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
