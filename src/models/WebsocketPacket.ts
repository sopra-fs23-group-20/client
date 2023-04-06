import WebsocketType from './constant/WebsocketType';


class WebsocketPacket{
    type: WebsocketType | null;
    payload: any;

    constructor(type: WebsocketType | null = null, data: any = null){
        this.type = type;
        this.payload = data;
    }
}

export default WebsocketPacket;