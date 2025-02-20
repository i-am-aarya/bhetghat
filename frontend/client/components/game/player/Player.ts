import { GameAssets } from "../assets";

export enum Direction {
  UP = "up",
  DOWN = "dn",
  LEFT = "lf",
  RIGHT = "rt",
}

export enum AnimationState {
  IDLE = "i",
  IDLE_UP = "iu",
  IDLE_DOWN = "id",
  IDLE_LEFT = "il",
  IDLE_RIGHT = "ir",
  WALK_UP = "wu",
  WALK_DOWN = "wd",
  WALK_LEFT = "wl",
  WALK_RIGHT = "wr",
}

export type Animation = {
  row: number;
  frames: number;
};

export type Animations = {
  [key in AnimationState]: Animation;
};

export const AnimationStateFromLastDirection: {
  [key in Direction]: AnimationState;
} = {
  [Direction.UP]: AnimationState.IDLE_UP,
  [Direction.DOWN]: AnimationState.IDLE_DOWN,
  [Direction.LEFT]: AnimationState.IDLE_LEFT,
  [Direction.RIGHT]: AnimationState.IDLE_RIGHT,
};

export abstract class Player {
  username: string;
  playerX: number;
  playerY: number;
  speed: number = 5;

  lastDirection: Direction;
  currentAnimationState: AnimationState;

  animations: Animations;

  characterSprite: HTMLImageElement;

  spriteSize: number;
  playerSize: number;

  animationFrame: number;

  frameDelay: number;
  currentFrameIndex: number;

  urlToAssetMap: Map<string, HTMLImageElement>;

  spriteSrc: string;

  static assets: GameAssets;

  static updateDuration: number = 50;

  constructor(x: number, y: number, name: string, spriteSrc: string) {
    this.spriteSrc = spriteSrc;

    this.urlToAssetMap = new Map<string, HTMLImageElement>();
    this.urlToAssetMap.set(
      "/assets/characters/character-male.png",
      Player.assets.characterMaleSprite,
    );
    this.urlToAssetMap.set(
      "/assets/characters/character-female.png",
      Player.assets.characterFemaleSprite,
    );
    this.urlToAssetMap.set(
      "/assets/characters/character-male-2.png",
      Player.assets.characterMale2Sprite,
    );

    this.username = name;
    this.playerX = x;
    this.playerY = y;
    this.lastDirection = Direction.DOWN;
    this.currentAnimationState = AnimationState.IDLE;

    this.characterSprite =
      this.urlToAssetMap.get(this.spriteSrc) ||
      Player.assets.characterMaleSprite;

    this.spriteSize = 32;
    // this.playerSize = 92;
    this.playerSize = 64;

    this.animationFrame = 0;
    this.frameDelay = 8;
    this.currentFrameIndex = 0;

    this.animations = {
      [AnimationState.WALK_RIGHT]: { row: 0, frames: 2 },
      [AnimationState.WALK_LEFT]: { row: 1, frames: 2 },
      [AnimationState.IDLE_RIGHT]: { row: 2, frames: 2 },
      [AnimationState.WALK_DOWN]: { row: 3, frames: 2 },
      [AnimationState.WALK_UP]: { row: 4, frames: 2 },
      [AnimationState.IDLE_LEFT]: { row: 5, frames: 2 },
      [AnimationState.IDLE_UP]: { row: 6, frames: 2 },
      [AnimationState.IDLE_DOWN]: { row: 7, frames: 2 },
      [AnimationState.IDLE]: { row: 7, frames: 2 },
    };
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number) {
    const row =
      this.animations[this.currentAnimationState].row * this.spriteSize;

    const destX = x;
    const destY = y;

    // c.font = "16px Arial";
    c.font = "10px Arial";
    c.textAlign = "center";
    c.fillStyle = "white";
    c.strokeStyle = "black";
    c.lineWidth = 2;
    c.strokeText(
      this.username,
      destX + this.playerSize / 2,
      // destY - this.playerSize / 2,
      destY,
    );
    c.fillText(
      this.username,
      destX + this.playerSize / 2,
      // destY - this.playerSize / 2,
      destY,
    );

    c.drawImage(
      this.characterSprite, // source image
      this.animationFrame * this.spriteSize, // x coord in source image
      row, // y coord in source image
      this.spriteSize, // width in source image
      this.spriteSize, // height in source image
      destX, // x coord in destination canvas
      destY, // y coord in destination canvas
      this.playerSize, // width in destination canvas
      this.playerSize, // height in destination canvas
    );
  }

  abstract update(...args: any[]): void;
}
