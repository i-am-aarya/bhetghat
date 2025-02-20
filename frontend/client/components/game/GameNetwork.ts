import { EventEmitter } from "./EventEmitter";
import { WSMessage, WSMessageType } from "./packet";

export class GameNetwork extends EventEmitter {
  ws: WebSocket;
  constructor(url: string) {
    super();

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.emit("WSOPEN", "");
    };

    this.ws.onclose = () => {
      console.log("WS CLOSED");
    };

    this.ws.onerror = (error) => {
      console.log("WS ERROR:", error);
    };

    this.ws.onclose = () => {
      console.log("CONNECTION CLOSED");
    };

    this.ws.onmessage = (event: any) => {
      // console.log("MESSAGE RECEIVED: ", event.data);
      if (event.data === null || event.data.length === 0) {
        console.log("EMPTY MESSAGE RECEIVED");
      }
      try {
        const data = JSON.parse(event.data) as WSMessage;

        switch (data.t) {
          case WSMessageType.CHAT_MESSAGE:
            this.emit(WSMessageType.CHAT_MESSAGE, data.pl);
            break;

          case WSMessageType.COMM_REQUEST:
            this.emit(WSMessageType.COMM_REQUEST, data.pl);
            break;

          case WSMessageType.PLAYER_ENTER:
            this.emit(WSMessageType.PLAYER_ENTER, data.pl);
            break;

          case WSMessageType.PLAYER_LEAVE:
            this.emit(WSMessageType.PLAYER_LEAVE, data.pl);
            break;

          case WSMessageType.PLAYER_STATE:
            this.emit(WSMessageType.PLAYER_STATE, data.pl);
            break;

          default:
            console.log("unhandled message type: ", data.t);
        }
      } catch (error) {
        console.log("error processing WS message: ", error);
        console.log("received message was: ", event.data);
      }
    };
  }

  sendWSMessage(msg: WSMessage) {
    try {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
        console.log(`${msg.t} MESSAGE SENT BY ${msg.s}`);
      } else {
        console.log("websocket not open");
      }
    } catch (error) {
      console.log("error sending message from WS: ", error);
    }
  }

  closeConnection() {
    this.ws.close();
  }
}
