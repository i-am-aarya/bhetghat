import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import type { CommUpdatePayload } from "../game/packet";
export interface VideoCallProps {
  payload: CommUpdatePayload;
}
export default function VideoCall({ payload }: VideoCallProps) {
  return (
    <div className="absolute top-0 left-0 w-1/2 right-0 mx-auto mt-10 flex rounded-xl bg-black p-1">
      <LiveKitRoom
        data-lk-theme="default"

        serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
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
