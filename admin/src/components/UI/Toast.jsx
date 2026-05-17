// src/components/UI/Toast.jsx
import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [])

  const isSuccess = type === 'success'

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold animate-fade-in"
      style={{
        backgroundColor: isSuccess ? '#009929' : '#e53e3e',
        fontFamily: 'Raleway, sans-serif',
        minWidth: '260px',
      }}
    >
      {isSuccess
        ? <CheckCircle size={18} className="flex-shrink-0" />
        : <XCircle size={18} className="flex-shrink-0" />
      }
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast