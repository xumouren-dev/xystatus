import { getServices } from './storage'
import { monitorService } from './monitor'

let monitorInterval: NodeJS.Timeout | null = null
let isStarted = false

/**
 * 执行一次监控检查
 */
async function runMonitor() {
  try {
    const services = await getServices()
    for (const service of services) {
      if (service.enabled) {
        await monitorService(service)
      }
    }
  } catch (error) {
    console.error('[Monitor Error]', error)
  }
}

/**
 * 启动监控调度器（全局单例）
 */
export async function startMonitorScheduler() {
  if (isStarted) return

  isStarted = true
  const intervalSeconds = parseInt(process.env.MONITOR_INTERVAL || '60', 10)
  const intervalMs = intervalSeconds * 1000

  console.log(`[Monitor] Starting background monitoring service (interval: ${intervalSeconds}s)...`)

  // 立即执行一次
  await runMonitor()

  // 按配置的间隔执行
  monitorInterval = setInterval(runMonitor, intervalMs)

  console.log('[Monitor] Background monitoring service started')
}
