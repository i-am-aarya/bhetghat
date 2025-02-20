import { Camera, Monitor, MonitorUp } from "lucide-react"
import { useEffect, useRef } from "react"

interface LocalStreamPreviewProps {
  cameraFeed: MediaStream | null
  screenShare: MediaStream | null
}
export default function LocalStreamPreview({ cameraFeed, screenShare }: LocalStreamPreviewProps) {
  const cameraFeedVideoRef = useRef<HTMLVideoElement | null>(null)
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (cameraFeedVideoRef.current && cameraFeed) {
      cameraFeedVideoRef.current.srcObject = cameraFeed
    }

    if (screenShareVideoRef.current && screenShare) {
      screenShareVideoRef.current.srcObject = screenShare
    }
  }, [cameraFeed, screenShare])
  return (
    <div className="flex flex-col gap-2 absolute right-2 bottom-20 bg-black bg-opacity-50 p-2 rounded">
      <div>
        {
          screenShare &&
          <video className="w-56" ref={screenShareVideoRef} autoPlay muted></video>
        }
        {/* <MonitorUp /> */}
      </div>
      <div>

        {
          cameraFeed &&
          <video className="w-56" ref={cameraFeedVideoRef} autoPlay muted></video>
        }
        {/* <Camera /> */}
      </div>
    </div>
  )
}