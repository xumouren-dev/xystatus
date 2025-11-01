'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { verifyPassword } from '@/lib/actions'

export function AdminAuth({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const isValid = await verifyPassword(password)
      if (isValid) {
        sessionStorage.setItem('admin_auth', 'true')
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError('密码错误')
      }
    } catch (err) {
      setError('认证失败')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="border border-border bg-card/50 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-chart-3" />
            <h1 className="text-xl font-bold text-foreground font-mono">
              管理员登录
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="输入管理员密码"
              />
            </div>

            {error && (
              <div className="text-destructive text-sm font-mono">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? '验证中...' : '登录'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              返回首页
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/')
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      退出登录
    </Button>
  )
}
