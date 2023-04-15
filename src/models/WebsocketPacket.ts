import WebsocketType from "./constant/WebsocketType";

class WebsocketPacket {
  type: WebsocketType;
  payload: any;

  constructor(type: WebsocketType, data: any = null) {
    this.type = type;
    this.payload = data;
  }
}

export default WebsocketPacket;
