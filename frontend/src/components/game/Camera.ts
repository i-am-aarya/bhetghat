import { LocalPlayer } from "./player/LocalPlayer";

export class Camera {
  cameraX: number;
  cameraY: number;
  targetPlayer: LocalPlayer;

  viewportWidth: number;
  viewportHeight: number;

  // scale: number = 1;
  scale: number = 2;

  constructor(targetPlayer: LocalPlayer, vw: number, vh: number) {
    this.targetPlayer = targetPlayer;
    this.cameraX = targetPlayer.playerX;
    this.cameraY = targetPlayer.playerY;
    this.viewportWidth = vw;
    this.viewportHeight = vh;
    this.update();
  }

  update() {
    this.cameraX =
      this.targetPlayer.playerX - this.viewportWidth / (2 * this.scale);

    this.cameraY =
      this.targetPlayer.playerY - this.viewportHeight / (2 * this.scale);
  }

  apply(c: CanvasRenderingContext2D) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.scale(this.scale, this.scale);
    c.translate(-this.cameraX, -this.cameraY);
  }

  zoomIn() {
    this.scale = 2;
  }

  zoomOut() {
    this.scale = 1;
  }
}
