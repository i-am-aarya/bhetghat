import { Fullscreen, Maximize, Maximize2, Minimize2, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface StreamsViewProps {
  streams: MediaStream[];
}

const StreamsView = ({ streams }: StreamsViewProps) => {
  return (
    <div>
      {streams.length > 0 && (
        <div className={`my-2 bg-black bg-opacity-50 p-4 rounded-lg max-w-7xl`}>
          <div className="flex flex-wrap gap-4 justify-center">
            {streams.map((st, i) => (
              <VideoElement stream={st} key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface VideoElementProps {
  stream: MediaStream | null;
}
const VideoElement = ({ stream }: VideoElementProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [videoEnabled, setVideoEnabled] = useState(true);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [largeViewEnabled, setLargeViewEnabled] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }

    const videoTrack = stream?.getVideoTracks()[0];

    // videoTrack?.addEventListener("mute", () => {
    //   console.log("video muted")
    //   setVideoEnabled(false)
    // })

    // // this is where i want to listen to events
    // videoTrack?.addEventListener("unmute", () => {
    //   setVideoEnabled(true)
    // })

    if (stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume =
          dataArray.reduce((sum, value) => (sum = sum + value), 0) /
          dataArray.length;

        setIsSpeaking(volume > 20);
        requestAnimationFrame(checkVolume);
      };
      checkVolume();
    }

    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [stream]);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const toggleLargeView = () => {};

  return (
    <div className="flex w-72 h-40 justify-center items-center hover:cursor-pointer rounded-lg relative">
      <audio className="hidden" ref={audioRef} autoPlay></audio>

      <div
        className={`w-full h-full transition-all duration-500 rounded-lg ${isSpeaking ? "outline outline-4 outline-blue-300" : "outline-none"}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`rounded-lg bg-black w-full h-full object-cover`}
        ></video>

        <User size={100} />
      </div>

      <div className="w-full h-full rounded-lg absolute opacity-0 bg-opacity-0 hover:bg-opacity-40 hover:opacity-100 bg-black flex justify-center items-center gap-4 transition-all duration-200">
        <Button size={"icon"} onClick={toggleLargeView}>
          {largeViewEnabled ? <Minimize2 /> : <Maximize2 />}
        </Button>

        <Button size={"icon"} onClick={toggleFullscreen} className="text-white">
          <Maximize />
        </Button>
      </div>
    </div>
  );
};

export default StreamsView;
