import "./index.css";
import { io } from 'socket.io-client'

const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')

if(!userName || !roomName){
    location.href = '/main/main.html'
}

const clientIo = io()

clientIo.on('join', (msg)=>{
    console.log("msg: >> ", msg)
})