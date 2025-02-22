export class Boundary {
  static width: number = 32;
  static height: number = 32;
  x: number;

  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(c: CanvasRenderingContext2D) {
    // c.restore();
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, Boundary.width, Boundary.height);
  }
}
