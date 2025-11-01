'use server'

import { revalidatePath } from 'next/cache'
import type { Service } from './types'
import {
  getServices,
  saveService,
  deleteService as deleteServiceFromStorage,
} from './storage'
import { monitorService } from './monitor'

/**
 * 验证管理员密码
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD not configured')
  }
  return password === adminPassword
}

/**
 * 添加新服务
 */
export async function addService(formData: FormData) {
  const name = formData.get('name') as string
  const url = formData.get('url') as string

  const service: Service = {
    id: crypto.randomUUID(),
    name,
    url,
    createdAt: Date.now(),
    enabled: true,
  }

  await saveService(service)
  revalidatePath('/')
  revalidatePath('/admin')

  return service
}

/**
 * 编辑服务
 */
export async function editService(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const url = formData.get('url') as string

  const services = await getServices()
  const existingService = services.find((s) => s.id === id)

  if (!existingService) {
    throw new Error('Service not found')
  }

  const updatedService: Service = {
    ...existingService,
    name,
    url,
  }

  await saveService(updatedService)
  revalidatePath('/')
  revalidatePath('/admin')

  return updatedService
}

/**
 * 删除服务
 */
export async function deleteService(serviceId: string) {
  await deleteServiceFromStorage(serviceId)
  revalidatePath('/')
  revalidatePath('/admin')
}

/**
 * 手动触发监控
 */
export async function triggerMonitor() {
  const services = await getServices()

  for (const service of services) {
    if (service.enabled) {
      await monitorService(service)
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
}
