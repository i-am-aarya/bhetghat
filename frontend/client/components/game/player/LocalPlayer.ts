import {
  AnimationState,
  AnimationStateFromLastDirection,
  Direction,
  Player,
} from "./Player";

export class LocalPlayer extends Player {
  lastNetworkUpdate: number = 0;

  constructor(x: number, y: number, name: string, spriteSrc: string) {
    super(x, y, name, spriteSrc);
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

    this.playerX += Math.floor(dx);
    this.playerY += Math.floor(dy);

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
}
