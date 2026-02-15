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
  const { id } = useParams()
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
    if (!message.trim()) {
      return;
    }
    socket.current.emit("send-msg", { text: message, fromUserId: loggedUserId, toUserId: id })
    setMessage("")

  };




  /* ---------------- SOCKET CONNECTION ---------------- */
  useEffect(() => {
    socket.current = io("http://localhost:8080")
    socket.current.emit("join-room", { senderId: loggedUserId, recieverId: id })
    socket.current.on("recieve-msg", ({ text, fromUserId, toUserId, createdAt }) => {
      // console.log(text);
      setMessages(prev => [...prev, { text, sender: (fromUserId == loggedUserId ? "me" : "you"), createdAt }])
    })
  }, []);


  useEffect(() => {
    axios.get(DOMAIN + `/chat/${id}`, { withCredentials: true })
      .then((res) => {
        setChatUser(res.data.data)
        let temp = res.data.prevMsgs.map((item) => {
          return {
            text: item.text,
            sender: item.fromUserId == loggedUserId ? "me" : "you",
            createdAt: item.createdAt
          }
        })

        setMessages(temp)
      })
  }, [])


  return (
    <div
      className={
        "fixed right-0 flex flex-col bg-[#f5f7fb] transition-all duration-300 top-[10vh] " +
        (showSidebar ? "w-full md:w-[80vw]" : "w-full md:w-[95vw]") +
        " h-[calc(90vh-5rem)] md:h-[90vh]"
      }
    >
      {/* ================= CHAT HEADER ================= */}
      {chatUser && <div className="h-[65px] md:h-[75px] bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src={chatUser.profilePicture || "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"}
            alt="profile"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm md:text-[15px]">
              {chatUser.firstName + " " + chatUser.lastName}
            </span>
            <span className="text-xs text-green-500">
              @{chatUser.username}
            </span>
          </div>
        </div>
      </div>}

      {/* ================= CHAT MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-4 md:py-8 space-y-4 md:space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.sender === "me"
                ? "ml-auto justify-end"
                : "justify-start"
              }`}
          >
            {/* WRAPPER */}
            <div className="relative max-w-[80%] md:max-w-md">

              {/* MESSAGE BUBBLE */}
              <div
                className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-sm ${msg.sender === "me"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                  }`}
              >
                <p className="text-sm md:text-[15px] leading-relaxed break-words">
                  {msg.text}
                </p>
              </div>

              {/* TIME (SIDE ME) */}
              {msg.createdAt && (
                <span
                  className={`absolute text-[10px] md:text-[11px] whitespace-nowrap ${msg.sender === "me"
                      ? "right-0 -bottom-4 md:-bottom-5 text-gray-400"
                      : "left-0 -bottom-4 md:-bottom-5 text-gray-400"
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
      <div className="bg-white px-4 md:px-8 py-3 md:py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] shrink-0">
        <div className="flex items-center gap-2 md:gap-4 max-w-5xl mx-auto">
          <input
            ref={ipRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-[#f1f3f6] rounded-full px-4 md:px-5 py-2 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
