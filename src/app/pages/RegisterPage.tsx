import { useState } from 'react'
import { Activity } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface RegisterPageProps {
  onSwitchToLogin: () => void
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('请填写所有字段')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)
    const result = await signUp(email.trim(), password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('注册成功！如需邮箱验证，请检查收件箱确认。')
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(145deg, #f0fdf4 0%, #f8fafc 40%, #faf5ff 100%)',
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Activity size={22} className="text-white" />
            </div>
            <h1 className="text-slate-800" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
              PokaStudy
            </h1>
            <p className="text-slate-400 text-sm mt-1">时光有痕，不负朝夕</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-xl px-4 py-2.5">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位密码"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm text-white font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            已有账号？{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-emerald-600 font-medium hover:underline"
            >
              去登录
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
