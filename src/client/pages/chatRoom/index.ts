import "./index.css";
import { io } from 'socket.io-client'

import { name } from "@/utils";

console.log("client side chatroom page", name);

const clientIo = io()

clientIo.on('join', (msg)=>{
    console.log("msg: >> ", msg)
})