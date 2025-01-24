"use client"

import CallControls from '@/components/call-controls'
import StreamsView from '@/components/streams-view'
import TopBar from '@/components/top-bar'
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl"
import React, { useEffect, useRef, useState } from 'react'

const VideoCall = () => {

  const [micOn, setMicOn] = useState<boolean>(true)
  const [cameraOn, setCameraOn] = useState<boolean>(true)
  const [screenSharingOn, setScreenSharingOn] = useState(false)

  const [streams, setStreams] = useState<MediaStream[]>([])

  const [username, setUsername] = useState("")
  const [roomName, setRoomname] = useState("")


  const signalRef = useRef<IonSFUJSONRPCSignal | null>(null)
  const clientRef = useRef<Client | null>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([])


  const toggleMic = () => {
    setMicOn(!micOn)
  }

  const toggleCamera = () => {
    setCameraOn(!cameraOn)
  }

  const toggleScreenSharing = () => {
    setScreenSharingOn(!screenSharingOn)
  }

  const startCall = async () => {
    if (!username || !roomName) {
      alert("username or roomname not set")
      return
    }

    const signaling = `wss://${process.env.SFU_SERVER_ADDRESS}/ws`
    const signal = new IonSFUJSONRPCSignal(`wss://192.168.101.11/ws`)
    signal.onopen = () => {
      alert("connected to signaling server")
    }
    // const signal = new IonSFUJSONRPCSignal(`wss://${process.env.SFU_SERVER_ADDRESS}/ws`)
    const client = new Client(signal, {
      codec: "vp8",
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // Public STUN server
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

      // two tracks are received everytime a user joins: audio & video
      if (track.kind === "video") {
        console.log("remote video track received")
        setRemoteStreams((prevStreams) => [...prevStreams, stream])
      }
    }

    // initial stream with audio enabled
    const initialStream = await LocalStream.getUserMedia({
      codec: "vp8",
      resolution: "fhd",
      audio: micOn,
      video: cameraOn,
      // simulcast: true,
    })
    client.publish(initialStream)

    setLocalStream(initialStream)

    signalRef.current = signal
    clientRef.current = client

  }

  const endCall = () => {

  }


  return (
    <div>
      <TopBar startCall={startCall} username={username} roomName={roomName} setUsername={setUsername} setRoomName={setRoomname} />
      {/* Username: {username}
      Roomname: {roomName} */}

      <StreamsView streams={streams} />

      <CallControls cameraOn={cameraOn} micOn={micOn} screenSharingOn={screenSharingOn} toggleMic={toggleMic} toggleCamera={toggleCamera} toggleScreenSharing={toggleScreenSharing} endCall={endCall} />
    </div>
  )
}

export default VideoCall