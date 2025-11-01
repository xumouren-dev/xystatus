import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 计算运行天数（纯函数，可在客户端使用）
 */
export function calculateRunningDays(startDate: number): number {
  const now = Date.now()
  const diff = now - startDate
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}
