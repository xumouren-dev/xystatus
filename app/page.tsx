import type { ServiceInfo } from '@/lib/types'
import { TerminalHeader } from '@/components/terminal-header'
import { ServiceStatus } from '@/components/service-status'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { getServices, getStatusHistory } from '@/lib/storage'
import { calculateStats, calculate30DaysData } from '@/lib/monitor'

async function getServicesData(): Promise<ServiceInfo[]> {
  const services = await getServices()
  const servicesInfo: ServiceInfo[] = []

  for (const service of services) {
    const stats = await calculateStats(service.id, service)
    const history = await getStatusHistory(service.id)
    const recentChecks = history.slice(-10)
    const uptimeData = await calculate30DaysData(service.id)

    servicesInfo.push({
      ...service,
      stats,
      recentChecks,
      uptimeData,
    })
  }

  return servicesInfo
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const services = await getServicesData()

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-mono">
              {'>'} UPTIME
            </h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-muted/10 hover:bg-muted/30 text-muted-foreground hover:text-foreground font-mono"
          >
            <Lock className="h-4 w-4" />
            管理
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="border border-border bg-card/50 rounded-lg p-12 text-center space-y-4">
            <div className="text-muted-foreground font-mono text-sm">
              {'>'} NO SERVICES CONFIGURED
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              Add your first service to start monitoring
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceStatus key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
