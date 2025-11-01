'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { triggerMonitor } from '@/lib/actions'

export function RefreshButton() {
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      await triggerMonitor()
    })
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
      刷新状态
    </Button>
  )
}
