import { GetCollisionsMap } from "../collisions";
import {
  AnimationState,
  AnimationStateFromLastDirection,
  Direction,
  Player,
} from "./Player";

const TILE_SIZE = 32;

const TRIGGER_RADIUS = TILE_SIZE * 6;

export class LocalPlayer extends Player {
  lastNetworkUpdate: number = 0;
  collisionsMap: number[][];

  hitbox = { width: this.playerSize / 2, height: this.playerSize / 4 };

  constructor(x: number, y: number, name: string, spriteSrc: string) {
    super(x, y, name, spriteSrc);

    this.collisionsMap = GetCollisionsMap();
  }

  update(keys: Record<string, boolean>) {
    const now = performance.now();
    this.currentFrameIndex++;
    let moving = false;

    let dx = 0;
    let dy = 0;

    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
      dy -= 1;
      this.currentAnimationState = AnimationState.WALK_UP;
      this.lastDirection = Direction.UP;
      moving = true;
    }
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
      dy += 1;
      this.currentAnimationState = AnimationState.WALK_DOWN;
      this.lastDirection = Direction.DOWN;
      moving = true;
    }
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      dx -= 1;
      this.currentAnimationState = AnimationState.WALK_LEFT;
      this.lastDirection = Direction.LEFT;
      moving = true;
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      dx += 1;
      this.currentAnimationState = AnimationState.WALK_RIGHT;
      this.lastDirection = Direction.RIGHT;
      moving = true;
    }

    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / length) * this.speed;
      dy = (dy / length) * this.speed;
    } else {
      dx *= this.speed;
      dy *= this.speed;
    }

    const originalX = this.playerX;
    const originalY = this.playerY;

    const newX = originalX + Math.floor(dx);
    const newY = originalY + Math.floor(dy);

    if (this.canMoveTo(newX, originalY)) {
      this.playerX = newX;
    }

    // Then check Y axis
    if (this.canMoveTo(this.playerX, newY)) {
      this.playerY = newY;
    }

    if (!moving) {
      this.frameDelay = 32;
      this.currentAnimationState = this.lastDirection
        ? AnimationStateFromLastDirection[this.lastDirection]
        : AnimationState.IDLE;
    } else {
      this.frameDelay = 16;
    }

    if (this.currentFrameIndex > this.frameDelay) {
      this.animationFrame = (this.animationFrame + 1) % 2;
      this.currentFrameIndex = 0;
      // return true;
    }
    if (now - this.lastNetworkUpdate > Player.updateDuration) {
      this.lastNetworkUpdate = now;
      return true;
    }

    return false;
  }

  draw(c: CanvasRenderingContext2D) {
    super.draw(c, this.playerX, this.playerY);

    c.save();

    c.setTransform(1, 0, 0, 1, 0, 0);
    c.lineWidth = 3;
    c.font = "32px monospace";
    c.strokeText(
      `[ ${this.playerX}, ${this.playerY} ]`,
      c.canvas.width - 500,
      c.canvas.height - 50,
    );
    c.fillText(
      `[ ${this.playerX}, ${this.playerY} ]`,
      c.canvas.width - 500,
      c.canvas.height - 50,
    );

    c.restore();
  }

  canMoveTo(x: number, y: number): boolean {
    const hitboxX = x + (this.playerSize - this.hitbox.width) / 2;
    const hitboxY = y + (this.playerSize - this.hitbox.height);

    const left = Math.floor(hitboxX / TILE_SIZE);
    const right = Math.floor((hitboxX + this.hitbox.width - 1) / TILE_SIZE);
    const top = Math.floor(hitboxY / TILE_SIZE);
    const bottom = Math.floor((hitboxY + this.hitbox.height - 1) / TILE_SIZE);

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (
          row < 0 ||
          row >= this.collisionsMap.length ||
          col < 0 ||
          col >= this.collisionsMap[0].length
        ) {
          return false;
        }

        if (this.collisionsMap[row][col] !== 0) {
          return false;
        }
      }
    }
    return true;
  }
}
