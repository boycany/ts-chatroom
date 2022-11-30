import "./index.css";
import { io } from "socket.io-client";
import { UserData } from "@/service/UserService";

type UserMsg = { userData: UserData, msg: string, time: string }

const url = new URL(location.href);
const userName = url.searchParams.get("user_name");
const roomName = url.searchParams.get("room_name");

if (!userName || !roomName) {
    location.href = "/main/main.html";
}

const clientIo = io();

clientIo.emit("join", { userName, roomName });

const textInput = document.getElementById("textInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement;
const headerRoomName = document.getElementById(
    "headerRoomName"
) as HTMLParagraphElement;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement;

headerRoomName.innerText = roomName || " - "; //roomName 有可能是空值

let userID = ''

function msgHandler(data: UserMsg){
    const date = new Date(data.time)
    const time = `${date.getHours()}:${date.getMinutes()}`

    const divBox = document.createElement("div");
    divBox.classList.add("flex", "mb-4", "items-end");
    
    if(data.userData.id === userID){  //自己發的訊息
        divBox.classList.add("justify-end")
        divBox.innerHTML = `
        <p class="text-xs text-gray-700 mr-4">${time}</p>
        <div>
            <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
            <p
                class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
            >
                ${data.msg}
            </p>
        </div>
    `;
    }else{
        divBox.classList.add("justify-start")
        divBox.innerHTML = `
        <div class="flex justify-start mb-4 items-end">
            <div>
            <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
            <p
                class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
            >
            ${data.msg}
            </p>
            </div>

            <p class="text-xs text-gray-700 ml-4">${time}</p>
        </div>
        `
    }
   
    chatBoard.appendChild(divBox);
    textInput.value = "";

    //每次接收訊息，卷軸就會拉到最底
    chatBoard.scrollTop = chatBoard.scrollHeight;
}

function roomMsgHandler(msg: string) {
    `<div class="flex justify-center mb-4 items-center">
        <p class="text-gray-700 text-sm">bruce joined the room</p>
      </div>`;
    const divBox = document.createElement("div");
    divBox.classList.add("flex", "justify-center", "mb-4", "items-center");
    divBox.innerHTML = `
        <p class="text-gray-700 text-sm">${msg}</p>
    `;

    chatBoard.appendChild(divBox);
    chatBoard.scrollTop = chatBoard.scrollHeight;
}

// chatBoard.addEventListener('scroll', ()=>{
// console.log('chatBoard.scrollTop :>> ', chatBoard.scrollTop);
// console.log('chatBoard.scrollHeight :>> ', chatBoard.scrollHeight);
// })

submitBtn.addEventListener("click", () => {
    const textValue = textInput.value;
    clientIo.emit("chat", textValue);
});

textInput.addEventListener("keyup", (e)=>{
    if(e.key === "Enter"){
        submitBtn.click()
    }
   
})

backBtn.addEventListener("click", () => {
    location.href = "/main/main.html";
});

clientIo.on("join", (msg) => {
    roomMsgHandler(msg);
});

clientIo.on("chat", (data: UserMsg) => {
    msgHandler(data);
});

clientIo.on("leave", (msg) => {
    roomMsgHandler(msg);
});

clientIo.on('userID', (id) => {
    userID = id
})