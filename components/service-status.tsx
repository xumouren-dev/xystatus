'use client'

import type { ServiceInfo } from '@/lib/types'
import { calculateRunningDays } from '@/lib/utils'
import { UptimeBar } from '@/components/uptime-bar'
import { EditServiceDialog } from '@/components/edit-service-dialog'
import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteService as deleteServiceAction } from '@/lib/actions'

interface ServiceStatusProps {
  service: ServiceInfo
  showActions?: boolean
}

export function ServiceStatus({ service, showActions }: ServiceStatusProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { stats } = service
  const runningDays = calculateRunningDays(service.createdAt)

  const statusColor = {
    online: 'bg-chart-3',
    offline: 'bg-destructive',
    degraded: 'bg-chart-5',
  }[stats.lastCheck?.status || 'offline']

  const statusText = {
    online: 'text-chart-3',
    offline: 'text-destructive',
    degraded: 'text-chart-5',
  }[stats.lastCheck?.status || 'offline']

  const statusLabel = {
    online: '● ONLINE',
    offline: '● OFFLINE',
    degraded: '⚠ DEGRADED',
  }[stats.lastCheck?.status || 'offline']

  const handleDelete = () => {
    startTransition(async () => {
      await deleteServiceAction(service.id)
      setShowDeleteConfirm(false)
    })
  }

  return (
    <div className="border border-border bg-card/50 rounded-lg p-4 font-mono text-sm space-y-3 relative">
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center space-y-4 p-4">
            <div className="text-destructive font-bold">确认删除？</div>
            <div className="text-muted-foreground text-xs">
              此操作将删除所有历史数据
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90"
              >
                确认
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 服务名称和状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-foreground font-bold">{service.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${statusText} font-bold`}>{statusLabel}</span>
          {showActions && (
            <div className="flex items-center gap-1">
              <EditServiceDialog service={service} />
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isPending}
                className="p-1 hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                title="删除服务"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* URL */}
      <div className="text-muted-foreground text-xs truncate">
        {service.url}
      </div>

      {/* 30天可用性条形图 */}
      <div className="pt-2">
        <UptimeBar data={service.uptimeData} />
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground">可用率</div>
          <div className="text-base font-bold text-chart-3">
            {stats.uptime.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">运行天数</div>
          <div className="text-base font-bold text-foreground">
            {runningDays}天
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">响应时间</div>
          <div className="text-base font-bold text-chart-4">
            {stats.lastCheck?.responseTime || 0}ms
          </div>
        </div>
      </div>
    </div>
  )
}
