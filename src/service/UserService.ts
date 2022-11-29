export type UserData = {
    id: string;
    userName: string;
    roomName: string;
};

export default class UserService {
    private userMap: Map<string, UserData>;

    constructor() {
        this.userMap = new Map();
    }

    addUser(data: UserData) {
        this.userMap.set(data.id, data);
    }

    removeUser(id: string) {
        if (this.userMap.has(id)) {
            this.userMap.delete(id);
        }
    }

    getUser(id: string) {
        const data = this.userMap.get(id);
        if (data) return data;

        //會讓這函式多一種undefined類型的輸出，所以可改寫如上
        // if(this.userMap.has(id)){
        //     return this.userMap.get(id)
        // }
        return null;
    }

    userDataInfoHandler(
        id: string,
        userName: string,
        roomName: string
    ): UserData {
        return {
            id,
            userName,
            roomName,
        };
    }
}
