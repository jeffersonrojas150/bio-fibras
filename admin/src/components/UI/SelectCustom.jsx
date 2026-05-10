import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

function SelectCustom({ value, onChange, options = [], placeholder = 'Seleccionar...', error }) {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      })
    }
  }, [open])

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const strValue = value !== null && value !== undefined ? String(value) : ''
  const selected = options.find(o => String(o.value) === strValue)

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl border outline-none transition-all"
        style={{
          borderColor: error ? '#f87171' : open ? '#b8860b' : '#e5e7eb',
          backgroundColor: 'white',
          color: selected ? '#3b2a00' : '#9ca3af',
          boxShadow: open ? '0 0 0 2px #f5d98a' : 'none',
        }}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={16}
          className="flex-shrink-0 ml-2 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#b8860b' }}
        />
      </button>

      {open && (
        <div
          style={{
            ...dropdownStyle,
            backgroundColor: 'white',
            border: '1px solid #d1b07a',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-sm transition-colors"
            style={{
              backgroundColor: '#b8860b',
              color: 'white',
              fontWeight: '600',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
          >
            {placeholder}
          </button>

          {options.map(opt => {
            const isSel = String(opt.value) === strValue
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{
                  backgroundColor: isSel ? '#f5e6cc' : 'white',
                  color: isSel ? '#7e4400' : '#374151',
                  fontWeight: isSel ? '600' : '400',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = isSel ? '#f5e6cc' : 'white'
                  e.currentTarget.style.color = isSel ? '#7e4400' : '#374151'
                }}
              >
                {opt.label}
              </button>
            )
          })}

          {options.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">Sin opciones disponibles</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SelectCustom