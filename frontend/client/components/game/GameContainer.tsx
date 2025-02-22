"use client";
import React, { useEffect, useRef, useState } from "react";
import { Game } from "./Game";
import { Player } from "./player/Player";
import { Camera } from "./Camera";
import LoadingScreen from "../loading-screen";
import { Progress } from "../ui/progress";
import { GameAssets, loadAssets } from "./assets";
import useAuth from "@/hooks/useAuth";
import { LocalPlayer } from "./player/LocalPlayer";
import ChatBox from "../communication/chat-box";
import VideoCall from "../communication/video-call";

const GameContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user } = useAuth();

  const [loaded, setLoaded] = useState(false);

  const totalAssets = 1;
  const loadedAssetsCount = useRef(0);
  const [progress, setProgress] = useState(0);

  const [assets, setAssets] = useState<GameAssets | null>(null);

  useEffect(() => {
    loadAssets()
      .then((loadedAssets) => {
        setAssets(loadedAssets);
        loadedAssetsCount.current++;
        setProgress((loadedAssetsCount.current / totalAssets) * 100);
      })
      .catch((error) => console.log("error loading assets: ", error));
  }, []);

  const WSURL = process.env.NEXT_PUBLIC_WS_URL;
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
    console.log("assets bhayo");
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("canvas bhayo");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    console.log("context bhayo");
    ctx.imageSmoothingEnabled = false;

    if (!WSURL) return;
    console.log("WSURL bhayo");
    if (!user) return;
    console.log("User Bhayo: ", user);

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
        const game = new Game(player, ctx, camera, WSURL, assets);
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

  const sendMessage = () => {};

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          imageRendering: "pixelated",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <ChatBox send={sendMessage} />

      <LoadingScreen isVisible={!loaded}>
        <div className="flex flex-col gap-4">
          <p className="text-6xl">LOADING</p>
          <Progress value={progress} />
        </div>
      </LoadingScreen>
      <VideoCall />
    </div>
  );
};

export default GameContainer;
