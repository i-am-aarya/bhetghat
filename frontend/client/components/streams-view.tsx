import React, { useEffect, useRef } from 'react'

interface StreamsViewProps {
  streams: MediaStream[]
}

const StreamsView = ({ streams }: StreamsViewProps) => {
  return (
    <div>
      no videos?
      {streams.map((st, i) => (
        <VideoElement stream={st} key={i} />
      ))}
    </div>
  )
}

interface VideoElementProps {
  stream: MediaStream
}
const VideoElement = ({ stream }: VideoElementProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [])
  return <div>
    should have a video...
    <video ref={videoRef}></video>
  </div>
}

export default StreamsView