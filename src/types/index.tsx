export interface Post {
    text: string;
    timePosted: number;
    uuid: string;
}

export interface Status {
    statusType: StatusType;
    lastHeartbeat?: number; //time that the server last received a heartbeat from the RaspberryPi
    timeSinceLastHeartbeat: string; //this formatted time is displayed with the status if the status is offline
}

export enum StatusType {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    UNKNOWN = 'UNKNOWN'
}

export enum StatusColor {
    ONLINE = 'green',
    OFFLINE = 'red',
    UNKNOWN = 'grey'
}