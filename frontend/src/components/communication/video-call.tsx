import { Client, LocalStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { useEffect, useRef, useState } from "react";
import StreamsView from "./streams-view";
import CallControls from "./call-controls";
// import useAuth from "@/hooks/useAuth";
import LocalStreamPreview from "./localstream-preview";
import useAuth from "@/hooks/useAuth";

interface VideoCallProps {
  roomID: string;
  nearbyUsers: string[];
}

const VideoCall = ({ roomID, nearbyUsers }: VideoCallProps) => {
  // just to shut the compiler up
  console.log("NEARBY USERS: ", nearbyUsers);
  const { user } = useAuth();

  const [micOn, setMicOn] = useState<boolean>(true);
  const [cameraOn, setCameraOn] = useState<boolean>(true);

  const [inACall, setInACall] = useState(false);

  const signalRef = useRef<IonSFUJSONRPCSignal | null>(null);
  const clientRef = useRef<Client | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const streamsRef = useRef(new Map());

  const signaling = import.meta.env.VITE_SFU_WS;

  const startCall = async (room: string) => {
    console.log("inside startCall");
    if (!signaling || !user) return;

    const signal = new IonSFUJSONRPCSignal(signaling);

    const client = new Client(signal, {
      codec: "vp8",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    signal.onopen = async () => {
      console.log("signaling server websocket connection established");
      console.log("awaiting client.join!");
      await client.join(room, user.username);
      console.log("joined room!");

      try {
        const initialStream = await LocalStream.getUserMedia({
          codec: "vp8",
          resolution: "fhd",
          audio: micOn,
          video: cameraOn,
        });
        client.publish(initialStream);
        setLocalStream(initialStream);
        console.log("call started!");

        setInACall(true);
      } catch (err) {
        console.error("could not set local stream:", err);
      }

      signalRef.current = signal;
      clientRef.current = client;
    };

    signal.onerror = (error) => {
      console.error("signaling websocket error: ", error);
    };

    client.ontrack = (track, stream) => {
      console.log("track received");
      if (!streamsRef.current.has(stream.id)) {
        streamsRef.current.set(stream.id, stream);
        console.log("new stream added!");
        setRemoteStreams((prev) => [...prev, stream]);
      }

      track.onended = () => {
        console.log("track ended: ", track.kind);
      };
    };
  };

  const endCall = () => {
    if (clientRef.current) {
      clientRef.current.close();
    }
    if (signalRef.current) {
      signalRef.current.close();
    }
    localStream?.getTracks().forEach((track) => track.stop());
    screenShareStream?.getTracks().forEach((track) => track.stop());
    setInACall(false);
    setLocalStream(null);
    setScreenShareStream(null);
    setRemoteStreams([]);
  };

  useEffect(() => {
    console.log("roomID changed: ", roomID);
    if (roomID.length == 0) {
      endCall();
    } else {
      startCall(roomID);
    }
  }, [roomID]);

  const toggleCamera = async () => {
    if (!localStream || !clientRef.current) return;

    const currentAudioTrack = localStream.getAudioTracks()[0];
    const videoTracks = localStream.getVideoTracks();
    console.log("NO. OF VIDEO TRACKS: ", videoTracks.length);
    if (videoTracks.length > 0) {
      videoTracks.forEach((track) => track.stop());
    }

    if (!cameraOn) {
      try {
        const newStream = await LocalStream.getUserMedia({
          codec: "vp8",
          resolution: "fhd",
          video: true,
          audio: false,
        });

        const newVideoTrack = newStream.getVideoTracks()[0];
        console.log("newVideoTrack: ", newVideoTrack);

        if (newVideoTrack) {
          const videoSender = clientRef.current.transports?.[0]?.pc
            .getSenders()
            ?.find((sender) => sender.track?.kind === "video");
          if (videoSender) {
            console.log("senders: ", videoSender);
            await videoSender.replaceTrack(newVideoTrack);
          }
        }

        const updatedStream = new MediaStream();
        if (currentAudioTrack) {
          updatedStream.addTrack(currentAudioTrack);
        }
        newVideoTrack.dispatchEvent(new Event("unmute"));
        updatedStream.addTrack(newVideoTrack);
        setLocalStream(updatedStream);
      } catch (err) {
        console.log("ERROR TOGGLING CAMERA: ", err);
        return;
      }
    }

    setCameraOn(!cameraOn);
  };

  const toggleMic = async () => {
    if (!localStream) {
      console.log("!localStream");
      return;
    }
    if (!clientRef.current) {
      console.log("!clientRef");
      return;
    }
    localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMicOn(!micOn);
  };

  useEffect(() => {
    console.log("remote streams count: ", remoteStreams.length);
  }, [remoteStreams]);

  useEffect(() => {
    console.log("IN A CALL: ", inACall);
  }, [inACall]);

  return (
    <div className="relative">
      {/*<TopBar
        startCall={startCall}
        username={user?.username || "N/A"}
        roomID={roomID}
        startPreview={startPreview}
      />*/}

      <div className="absolute top-56 left-1/2 -translate-x-1/2 flex justify-center">
        <StreamsView streams={remoteStreams} />
        {/*{remoteStreams.length > 0 && <StreamsView streams={remoteStreams} />}*/}
      </div>

      <div className="">
        <LocalStreamPreview
          cameraFeed={localStream}
          screenShare={screenShareStream}
        />
      </div>

      <CallControls
        cameraOn={cameraOn}
        micOn={micOn}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        endCall={endCall}
        inACall={inACall}
      />
    </div>
  );
};

export default VideoCall;
