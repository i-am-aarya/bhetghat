"use client";

import LocalStreamPreview from "@/components/localstream-preview";
import { Client, LocalStream } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import React, { useEffect, useRef, useState } from "react";
import StreamsView from "./streams-view";
import CallControls from "./call-controls";
import TopBar from "../top-bar";
import useAuth from "@/hooks/useAuth";

interface VideoCallProps {
  roomID: string;
  nearbyUsers: string[];
}

const VideoCall = ({ roomID, nearbyUsers }: VideoCallProps) => {
  const { user } = useAuth();

  const [micOn, setMicOn] = useState<boolean>(true);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [screenSharingOn, setScreenSharingOn] = useState(false);

  const [inACall, setInACall] = useState(false);

  const signalRef = useRef<IonSFUJSONRPCSignal | null>(null);
  const clientRef = useRef<Client | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const signaling = process.env.NEXT_PUBLIC_SFU_WS;
  // console.log("SIGNALING: ", signaling);

  const [showRemoteStreams, setShowRemoteStreams] = useState();

  useEffect(() => {
    if (roomID.length == 0) {
      endCall();
    } else {
      startCall();
    }
    console.log("endcall wala useEffect called");
  }, [roomID]);

  const startCall = async () => {
    if (!signaling) return;
    if (!user) return;

    const signal = new IonSFUJSONRPCSignal(signaling);
    signal.onopen = () => {
      alert("connected to signaling server");
    };
    const client = new Client(signal, {
      codec: "vp8",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    signal.onopen = () => {
      console.log("websocket connection established");
      client.join(roomID, user.username);
    };

    signal.onerror = (error) => {
      console.log("websocket error: ", error);
    };

    client.ontrack = (track, stream) => {
      console.log("TRACK RECEIVED: ", track);
      if (track.kind === "video") {
        setRemoteStreams((prev) => [...prev, stream]);
      }
    };

    try {
      const initialStream = await LocalStream.getUserMedia({
        codec: "vp8",
        resolution: "fhd",
        audio: micOn,
        video: cameraOn,
      });
      client.publish(initialStream);

      setLocalStream(initialStream);
    } catch (err) {
      console.log(err);
    }

    signalRef.current = signal;
    clientRef.current = client;

    setInACall(true);
  };

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
    if (!localStream || !clientRef.current) return;
    localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMicOn(!micOn);
  };

  const toggleScreenSharing = async () => {
    // toggle screen sharing
    setScreenSharingOn(!screenSharingOn);
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

  const startPreview = async () => {
    const initialStream = await LocalStream.getUserMedia({
      codec: "vp8",
      resolution: "fhd",
      audio: false,
      video: true,
    });
    setLocalStream(initialStream);
  };

  return (
    <div className="relative">
      <TopBar
        startCall={startCall}
        username={user?.username || "N/A"}
        roomID={roomID}
        startPreview={startPreview}
      />

      <div className="absolute top-56 left-1/2 -translate-x-1/2 flex justify-center">
        <StreamsView streams={remoteStreams} />
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
