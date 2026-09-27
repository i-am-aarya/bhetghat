import type { Room } from "@/api/room";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/stores/mediaStore";
import { useRoomStore } from "@/stores/roomStore";
import {
  Camera,
  CameraOff,
  Copy,
  Headset,
  Mic,
  MicOff,
  UserIcon,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface MembersProps {
  room: Room;
  className?: string;
}
function Members({ room, className }: MembersProps) {
  return (
    <div
      className={`border-border border p-4 rounded-xl w-full mt-5 flex flex-col gap-4 ${className}`}
    >
      <div className="flex justify-between w-full text-primary">
        <p className="font-bold flex items-center gap-2 text-sm text-primary">
          <Users />
          <p className="text-primary font-mono">Members</p>
        </p>

        <p className="text-sm font-semibold">
          {room.memberCount} / {room.capacity}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-1 overflow-scroll max-h-40">
        {room.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 p-2 border border-border rounded-xl text-sm"
          >
            <div className="p-2 rounded-full border border-border">
              <UserIcon className="text-foreground/50" />
            </div>
            <p>{member.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoomPage() {
  const room = useRoomStore((s) => s.currentRoom);
  const getByCode = useRoomStore((s) => s.setCurrentRoomByCode);
  const { code } = useParams();

  const micOn = useMediaStore((s) => s.micOn);
  const toggleMic = useMediaStore((s) => s.toggleMic);

  const cameraOn = useMediaStore((s) => s.cameraOn);
  const toggleCamera = useMediaStore((s) => s.toggleCamera);

  const ensureStream = useMediaStore((s) => s.ensureStream);

  const localStream = useMediaStore((s) => s.localStream);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [micLevel, setMicLevel] = useState(0);

  useEffect(() => {
    if (!code) return;
    const fetchData = async () => {
      await getByCode(code);
    };

    ensureStream();
    fetchData();
  }, [code, getByCode, ensureStream]);

  useEffect(() => {
    if (!videoRef.current || !localStream) return;
    videoRef.current.srcObject = localStream;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    audioContext.createMediaStreamSource(localStream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    let rafId: number;
    const tick = () => {
      analyser.getByteFrequencyData(data);

      const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
      setMicLevel(Math.min(1, avg / 60));

      rafId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [localStream]);

  if (!room) {
    return <div className="w-full h-full pt-10">Loading...</div>;
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(room.roomCode);
  };

  return (
    <div className="w-full h-full pt-10 max-w-md mx-auto flex justify-center flex-col items-center">
      <p className="font-bold text-4xl">{room?.name}</p>

      <Button
        variant={"secondary"}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors my-5"
        onClick={handleCopyClick}
      >
        <p className="tracking-wider">{room.roomCode}</p>
        <Copy
          className="w-4 h-4 text-muted-foreground"
          strokeWidth={2}
          size={11}
        />
      </Button>

      <div className="border border-border rounded-xl p-5 w-full flex flex-col md:flex-col gap-2">
        <p className="text-sm font-mono text-primary font-bold flex gap-2">
          <Headset />
          Camera and mic
        </p>

        {localStream ? (
          <>
            <div className="bg-black/50 w-full aspect-video text-white">
              <video ref={videoRef} autoPlay playsInline muted></video>
            </div>

            <div className={`w-full h-1`}>
              <div
                className={`bg-primary shadow-sm h-1`}
                style={{
                  width: `${micLevel * 100}%`,
                }}
              ></div>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                variant={micOn ? "secondary" : "destructive"}
                onClick={toggleMic}
              >
                {micOn ? <Mic /> : <MicOff />} Mic
              </Button>
              <Button
                className="flex-1"
                variant={cameraOn ? "secondary" : "destructive"}
                onClick={toggleCamera}
              >
                {cameraOn ? <Camera /> : <CameraOff />} Camera
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant={"secondary"}
            onClick={() => {
              ensureStream();
            }}
          >
            Test!
          </Button>
        )}
      </div>

      <Members room={room} />

      {/*{room.ownerID == user?.id && (
        <Button variant={"outline"} className="mt-5 w-full h-10" asChild>
          <Link to={"/settings"}>
            <Settings2Icon /> Settings
          </Link>
        </Button>
      )}
*/}
      <Button className="w-full mt-5 h-10" asChild>
        <Link to={`/room/${room.roomCode}/play`}>Start Playing</Link>
      </Button>
    </div>
  );
}
