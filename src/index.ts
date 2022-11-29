import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { name } from "@/utils";
import UserService from "@/service/UserService";

const port = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

const userService = new UserService();

io.on("connection", (socket) => {
    socket.emit('userID', socket.id)

    socket.on(
        "join",
        ({ userName, roomName }: { userName: string; roomName: string }) => {
            const userData = userService.userDataInfoHandler(
                socket.id,
                userName,
                roomName
            );
            socket.join(userData.roomName)  //根據 user 的 roomName 把他們 join 到不同房間
            userService.addUser(userData);
            socket.broadcast.to(userData.roomName).emit("join", `${userName} 加入了 ${roomName}`)
            //使用 brocast() ，訊息只會發送到該房間的其他人看的到
        }
    );

    socket.on("chat", (msg) => {
        const userData = userService.getUser(socket.id)

        if(userData){
            //broadcast 是把訊息發送出去，只能給別人看到。所以如果要看到自己的訊息，就不能用。
            io.to(userData.roomName).emit('chat',{userData, msg})
        }
    });

    socket.on("disconnect", () => {
        const userData = userService.getUser(socket.id);
        const userName = userData?.userName;

        if (userName) {
            socket.broadcast.to(userData.roomName).emit("leave", `${userName} 離開聊天室`);
        }
        userService.removeUser(socket.id);
    });
});

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
    devServer(app);
} else {
    prodServer(app);
}

console.log("server side", name);

server.listen(port, () => {
    console.log(`The application is running on port ${port}.`);
});
