import { AnimationState, Direction, Player } from "./Player";

export class RemotePlayer extends Player {
  targetX: number;
  targetY: number;

  lastUpdate: number;
  animationQueue: AnimationState[] = [];

  animationTimer: number = 0;
  lastAnimChange: number = 0;

  constructor(x: number, y: number, name: string, spriteSrc: string) {
    super(x, y, name, spriteSrc);
    this.targetX = x;
    this.targetY = y;
    this.lastUpdate = performance.now();
  }

  updateNetworkState(
    x: number,
    y: number,
    anim: AnimationState,
    dir: Direction,
    frame: number,
  ) {
    this.targetX = x;
    this.targetY = y;
    this.lastDirection = dir;
    this.currentAnimationState = anim;
    this.lastUpdate = performance.now();
    this.animationFrame = frame;
  }

  update() {
    const smoothT =
      (performance.now() - this.lastUpdate) / (Player.updateDuration * 2);

    this.playerX = Number(lerp(this.playerX, this.targetX, smoothT));
    this.playerY = Number(lerp(this.playerY, this.targetY, smoothT));
    // this.playerX = this.targetX;
    // this.playerY = this.targetY;

    // console.log(`
    //   now: ${now}
    //   deltaTime: ${deltaTime}
    //   smoothingFactor: ${smoothingFactor}
    //   playerX: ${this.playerX}
    //   targetX: ${this.targetX}
    //   playerY: ${this.playerY}
    //   targetY: ${this.targetY}
    //   `);
  }

  draw(c: CanvasRenderingContext2D): void {
    super.draw(c, this.playerX, this.playerY);
  }
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(t, 1);
}
