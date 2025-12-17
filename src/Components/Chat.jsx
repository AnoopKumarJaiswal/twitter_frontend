import React, { useEffect, useRef, useState } from "react";
import { useUtilContext } from "../utils/UtilContext";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMAIN from "../constants";
import { useSelector } from "react-redux";


const formatToIST12Hour = (createdAt) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};




const Chat = () => {
  const bottomRef = useRef(null);
  const socket = useRef(null);
  const { showSidebar } = useUtilContext();
  const {id} = useParams()
  const ipRef = useRef()
  

  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const loggedUserId = useSelector(store => store.user.data._id)

  useEffect(() => {
    ipRef.current.focus()
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


    /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!message.trim())
      {
        return;
      } 
   socket.current.emit("send-msg" , {text : message ,fromUserId : loggedUserId , toUserId : id})
   setMessage("")

  };
  



  /* ---------------- SOCKET CONNECTION ---------------- */
  useEffect(() => {
    socket.current = io("http://localhost:8080")
    socket.current.emit("join-room", {senderId : loggedUserId , recieverId : id})
    socket.current.on("recieve-msg" , ({text , fromUserId, toUserId , createdAt}) =>{
      // console.log(text);
      setMessages(prev => [...prev ,{text, sender : ( fromUserId == loggedUserId ? "me" : "you"), createdAt}])
    })
  }, []);


  useEffect(() =>{
    axios.get(DOMAIN + `/chat/${id}` , {withCredentials : true})
    .then((res)=>  {
       setChatUser(res.data.data) 
       let temp = res.data.prevMsgs.map((item) =>{
        return {
          text : item.text,
          sender : item.fromUserId == loggedUserId ? "me" : "you",
          createdAt : item.createdAt
        }
       })  
       
       setMessages(temp)
    })
  },[])


  return (
    <div
      className={
        "h-[90vh] fixed right-0 flex flex-col bg-[#f5f7fb] " +
        (showSidebar ? "w-[80vw]" : "w-[95vw]")
      }
    >
      {/* ================= CHAT HEADER ================= */}
      { chatUser && <div className="h-[75px] bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img
            src={chatUser.profilePicture || "data:image/jpeg;base64,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"}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-[15px]">
              {chatUser.firstName + " " + chatUser.lastName}
            </span>
            <span className="text-xs text-green-500">
              @{chatUser.username}
            </span>
          </div>
        </div>

        {/* <div className="flex items-center gap-6 text-gray-500 text-lg">
          <i className="fa-solid fa-phone cursor-pointer"></i>
          <i className="fa-solid fa-video cursor-pointer"></i>
          <i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i>
        </div> */}
      </div>}

      {/* ================= CHAT MESSAGES ================= */}
<div className="flex-1 overflow-y-auto px-12 py-8 space-y-6">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex max-w-4xl ${
        msg.sender === "me"
          ? "ml-auto justify-end"
          : "justify-start"
      }`}
    >
      {/* WRAPPER */}
      <div className="relative">

        {/* MESSAGE BUBBLE */}
        <div
          className={`px-5 py-3 rounded-2xl shadow-sm max-w-sm ${
            msg.sender === "me"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          <p className="text-[15px] leading-relaxed">
            {msg.text}
          </p>
        </div>

        {/* TIME (SIDE ME) */}
        {msg.createdAt && (
          <span
            className={`absolute text-[11px] whitespace-nowrap ${
              msg.sender === "me"
                ? "right-0 -bottom-5 text-gray-400"
                : "left-0 -bottom-5 text-gray-400"
            }`}
          >
            {formatToIST12Hour(msg.createdAt)}
          </span>
        )}
      </div>
    </div>
  ))}
  <div ref={bottomRef} />
</div>


      {/* ================= INPUT AREA ================= */}
      <div className="bg-white px-8 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <input
            ref={ipRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-[#f1f3f6] rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
