"use client";
import { useEffect, useRef, useState } from "react";
import internal from "stream";
import { Character } from "./character-selector";

export interface SpriteAnimationProps {
  spriteSheet: string;
  frameWidth: number;
  frameHeight: number;
}

export default function SpriteAnimation({
  character,
}: {
  character: Character;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const SPRITE_WIDTH = 32;
    const SPRITE_HEIGHT = 32;
    const SCALE = 8;
    const DISPLAY_WIDTH = SPRITE_WIDTH * SCALE;
    const DISPLAY_HEIGHT = SPRITE_HEIGHT * SCALE;

    ctx.canvas.width = 400;
    ctx.canvas.height = 400;

    const centerX = (ctx.canvas.width - DISPLAY_WIDTH) / 2;
    const centerY = (ctx.canvas.height - DISPLAY_HEIGHT) / 2;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = character.url;
    img.onload = () => {
      ctx.drawImage(
        img,
        0,
        224,

        SPRITE_WIDTH,
        SPRITE_HEIGHT, // Source width, height
        centerX,
        centerY, // Destination X, Y (centered)
        DISPLAY_WIDTH,
        DISPLAY_HEIGHT, // Destination width, height (scaled)
      );
    };
  }, [character]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
