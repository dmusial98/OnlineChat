import { formatDate } from "@angular/common";

export class Message {

    constructor(
        //public message_id: number, 
        //public message_from_user_id: number,
        public message_to_user_id: number, 
        public message_text: string, 
        public createdAt: string 
        //public updatedAt:string
        ) {
    }

    static getDate(createdAt: string ) {
        var date = Date.parse(createdAt)
        return formatDate(date,'dd-MM-yyyy: hh:mm','en-US');
    }
}