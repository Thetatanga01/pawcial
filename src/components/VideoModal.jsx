import { useEffect, useRef, useState } from 'react'

export default function VideoModal({ open, onClose, src, title }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      setTimeout(() => videoRef.current?.focus(), 0)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title || 'Video'} ref={dialogRef} onClick={(e) => { if (e.target === dialogRef.current) onClose?.() }}>
      <div className="modal-content modal-full">
        <div className="modal-body">
          {!ready && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'rgba(0,0,0,.3)' }}>
              Yükleniyor...
            </div>
          )}
          <video
            ref={videoRef}
            src={src}
            controls
            onLoadedData={() => setReady(true)}
          />
        </div>
        <button className="modal-close absolute" aria-label="Kapat" onClick={onClose}>×</button>
      </div>
    </div>
  )
}


