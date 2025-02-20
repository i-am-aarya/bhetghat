import { Camera } from "./Camera";
import { GameMap } from "./GameMap";
import { GameNetwork } from "./GameNetwork";
import { Player } from "./player/Player";
import { GameAssets } from "./assets";
import {
  PlayerEnterPayload,
  PlayerLeavePayload,
  PlayerStatePayload,
  WSMessage,
  WSMessageType,
} from "./packet";
import { LocalPlayer } from "./player/LocalPlayer";
import { RemotePlayer } from "./player/RemotePlayer";

export class Game {
  localPlayer: LocalPlayer;
  remotePlayers: Map<string, RemotePlayer>;

  ctx: CanvasRenderingContext2D;

  // keys currently being pressed
  keys: Record<string, boolean> = {};

  animationFrame: number = 0;

  gameMapImg: HTMLImageElement;

  camera: Camera;

  gameNetwork: GameNetwork;

  assets: GameAssets;

  constructor(
    localPlayer: LocalPlayer,
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    wsURL: string,
    assets: GameAssets,
  ) {
    this.assets = assets;

    this.remotePlayers = new Map<string, RemotePlayer>();

    this.ctx = ctx;
    this.localPlayer = localPlayer;
    this.setupInputListeners();

    this.gameMapImg = assets.mapImg;

    this.camera = camera;

    this.gameNetwork = new GameNetwork(wsURL);

    this.gameNetwork.on(
      WSMessageType.PLAYER_ENTER,
      (payload: PlayerEnterPayload) => {
        console.log("PLAYER ENTER PAYLOAD: ", payload);
        if (payload.s !== this.localPlayer.username) {
          this.addPlayer(payload);
        }
      },
    );

    this.gameNetwork.on(
      WSMessageType.PLAYER_LEAVE,
      (payload: PlayerLeavePayload) => {
        this.removePlayer(payload);
      },
    );

    this.gameNetwork.on(
      WSMessageType.PLAYER_STATE,
      (payload: PlayerStatePayload) => {
        this.handlePlayerState(payload);
      },
    );

    this.gameNetwork.on(WSMessageType.CHAT_MESSAGE, (payload: any) => {
      this.handleChatMessage(payload.message);
    });

    this.gameNetwork.on(WSMessageType.COMM_REQUEST, (payload: any) => {
      this.handleCommRequest(payload.request);
    });

    this.gameNetwork.on("WSOPEN", (payload: any) => {
      const playerEnterMsg: WSMessage = {
        t: WSMessageType.PLAYER_ENTER,
        s: this.localPlayer.username,
        pl: {
          s: this.localPlayer.username,
          img: this.localPlayer.spriteSrc,
          x: this.localPlayer.playerX,
          y: this.localPlayer.playerY,
          a: this.localPlayer.currentAnimationState,
          d: this.localPlayer.lastDirection,
        },
      };
      this.gameNetwork.sendWSMessage(playerEnterMsg);
    });
  }

  setupInputListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    window.addEventListener("beforeunload", () => {
      this.gameNetwork.sendWSMessage({
        t: WSMessageType.PLAYER_LEAVE,
        s: this.localPlayer.username,
        pl: null,
      });

      this.gameNetwork.closeConnection();
    });
  }

  addPlayer(payload: PlayerEnterPayload) {
    const newPlayer = new RemotePlayer(
      payload.x,
      payload.y,
      payload.s,
      payload.img,
    );
    if (!this.remotePlayers.has(newPlayer.username)) {
      this.remotePlayers.set(newPlayer.username, newPlayer);
      console.log("NEW PLAYER ADDED: ", newPlayer);
    }
  }

  removePlayer(payload: PlayerLeavePayload) {
    if (this.remotePlayers.has(payload.s)) {
      this.remotePlayers.delete(payload.s);
      console.log(`REMOVED PLAYER ${payload.s}`);
    }
  }

  handlePlayerState(payload: PlayerStatePayload) {
    this.remotePlayers
      .get(payload.s)
      ?.updateNetworkState(
        payload.x,
        payload.y,
        payload.a,
        payload.d,
        payload.f,
      );
  }

  handleChatMessage(message: string) {
    console.log("handling chat message: ", message);
  }

  handleCommRequest(req: string) {
    console.log("handling comm request: ", req);
  }

  update() {
    if (this.localPlayer.update(this.keys)) {
      const playerStateMsg: WSMessage = {
        t: WSMessageType.PLAYER_STATE,
        s: this.localPlayer.username,
        pl: {
          s: this.localPlayer.username,
          x: this.localPlayer.playerX,
          y: this.localPlayer.playerY,
          a: this.localPlayer.currentAnimationState,
          d: this.localPlayer.lastDirection,
          f: this.localPlayer.animationFrame,
        },
      };
      this.gameNetwork.sendWSMessage(playerStateMsg);
    }
    this.camera.update();
    this.remotePlayers.forEach((player) => player.update());
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.camera.update();
    this.camera.apply(this.ctx);

    this.ctx.drawImage(this.gameMapImg, 0, 0);

    // this.camera.zoomOut();
    this.remotePlayers.forEach((player) => player.draw(this.ctx));
    this.localPlayer.draw(this.ctx);
    // this.camera.zoomIn();
  }

  gameloop() {
    this.update();
    this.render();

    this.animationFrame = requestAnimationFrame(this.gameloop.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
  }
}
