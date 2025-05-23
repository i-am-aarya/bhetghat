import { Camera } from "./Camera";
import { GameMap } from "./GameMap";
import { GameNetwork } from "./GameNetwork";
import { Player } from "./player/Player";
import { GameAssets } from "./assets";
import {
  ChatPayload,
  CommUpdatePayload,
  EventNotifyPayload,
  EventSchedulePayload,
  PlayerEnterPayload,
  PlayerLeavePayload,
  PlayerStatePayload,
  WSMessage,
  WSMessageType,
} from "./packet";
import { LocalPlayer } from "./player/LocalPlayer";
import { RemotePlayer } from "./player/RemotePlayer";
import { Boundary } from "./Boundary";
import { collisions, GetCollisionsMap } from "./collisions";
import { SpatialAudioManager } from "@/lib/spatialAudio";

export class Game {
  localPlayer: LocalPlayer;
  remotePlayers: Map<string, RemotePlayer>;

  ctx: CanvasRenderingContext2D;

  // keys currently being pressed
  keys: Record<string, boolean> = {};

  animationFrame: number = 0;

  gameMapImg: HTMLImageElement;
  gameMapForegroundImg: HTMLImageElement;

  camera: Camera;

  gameNetwork: GameNetwork;

  assets: GameAssets;

  // callback functions
  onChatMessage: (message: ChatPayload) => void;

  onCommUpdate: (commUpdate: CommUpdatePayload) => void;

  onEventNotification: (event: EventNotifyPayload) => void;

  constructor(
    localPlayer: LocalPlayer,
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    wsURL: string,
    assets: GameAssets,
    onChatMessage: (message: ChatPayload) => void,
    onCommUpdate: (commUpdate: CommUpdatePayload) => void,
    onEventNotification: (event: EventNotifyPayload) => void,
  ) {
    this.onChatMessage = onChatMessage;
    this.onCommUpdate = onCommUpdate;

    this.onEventNotification = onEventNotification;

    this.assets = assets;

    if (this.assets.backgroundMusic) {
      this.assets.backgroundMusic.loop = true;
      this.assets.backgroundMusic.volume = 0.1;
      this.assets.backgroundMusic
        .play()
        .catch((err) => console.log("music play failed", err));
    }

    this.remotePlayers = new Map<string, RemotePlayer>();

    this.ctx = ctx;
    this.localPlayer = localPlayer;
    this.setupInputListeners();

    this.gameMapImg = assets.mapImg;
    this.gameMapForegroundImg = assets.mapForegroundImg;

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

    this.gameNetwork.on(WSMessageType.CHAT_MESSAGE, (payload: ChatPayload) => {
      this.onChatMessage(payload);
    });

    this.gameNetwork.on(
      WSMessageType.COMM_UPDATE,
      (payload: CommUpdatePayload) => {
        this.onCommUpdate(payload);
      },
    );

    this.gameNetwork.on(WSMessageType.COMM_REQUEST, (payload: any) => {
      this.handleCommRequest(payload.request);
    });

    this.gameNetwork.on(
      WSMessageType.EVENT_NOTIFY,
      (payload: EventNotifyPayload) => {
        this.onEventNotification(payload);
      },
    );

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

  sendEventSchedule(payload: EventSchedulePayload) {
    const eventMsg: WSMessage = {
      t: WSMessageType.EVENT_SCHEDULE,
      s: this.localPlayer.username,
      pl: payload,
    };
    this.gameNetwork.sendWSMessage(eventMsg);
  }

  sendChatMessage(message: string) {
    const chatMsg: WSMessage = {
      t: WSMessageType.CHAT_MESSAGE,
      s: this.localPlayer.username,
      pl: {
        m: message,
        s: this.localPlayer.username,
      },
    };

    this.gameNetwork.sendWSMessage(chatMsg);
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
    this.remotePlayers.forEach((player) => {
      player.update();
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.camera.update();
    this.camera.apply(this.ctx);

    this.ctx.drawImage(this.gameMapImg, 0, 0);
    this.remotePlayers.forEach((player) => player.draw(this.ctx));
    this.localPlayer.draw(this.ctx);
    this.ctx.drawImage(this.gameMapForegroundImg, 0, 0);
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
