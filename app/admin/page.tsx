import type { ServiceInfo } from '@/lib/types'
import { TerminalHeader } from '@/components/terminal-header'
import { ServiceStatus } from '@/components/service-status'
import { AddServiceDialog } from '@/components/add-service-dialog'
import { RefreshButton } from '@/components/admin-actions'
import { AdminAuth, LogoutButton } from '@/components/admin-auth'
import { TimezoneSelector } from '@/components/timezone-selector'
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

export default async function AdminPage() {
  const services = await getServicesData()

  return (
    <AdminAuth>
      <div className="min-h-screen bg-background">
        <TerminalHeader />

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-mono">
                {'>'} 管理面板
              </h1>
            </div>

            <div className="flex gap-3">
              <TimezoneSelector />
              <LogoutButton />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground font-mono">
              共 {services.length} 个服务
            </div>

            <div className="flex gap-3">
              <AddServiceDialog />
              <RefreshButton />
            </div>
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
                <ServiceStatus
                  key={service.id}
                  service={service}
                  showActions
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminAuth>
  )
}
