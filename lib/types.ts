/**
 * 服务状态枚举
 */
export type ServiceStatus = 'online' | 'offline' | 'degraded'

/**
 * 服务配置
 */
export interface Service {
  id: string
  name: string
  url: string
  createdAt: number // 创建时间戳
  enabled: boolean
}

/**
 * 服务状态检查记录
 */
export interface StatusCheck {
  timestamp: number // 检查时间戳
  status: ServiceStatus
  responseTime: number // 响应时间（ms）
  statusCode?: number // HTTP状态码
  error?: string // 错误信息
}

/**
 * 服务统计数据
 */
export interface ServiceStats {
  serviceId: string
  totalChecks: number // 总检查次数
  successfulChecks: number // 成功次数
  uptime: number // 可用率（0-100）
  startDate: number // 开始监控时间戳
  lastCheck?: StatusCheck // 最后一次检查
}

/**
 * 30天可视化数据点（每小时一个数据点）
 */
export interface UptimeDataPoint {
  timestamp: number // 小时时间戳
  uptime: number // 该小时的可用率（0-100）
  checks: number // 该小时的检查次数
}

/**
 * 服务完整信息（包含配置、统计和最近状态）
 */
export interface ServiceInfo extends Service {
  stats: ServiceStats
  recentChecks: StatusCheck[] // 最近的检查记录（用于展示）
  uptimeData: UptimeDataPoint[] // 30天可视化数据
}
