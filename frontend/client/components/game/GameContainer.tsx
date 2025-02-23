"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Game } from "./Game";
import { Player } from "./player/Player";
import { Camera } from "./Camera";
import LoadingScreen from "../loading-screen";
import { Progress } from "../ui/progress";
import { GameAssets, loadAssets } from "./assets";
import useAuth from "@/hooks/useAuth";
import { LocalPlayer } from "./player/LocalPlayer";
import ChatBox, { Message } from "../communication/chat-box";
import VideoCall from "../communication/video-call";
import {
  ChatPayload,
  CommUpdatePayload,
  EventNotifyPayload,
  EventSchedulePayload,
} from "./packet";
import { useMediaPermissions } from "@/hooks/useMediaPermissions";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { EventScheduler } from "../communication/event-scheduler";

const GameContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  const { user } = useAuth();
  const { requestMediaAccess } = useMediaPermissions();

  const [loaded, setLoaded] = useState(false);

  const totalAssets = 1;
  const loadedAssetsCount = useRef(0);
  const [progress, setProgress] = useState(0);

  const [assets, setAssets] = useState<GameAssets | null>(null);

  const gameRef = useRef<Game | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [roomID, setRoomID] = useState("");
  const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);

  useEffect(() => {
    requestMediaAccess(true, true);
    loadAssets()
      .then((loadedAssets) => {
        setAssets(loadedAssets);
        loadedAssetsCount.current++;
        setProgress((loadedAssetsCount.current / totalAssets) * 100);
      })
      .catch((error) => console.log("error loading assets: ", error));
  }, []);

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
        toast({
          title: payload.title,
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
    // useToast
    toast({
      title: payload.title,
      description: payload.description,
      action: <ToastAction altText="OKAY">OK</ToastAction>,
    });

    alert(
      `EVENT: ${payload.title}\n\n${payload.description}\n\n\n\nOrganizer: ${payload.creator}`,
    );
  };

  const WSURL = process.env.NEXT_PUBLIC_GAME_WS;
  useEffect(() => {
    console.log("loading...");

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.imageSmoothingEnabled = false;
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

    if (!WSURL) {
      alert("wsurl not found");
      return;
    }

    const initGame = async () => {
      try {
        Player.assets = assets;
        const characterSprite =
          localStorage.getItem("characterSpriteURL") ||
          "/assets/characters/character-male.png";

        const player = new LocalPlayer(
          // 2250,
          3000,
          2200,
          user.username,
          characterSprite,
        );
        const camera = new Camera(player, ctx.canvas.width, ctx.canvas.height);
        const game = new Game(
          player,
          ctx,
          camera,
          WSURL,
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
    <div>
      <canvas
        ref={canvasRef}
        className="-z-50"
        style={{
          imageRendering: "pixelated",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

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
