'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { addService } from '@/lib/actions'

export function AddServiceDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await addService(formData)
        setIsOpen(false)
      } catch (error) {
        console.error('Failed to add service:', error)
      }
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        添加服务
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground font-mono">
            {'>'} 添加新服务
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单 */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              服务名称
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="例如: My Website"
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              监控 URL
            </label>
            <input
              type="url"
              name="url"
              required
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? '添加中...' : '确认添加'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
