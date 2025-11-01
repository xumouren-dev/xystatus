'use client'

import { useState, useTransition } from 'react'
import { Pencil, X } from 'lucide-react'
import { editService } from '@/lib/actions'
import type { Service } from '@/lib/types'

interface EditServiceDialogProps {
  service: Service
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editService(formData)
        setIsOpen(false)
      } catch (error) {
        console.error('Failed to edit service:', error)
      }
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 hover:bg-muted rounded transition-colors"
        title="编辑服务"
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground font-mono">
            {'>'} 编辑服务
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
          <input type="hidden" name="id" value={service.id} />

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              服务名称
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={service.name}
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
              defaultValue={service.url}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isPending ? '保存中...' : '保存修改'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
