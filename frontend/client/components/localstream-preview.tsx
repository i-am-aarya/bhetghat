import { Camera, Monitor, MonitorUp } from "lucide-react";
import { useEffect, useRef } from "react";

interface LocalStreamPreviewProps {
  cameraFeed: MediaStream | null;
  screenShare: MediaStream | null;
}
export default function LocalStreamPreview({
  cameraFeed,
  screenShare,
}: LocalStreamPreviewProps) {
  const cameraFeedVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (cameraFeedVideoRef.current && cameraFeed) {
      cameraFeedVideoRef.current.srcObject = cameraFeed;
    }

    if (screenShareVideoRef.current && screenShare) {
      screenShareVideoRef.current.srcObject = screenShare;
    }
  }, [cameraFeed, screenShare]);
  return (
    <div className="bg-blue-200 right-5 bottom-20 fixed rounded">
      <div className="flex flex-col bg-black bg-opacity-50 rounded">
        <div>
          {screenShare && (
            <video
              className="w-56"
              ref={screenShareVideoRef}
              autoPlay
              muted
            ></video>
          )}
        </div>
        <div>
          {cameraFeed && (
            <video
              className="w-56"
              ref={cameraFeedVideoRef}
              autoPlay
              muted
            ></video>
          )}
        </div>
      </div>
    </div>
  );
}
