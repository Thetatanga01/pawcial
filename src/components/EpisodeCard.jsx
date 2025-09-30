import { useState } from 'react'
import VideoModal from './VideoModal.jsx'

export default function EpisodeCard({ episode }) {
  const [open, setOpen] = useState(false)

  function handleWatch() { setOpen(true) }

  return (
    <div className="video-card">
      <img src={episode.thumbnailUrl} alt={`${episode.no}. bölüm görseli`} />
      <span className="chip">Bölüm {episode.no} • {episode.duration}</span>
      <h3>{episode.title}</h3>
      <div className="episode-actions">
        <button className="btn btn-primary" onClick={handleWatch}>İzle</button>
      </div>
      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        src={episode.videoUrl || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'}
        title={episode.title}
      />
    </div>
  )
}


