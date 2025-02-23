import React from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MonitorOff,
  MonitorUp,
  PhoneOff,
} from "lucide-react";
import { Button } from "../ui/button";

interface CallControlsProps {
  inACall: boolean;
  micOn: boolean;
  toggleMic: () => void;
  cameraOn: boolean;
  toggleCamera: () => void;
  screenSharingOn: boolean;
  toggleScreenSharing: () => void;

  endCall: () => void;

  className?: string;
}

const CallControls = ({
  className,
  inACall,
  micOn,
  cameraOn,
  screenSharingOn,
  toggleMic,
  toggleCamera,
  toggleScreenSharing,
  endCall,
}: CallControlsProps) => {
  return (
    inACall && (
      <div
        className={`fixed bottom-0 flex justify-center gap-8 bg-black bg-opacity-50 w-screen p-4 ${className}`}
      >
        {/* mic */}
        <Button
          onClick={toggleMic}
          size={"icon"}
          variant={micOn ? "secondary" : "ghost"}
          disabled={!inACall}
        >
          {micOn ? <Mic /> : <MicOff />}
        </Button>

        {/* camera */}
        <Button
          onClick={toggleCamera}
          size={"icon"}
          variant={cameraOn ? "secondary" : "ghost"}
          disabled={!inACall}
        >
          {cameraOn ? <Camera /> : <CameraOff />}
        </Button>

        {/* screen sharing */}
        <Button
          onClick={toggleScreenSharing}
          size={"icon"}
          variant={screenSharingOn ? "secondary" : "ghost"}
          title="Toggle Screen Share"
          disabled={!inACall}
        >
          {screenSharingOn ? <MonitorUp /> : <MonitorOff />}
        </Button>

        {/* end call */}
        <Button
          onClick={endCall}
          size={"icon"}
          // variant={micOn ? "secondary" : "ghost"}
          variant={"destructive"}
          disabled={!inACall}
        >
          <PhoneOff />
        </Button>
      </div>
    )
  );
};

export default CallControls;
