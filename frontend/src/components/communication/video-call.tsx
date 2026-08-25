import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import type { CommUpdatePayload } from "../game/packet";
export interface VideoCallProps {
  payload: CommUpdatePayload;
}
export default function VideoCall({ payload }: VideoCallProps) {
  return (
    <div className="absolute top-0 left-0 w-1/2 flex bg-red-400">
      <LiveKitRoom
        serverUrl={`ws://localhost:7880`}
        token={payload.lkToken}
        connect={true}
        video={true}
        audio={true}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
