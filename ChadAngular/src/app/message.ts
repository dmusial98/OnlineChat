import { formatDate } from "@angular/common";

export class Message {

  id: number;
  userFromId: number;
  userToId: number;
  content: string;
  sendTime: string;
  updateTime: string;


    constructor(
        id: number, 
        //userFromId: number,
        //userToId: number, 
        content: string, 
        sendTime: string, 
        //updateTime: string
        ) {
    }

    static getDate(createdAt: string ) {
        var date = Date.parse(createdAt)
        return formatDate(date,'yyyy-MM-dd: hh:mm','en-US');
    }
}
