import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import { Server } from 'socket.io'
import http from 'http'

import { name } from "@/utils";

const port = 3000;
const app = express();

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket)=>{
  socket.emit('join', "welcome")  //假設這裡將頻道名取為 join，對應到前端會有相同名字的頻道

  socket.on('chat', (msg)=>{
    console.log('server chat msg :>> ', msg);
    io.emit('chat', msg)
  })
})

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
