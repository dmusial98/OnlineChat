export class Message {

    constructor(
        public id: number, 
        public userFromId: number,
        public userToId: number, 
        public content: string, 
        public sendTime: string, 
        //public updatedAt:string
        ) {
    }
}
