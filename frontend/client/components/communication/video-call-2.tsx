import { useEffect, useRef, useState } from "react";
import { Game } from "../game/Game";
import { Client, LocalStream } from "ion-sdk-js";
import { SpatialAudioManager } from "@/lib/spatialAudio";
import { useMediaPermissions } from "@/hooks/useMediaPermissions";
import { useProximity } from "@/hooks/useProximity";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import CallControls from "./call-controls";
import StreamsView from "./streams-view";
import { Button } from "../ui/button";

interface VideoCall2Props {
  game: Game | null;
  localPlayerUsername: string;
}

export const VideoCall2 = ({ game, localplayerUsername }: VideoCall2Props) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const [participants, setParticipants] = useState<string[]>([]);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [mediaState, setMediaState] = useState({
    micActive: true,
    cameraActive: false,
    screenSharing: false,
    fallbackAudio: false,
  });

  const clientRef = useRef<Client | null>(null);
  const spatialAudioRef = useRef<SpatialAudioManager | null>(null);

  // const qualityMonitorRef

  const streamMapRef = useRef<Map<string, MediaStream>>(new Map());


  const {requestMediaAccess} = useMediaPermissions()

  const [qualityMap, setQualityMap] = useState<Map<string, number>>(new Map())


  useProximity(game, (nearbyPlayers) => {
    const nearbyUsernames, nearbyPlayers.map(p => p.username)
    const currentParticipants = [...participants, localplayerUsername]

    if(!arraysEqual(nearbyUsernames, participants) && !arraysEqual(nearbyUsernames, currentParticipants)) {
      if(nearbyUsernames.length>0){
        // handleProximity
        handleJoinProximityGroup(nearbyUsernames)
      } else {
        handleLeaveProximityGroup()
      }
    }
  })


  const initializeMedia = async () => {
    try {

      const {stream, audioAllowed} = await requestMediaAccess(true, false)

      if(!audioAllowed) {
        setMediaState(prev => ({...prev, fallbackAudio: true}))
        return null
      }

    } catch(error) {
      console.log("Media Initialization Failed", error)

      setMediaState(prev => ({...prev, fallbackAudio: true}))
      return null
    }
  }

  const handleJoinProximityGroup = async (usernames: string[]) => {

    if(activeRoom || !game || mediaState.fallbackAudio) return

    const sortedUsers = [...usernames, localplayerUsername].sort()

    const roomID = generateRoomID(sortedUsers)

    try {
      const mediaStream = await initializeMedia()
      if (!mediaStream) return


      const signal = new IonSFUJSONRPCSignal(
        process.env.NEXT_PUBLIC_SFU_SERVER_ADDRESS!
      )

      const client = new Client(signal, {
        iceServers: [
          {urls: "stun: stun.l.google.com:19302"},
        ],
        codec:"vp8",
      })

      client.ontrack = (track, stream) => {
        handleNewTrack(track, stream, sortedUsers)
      }

      signal.onopen = () => {
        client.join(roomID, localplayerUsername)
        client.publish(mediaStream)
        if(mediaState.screenSharing) {
          handleScreenShare()
        }
      }

      spatialAudioRef.current = new SpatialAudioManager()
      spatialAudioRef.current.updateListenerPosition(
        {x: game.localPlayer.playerX, y: game.localPlayer.playerY}
      )

      clientRef.current = client

      setActiveRoom(roomID)
      setParticipants(sortedUsers)
      game.gameNetwork.sendWSMessage({
        t: "comm",
        s: localplayerUsername,
        pl: {
          action: "join",
          roomID,
          members: sortedUsers
        }

      })

    } catch(error) {
      console.log("failed to join proximity group: ", error)
      setMediaState(prev => ({...prev, fallbackAudio: true}))
    }

  }

  const handleLeaveProximityGroup = async () => {
    if(!activeRoom) return

    game?.gameNetwork.sendWSMessage({
      t: "comm",
      s: localplayerUsername,
      pl: {
        action:"leave",
        roomID: activeRoom
      }
    })

    clientRef.current?.close()
    localStream?.getTracks().forEach(track => track.stop())
    screenStream?.getTracks().forEach(track => track.stop())

    spatialAudioRef.current = null


    setActiveRoom(null)
    setParticipants([])
    setRemoteStreams([])
    streamMapRef.current.clear()

  }

  const handleNewTrack = (track: MediaStreamTrack, stream: MediaStream, members: string[]) => {
    if(track.kind==='audio') {
      const username = stream.id.split("-")[0]
      const position = game?.remotePlayers.get(username)

      if(position && spatialAudioRef.current){
        spatialAudioRef.current.addStream(username, stream, {x: position.playerX, y: position.playerY})

        spatialAudioRef.current.updatePosition(username, {
          x: position.playerX,
          y: position.playerY
        })
      }

      streamMapRef.current.set(stream.id, stream)
      setRemoteStreams(Array.from(streamMapRef.current.values()))

    }
  }

  const toggleMicrophone = () => {
    if(!localStream) return
    const newState = !mediaState.micActive
    localStream.getAudioTracks().forEach(track => {
      track.enabled = newState
    })
    setMediaState(prev => ({...prev, micActive: newState}))
  }

  const toggleCamera = async () => {
    if(!clientRef.current || !localStream) return

    const newState = !mediaState.cameraActive
    try {

      const transport = clientRef.current.transports?.[0]
      if(!transport) {
        console.error("No WebRTC transport available");
              return;
      }

      const pc = transport.pc
      const videoSender = pc?.getSenders().find(s => s.track?.kind === 'video')

      if(newState) {

        const videoStream = await LocalStream.getUserMedia({
          video: true,
          audio: false,
          codec: "vp8",
          resolution:"fhd"
        })

        // const videoTrack = videoStream.getVideoTracks()[0]

        // if(videoSender){
        //   await videoSender.replaceTrack(videoTrack)
        // } else {
        //   clientRef.current.publish(videoTrack)
        // }
        if(videoSender){
          await videoSender.replaceTrack(videoStream.getVideoTracks()[0])
        } else {
          clientRef.current.publish(videoStream)
        }

        const mergedStream = new MediaStream([
          ...localStream.getTracks(),
          ...videoStream.getTracks()
        ])

        setLocalStream(mergedStream)


        const audioTrack = localStream?.getAudioTracks()[0]
        setLocalStream(new MediaStream(audioTrack ? [audioTrack] : []))

        setMediaState(prev => ({ ...prev, cameraActive: newState }));

      } else {
        localStream?.getVideoTracks().forEach((track) => {
          track.stop()
        })
      }
    } catch(error) {

    }
  }

  const handleScreenShare = async () => {
    if(!clientRef.current) return

    const newState = !mediaState.screenSharing

    try {
      if(newState) {
        const screenStream = await LocalStream.getDisplayMedia({
          video: true,
          audio: false,
          codec:"vp8",
          resolution:"fhd"
        })

        clientRef.current.publish(screenStream)
        setScreenStream(screenStream)
      } else {
        screenStream?.getTracks().forEach(track => {
          // clientRef.current?.unpublish(track)
          track.stop()
        })

        setScreenStream(null)
      }
      setMediaState(prev => ({...prev, screenSharing: newState}))
    } catch(error) {
      console.log("Screen share failed: ", error)
    }

  }

  const generateRoomID = (members: string[]) => members.sort().join("-") + "-" + Date.now().toString(36)

  const arraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((val, index) => val === b[index])

  useEffect(() => {
    return () => {
      clientRef.current?.close()
      localStream?.getTracks().forEach(track => track.stop())
      screenStream?.getTracks().forEach(track => track.stop())

      spatialAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    if(!game || !spatialAudioRef.current) return
    const updatePosition = (x: number, y: number) => {
      spatialAudioRef.current?.updateListenerPosition(x, y)

      participants.forEach(username => {
        const player = game.remotePlayers.get(username)
        if(player) {
          spatialAudioRef.current?.updatePosition(username, {x: player.playerX, y: player.playerY})
        }
      })
    }

    // game.localPlayer
    // return () => game.localPlayer.off

  }, [game, participants])


  return(

      <div className="fixed bottom-0 right-0 z-50">
            {/* Call Controls */}

            {/*


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



              */}

            <CallControls
              inACall={!!activeRoom}
              toggleMic={toggleMicrophone}
              toggleCamera={toggleCamera}
              toggleScreenSharing={handleScreenShare}
              endCall={handleLeaveProximityGroup}
              micOn={mediaState.micActive}
              cameraOn={mediaState.cameraActive}
              screenSharingOn={mediaState.screenSharing}
            />

            {/* Participant View */}
            {activeRoom && (
              <div className="fixed bottom-24 right-4 bg-black/80 p-4 rounded-lg backdrop-blur-sm shadow-xl">
                <div className="flex gap-4">
                  {/* Local Stream Preview */}
                  {mediaState.cameraActive && localStream && (
                    <div className="w-48 h-36 rounded-lg overflow-hidden border-2 border-primary">
                      <video
                        className="w-full h-full object-cover"
                        ref={ref => {
                          if (ref) ref.srcObject = localStream;
                        }}
                        autoPlay
                        muted
                      />
                    </div>
                  )}

                  {/* Remote Streams */}
                  <StreamsView
                    streams={remoteStreams}
                    // qualityMap={qualityMap}
                  />

                  {/* Moderation Controls */}
                  {/* <ModerationControls
                    isHost={participants[0] === localPlayerUsername}
                    participants={participants}
                    onMute={(user) => {
                      game?.gameNetwork.sendWSMessage({
                        t: "comm",
                        s: localPlayerUsername,
                        pl: {
                          action: "mute",
                          target: user,
                          roomId: activeRoom
                        }
                      });
                    }}
                    onKick={(user) => {
                      game?.gameNetwork.sendWSMessage({
                        t: "comm",
                        s: localPlayerUsername,
                        pl: {
                          action: "kick",
                          target: user,
                          roomId: activeRoom
                        }
                      });
                    }}
                  /> */}
                </div>
              </div>
            )}

            {/* Fallback Warning */}
            {mediaState.fallbackAudio && (
              <div className="fixed bottom-4 left-4 bg-destructive/90 text-white p-4 rounded-lg animate-pulse">
                <p>Microphone access required for voice chat!</p>
                <Button
                  variant="ghost"
                  className="mt-2 text-white"
                  onClick={() => window.location.reload()}
                >
                  Reload with Permissions
                </Button>
              </div>
            )}
          </div>


  )


};
