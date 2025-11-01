import type { Service, StatusCheck, ServiceStatus, ServiceStats, UptimeDataPoint } from './types'
import { addStatusCheck, getStatusHistory, getStats, updateStats } from './storage'

/**
 * 执行健康检查
 */
export async function performHealthCheck(service: Service): Promise<StatusCheck> {
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

    const response = await fetch(service.url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'XyStatus/1.0 (Service Monitor)',
      },
    })

    clearTimeout(timeoutId)

    const responseTime = Date.now() - startTime
    const status: ServiceStatus = response.ok ? 'online' : 'degraded'

    return {
      timestamp: Date.now(),
      status,
      responseTime,
      statusCode: response.status,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      timestamp: Date.now(),
      status: 'offline',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 计算服务统计数据
 */
export async function calculateStats(serviceId: string, service: Service): Promise<ServiceStats> {
  const history = await getStatusHistory(serviceId)

  if (history.length === 0) {
    return {
      serviceId,
      totalChecks: 0,
      successfulChecks: 0,
      uptime: 100,
      startDate: service.createdAt,
    }
  }

  const totalChecks = history.length
  const successfulChecks = history.filter(h => h.status === 'online').length
  const uptime = (successfulChecks / totalChecks) * 100

  return {
    serviceId,
    totalChecks,
    successfulChecks,
    uptime: Math.round(uptime * 100) / 100, // 保留两位小数
    startDate: service.createdAt,
    lastCheck: history[history.length - 1],
  }
}

/**
 * 计算30天可视化数据
 * 每天一个数据点，共30天
 */
export async function calculate30DaysData(serviceId: string): Promise<UptimeDataPoint[]> {
  const history = await getStatusHistory(serviceId)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  // 过滤最近30天的数据
  const recentHistory = history.filter(h => h.timestamp >= thirtyDaysAgo)

  // 按天分组
  const dailyData = new Map<number, { online: number; total: number }>()

  for (const check of recentHistory) {
    const dayTimestamp = Math.floor(check.timestamp / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)

    const existing = dailyData.get(dayTimestamp) || { online: 0, total: 0 }
    existing.total++
    if (check.status === 'online') {
      existing.online++
    }
    dailyData.set(dayTimestamp, existing)
  }

  // 转换为数据点数组
  const dataPoints: UptimeDataPoint[] = []
  const now = Date.now()

  for (let i = 29; i >= 0; i--) {
    const dayTimestamp = Math.floor((now - i * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000)
    const data = dailyData.get(dayTimestamp)

    if (data) {
      dataPoints.push({
        timestamp: dayTimestamp,
        uptime: (data.online / data.total) * 100,
        checks: data.total,
      })
    } else {
      // 没有数据的时间点
      dataPoints.push({
        timestamp: dayTimestamp,
        uptime: 100,
        checks: 0,
      })
    }
  }

  return dataPoints
}

/**
 * 执行监控并保存结果
 */
export async function monitorService(service: Service): Promise<void> {
  if (!service.enabled) return

  const check = await performHealthCheck(service)
  await addStatusCheck(service.id, check)

  const stats = await calculateStats(service.id, service)
  await updateStats(service.id, stats)
}
