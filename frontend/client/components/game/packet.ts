import { AnimationState, Direction } from "./player/Player";

export enum WSMessageType {
  PLAYER_ENTER = "penter",
  PLAYER_LEAVE = "pleave",
  PLAYER_STATE = "pstate",
  COMM_REQUEST = "comm",
  CHAT_MESSAGE = "chat",
}

export type WSMessage = {
  // type
  t: WSMessageType;
  // sender's username
  s: string;
  // payload
  pl:
    | PlayerEnterPayload
    | PlayerStatePayload
    | ChatPayload
    | PlayerLeavePayload
    | null;
};

export type PlayerEnterPayload = {
  // sender's username
  s: string;
  // character sprite image
  img: string;
  // x coord
  x: number;
  // y coord
  y: number;
  // initial animation state
  a: AnimationState;
  // initial direction
  d: Direction;
};

export type PlayerStatePayload = {
  // sender's username
  s: string;
  // x coord
  x: number;
  // y coord
  y: number;
  // animation
  a: AnimationState;
  // direction
  d: Direction;
  // current animation frame
  f: number;
};

export type ChatPayload = {
  // sender's username
  s: string;
  // message
  m: string;
};

// export type Payload = PlayerEnterPayload | PositionPayload | ChatPayload

export type PlayerLeavePayload = {
  // sender's username
  s: string;
};
