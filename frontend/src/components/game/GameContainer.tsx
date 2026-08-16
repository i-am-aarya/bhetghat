import { useCallback, useEffect, useRef, useState } from "react";
import { Game } from "./Game";
import { Player } from "./player/Player";
import { Camera } from "./Camera";
import LoadingScreen from "../loading-screen";
import { Progress } from "../ui/progress";
import type { GameAssets } from "./assets";
import { loadAssets } from "./assets";
import { LocalPlayer } from "./player/LocalPlayer";
import ChatBox from "../communication/chat-box";
import type { Message } from "../communication/chat-box";

import type {
  ChatPayload,
  CommUpdatePayload,
  EventNotifyPayload,
  EventSchedulePayload,
} from "./packet";
import { ToastAction } from "../ui/toast";
import { EventScheduler } from "../communication/event-scheduler";
import VideoCall from "../communication/video-call";
import { useMediaPermissions } from "@/hooks/useMediaPermissions";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { getAccessToken } from "@/lib/api";
import { toast } from "sonner";

const GameContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const user = useAuthStore((s) => s.user);

  // const { requestMediaAccess } = useMediaPermissions();

  const [loaded, setLoaded] = useState(false);

  const totalAssets = 1;
  const loadedAssetsCount = useRef(0);
  const [progress, setProgress] = useState(0);

  const [assets, setAssets] = useState<GameAssets | null>(null);

  const gameRef = useRef<Game | null>(null);

  const cameraRef = useRef<Camera | null>(null)

  const [messages, setMessages] = useState<Message[]>([]);

  const [roomID, setRoomID] = useState("");
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);

  const roomCode = useRoomStore((s) => s.currentRoom?.roomCode)

  const GAME_WIDTH = 1280
  const GAME_HEIGHT = 700

  useEffect(() => {
    // requestMediaAccess(true, true);
    loadAssets()
      .then((loadedAssets) => {
        setAssets(loadedAssets);
        loadedAssetsCount.current++;
        setProgress((loadedAssetsCount.current / totalAssets) * 100);
      })
      .catch((error) => console.log("error loading assets: ", error));
  }, []);

  useEffect(() => {
    console.log("loaded: ", loaded)
  }, [loaded])


    useEffect(() => {
      console.log("progress: ", progress)
    }, [progress])

  const handleChatMessages = useCallback((payload: ChatPayload) => {
    setMessages((prev) => [
      ...prev,
      {
        content: payload.m,
        sender: payload.s,
      } as Message,
    ]);
  }, []);

  const handleCommUpdate = (payload: CommUpdatePayload) => {
    setRoomID(payload.roomHash);
    setNearbyUsers(payload.nearby);
  };

  const sendMessage = useCallback(
    (message: string) => {
      const newMessage: Message = {
        content: message,
        sender: user?.username || "",
      };

      setMessages((prev) => [...prev, newMessage]);

      gameRef.current?.sendChatMessage(message);
    },
    [user],
  );

  const sendEventScheduleMessage = useCallback(
    (payload: EventSchedulePayload) => {
      try {
        gameRef.current?.sendEventSchedule(payload);
        toast(
          payload.title, {
          description: payload.description,
          action: <ToastAction altText="OKAY">OKAY</ToastAction>,
        });
        alert("Event Scheduled!");
      } catch (error) {
        console.log("error sending event schedule", error);
      }
    },
    [],
  );

  const handleEventNotification = (payload: EventNotifyPayload) => {
    toast(
      payload.title,
      {
      description: `${payload.description} by ${payload.creator}`,
      action: <ToastAction altText="OKAY">OK</ToastAction>,
    });

  };

  const WSURL = import.meta.env.VITE_GAME_WS;

  useEffect(() => {

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;

      // resize
      const ratio = 16/9
      let w, h
      // const margin = 10

      const availableHeight = window.innerHeight
      const availableWidth = window.innerWidth

      if (availableWidth / availableHeight > ratio) {
        // wider than 16:9 -> update width to maintain 16:9 ratio with availableWidth
        w = availableHeight * ratio
        h = availableHeight
      } else {
        // taller than 16:9 -> update height to maintain 16:9 ratio with availableWidth
        w = availableWidth
        h = availableWidth * (1/ratio)
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.canvas.style.width = `${w}px`
      ctx.canvas.style.height = `${h}px`

      if (cameraRef.current) {
        cameraRef.current.setViewport(canvas.width, canvas.height)
      }

    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (!assets) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    if (!user) return;
    if (!WSURL) return;

    const wsUrl = new URL(WSURL)
    wsUrl.pathname = `/ws/${roomCode}`
    wsUrl.searchParams.set("token", getAccessToken() ?? "")

    const initGame = async () => {
      try {
        Player.assets = assets;
        const characterSprite =
          localStorage.getItem("characterSpriteURL") ||
          "/assets/characters/character-male.png";

        const player = new LocalPlayer(
          3000,
          2200,
          user.username,
          characterSprite,
        );
        const camera = new Camera(player, ctx.canvas.width, ctx.canvas.height);
        cameraRef.current = camera
        const game = new Game(
          player,
          ctx,
          camera,
          wsUrl.toString(),
          assets,
          handleChatMessages,
          handleCommUpdate,
          handleEventNotification,
        );
        gameRef.current = game;
        setLoaded(true);
        game.gameloop();

        return () => {
          game.stop();
        };
      } catch (err) {
        console.log("error initiating game: ", err);
      }
    };

    initGame();
  }, [assets, user]);

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex justify-center items-center">
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      </div>

      <ChatBox messages={messages} sendMessage={sendMessage} />
      <EventScheduler onSchedule={sendEventScheduleMessage} />

      <LoadingScreen isVisible={!loaded}>
        <div className="flex flex-col gap-4">
          <p className="text-6xl">LOADING</p>
          <Progress value={progress} />
        </div>
      </LoadingScreen>
      <VideoCall roomID={roomID} nearbyUsers={nearbyUsers} />
    </div>
  );
};

export default GameContainer;
