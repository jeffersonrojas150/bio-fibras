import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/logo.png'

function Login() {
  const [username, setUsername]       = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const { login }    = useAuth()
  const navigate     = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f5f0e8' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/*Logo*/}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Biofibras" className="h-16 w-auto mb-3" />
          <h1 className="text-2xl font-bold tracking-widest" style={{ color: '#2c5530' }}>
            BIOFIBRAS
          </h1>
          <p className="text-sm text-gray-500 mt-1">Panel Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/*Usuario*/}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full border-2 rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
              style={{ borderColor: '#e0e0e0' }}
              onFocus={e => e.target.style.borderColor = '#b8860b'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full border-2 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-colors"
                style={{ borderColor: '#e0e0e0' }}
                onFocus={e => e.target.style.borderColor = '#b8860b'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors"
            style={{ backgroundColor: loading ? '#ccc' : '#b8860b' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#92590a' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#b8860b' }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Biofibras — Solo para administradores
        </p>
      </div>
    </div>
  )
}

export default Login