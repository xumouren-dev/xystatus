import { promises as fs } from 'fs'
import path from 'path'
import type { Service, StatusCheck, ServiceStats } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const SERVICES_FILE = path.join(DATA_DIR, 'services.json')
const STATS_FILE = path.join(DATA_DIR, 'stats.json')
const STATUS_DIR = path.join(DATA_DIR, 'status')

/**
 * 确保数据目录存在
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.mkdir(STATUS_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create data directories:', error)
  }
}

/**
 * 读取 JSON 文件
 */
async function readJSON<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return defaultValue
  }
}

/**
 * 写入 JSON 文件
 */
async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * 获取所有服务配置
 */
export async function getServices(): Promise<Service[]> {
  return readJSON<Service[]>(SERVICES_FILE, [])
}

/**
 * 保存服务配置
 */
export async function saveService(service: Service): Promise<void> {
  const services = await getServices()
  const index = services.findIndex(s => s.id === service.id)

  if (index >= 0) {
    services[index] = service
  } else {
    services.push(service)
  }

  await writeJSON(SERVICES_FILE, services)
}

/**
 * 删除服务
 */
export async function deleteService(serviceId: string): Promise<void> {
  const services = await getServices()
  const filtered = services.filter(s => s.id !== serviceId)
  await writeJSON(SERVICES_FILE, filtered)
}

/**
 * 获取服务状态历史
 */
export async function getStatusHistory(serviceId: string): Promise<StatusCheck[]> {
  const statusFile = path.join(STATUS_DIR, `${serviceId}.json`)
  return readJSON<StatusCheck[]>(statusFile, [])
}

/**
 * 添加状态检查记录
 */
export async function addStatusCheck(serviceId: string, check: StatusCheck): Promise<void> {
  const statusFile = path.join(STATUS_DIR, `${serviceId}.json`)
  const history = await getStatusHistory(serviceId)

  history.push(check)

  // 只保留最近90天的详细数据（优化存储）
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
  const filtered = history.filter(h => h.timestamp > ninetyDaysAgo)

  await writeJSON(statusFile, filtered)
}

/**
 * 获取所有服务的统计数据
 */
export async function getStats(): Promise<Record<string, ServiceStats>> {
  return readJSON<Record<string, ServiceStats>>(STATS_FILE, {})
}

/**
 * 更新服务统计数据
 */
export async function updateStats(serviceId: string, stats: ServiceStats): Promise<void> {
  const allStats = await getStats()
  allStats[serviceId] = stats
  await writeJSON(STATS_FILE, allStats)
}

