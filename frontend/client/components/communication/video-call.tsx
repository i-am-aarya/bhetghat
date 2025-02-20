"use client"

import CallControls from '@/components/call-controls'
import LocalStreamPreview from '@/components/localstream-preview';
import StreamsView from '@/components/streams-view'
import TopBar from '@/components/top-bar'
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl"
import React, { useEffect, useRef, useState } from 'react'

const VideoCall = () => {

  const [micOn, setMicOn] = useState<boolean>(true)
  const [cameraOn, setCameraOn] = useState<boolean>(true)
  const [screenSharingOn, setScreenSharingOn] = useState(false)

  const [username, setUsername] = useState("")
  const [roomName, setRoomname] = useState("")

  const [members, setMembers] = useState<Member[]>([])

  const [inACall, setInACall] = useState(false)

  const signalRef = useRef<IonSFUJSONRPCSignal | null>(null)
  const clientRef = useRef<Client | null>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([])

  // const signaling = `ws://${process.env.NEXT_PUBLIC_SFU_SERVER_ADDRESS}/ws`
  const signaling = process.env.NEXT_PUBLIC_SFU_SERVER_ADDRESS

  const startCall = async () => {
    if(!signaling) return
    if (!username || !roomName) {
      alert("username or roomname not set")
      return
    }

    console.log("signaling at: ", signaling)
    const signal = new IonSFUJSONRPCSignal(signaling)
    signal.onopen = () => {
      alert("connected to signaling server")
    }
    // const signal = new IonSFUJSONRPCSignal(`wss://${process.env.SFU_SERVER_ADDRESS}/ws`)
    const client = new Client(signal, {
      codec: "vp8",
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    })


    signal.onopen = () => {
      console.log("websocket connection established")
      client.join(roomName, username)
    }
    signal.onerror = (error) => {
      console.log("websocket error: ", error)
    }

    client.ontrack = (track, stream) => {
      console.log("TRACK RECEIVED: ", track)
      if (track.kind === "video") {
        setRemoteStreams((prev) => [...prev, stream]);
      }
    }

    try {
      const initialStream = await LocalStream.getUserMedia({
        codec: "vp8",
        resolution: "fhd",
        audio: micOn,
        video: cameraOn,
      })
      client.publish(initialStream)

      setLocalStream(initialStream)
    } catch (err) {
      console.error(err)
    }

    signalRef.current = signal
    clientRef.current = client


    setInACall(true)

  }

  const toggleCamera = async () => {

    if (!localStream || !clientRef.current) return

    const currentAudioTrack = localStream.getAudioTracks()[0]
    const videoTracks = localStream.getVideoTracks()
    console.log("NO. OF VIDEO TRACKS: ", videoTracks.length)
    if (videoTracks.length > 0) {
      videoTracks.forEach((track) => track.stop())
    }

    if (!cameraOn) {
      try {
        const newStream = await LocalStream.getUserMedia({
          codec: "vp8",
          resolution: "fhd",
          video: true,
          audio: false
        })

        const newVideoTrack = newStream.getVideoTracks()[0]
        console.log("newVideoTrack: ", newVideoTrack)

        if (newVideoTrack) {
          const videoSender = clientRef.current.transports?.[0]?.pc.getSenders()?.find((sender) => sender.track?.kind === 'video')
          if (videoSender) {
            console.log("senders: ", videoSender)
            await videoSender.replaceTrack(newVideoTrack)
          }
        }

        const updatedStream = new MediaStream()
        if (currentAudioTrack) {
          updatedStream.addTrack(currentAudioTrack)
        }
        newVideoTrack.dispatchEvent(new Event("unmute"))
        updatedStream.addTrack(newVideoTrack)
        setLocalStream(updatedStream);

      } catch (err) {
        console.error("ERROR TOGGLING CAMERA: ", err)
        return
      }
    }

    setCameraOn(!cameraOn)
  }

  const toggleMic = async () => {
    if (!localStream || !clientRef.current) return
    localStream.getAudioTracks().forEach((track) => track.enabled = !track.enabled)
    setMicOn(!micOn)
  }

  const toggleScreenSharing = () => {
    setScreenSharingOn(!screenSharingOn)
  }

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

  }

  const startPreview = async () => {
    const initialStream = await LocalStream.getUserMedia({
      codec: "vp8",
      resolution: "fhd",
      audio: false,
      video: true,
    })
    setLocalStream(initialStream)
  }


  return (
    <div>
      <TopBar startCall={startCall} username={username} roomName={roomName} setUsername={setUsername} setRoomName={setRoomname} startPreview={startPreview} />

      <div className='flex justify-center'>
        <StreamsView streams={remoteStreams} />
      </div>

      {
        <LocalStreamPreview cameraFeed={localStream} screenShare={screenShareStream} />
      }

      <CallControls cameraOn={cameraOn} micOn={micOn} screenSharingOn={screenSharingOn} toggleMic={toggleMic} toggleCamera={toggleCamera} toggleScreenSharing={toggleScreenSharing} endCall={endCall} inACall={inACall} />
    </div>
  )
}

export default VideoCall