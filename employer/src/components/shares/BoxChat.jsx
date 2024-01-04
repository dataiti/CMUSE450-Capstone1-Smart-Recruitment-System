import React, { useEffect, useRef, useState } from "react";
import { IconButtonCustom } from "../shares";
import { icons } from "../../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  messageSelect,
  setCurrentConversation,
} from "../../redux/features/slices/messageSlice";
import { socket } from "../../socket";
import { MediaMessage, ReplyMessage, TextMessage } from "../shares/TypeMessage";
import { Avatar, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const BoxChat = ({ setIsBoxChatOpen, setIsBoxChatBubble }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentConversation } = useSelector(messageSelect);

  const [inputMesssageValue, setInputMessageValue] = useState("");

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleUserGetMessage = (message) => {
      if (message.success)
        dispatch(setCurrentConversation({ data: message.message }));
    };

    socket?.on("new_message", handleUserGetMessage);

    return () => {
      socket?.off("new_message", handleUserGetMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    setInputMessageValue("");
    socket.emit("text_message", {
      sender: "employer",
      content: inputMesssageValue,
      employerId: currentConversation?.employerId?._id,
      userId: currentConversation?.userId?._id,
      type: "text",
      messageId: currentConversation?._id,
    });
  };

  return (
    <div className="fixed bottom-5 right-5 shadow-2xl h-[440px] w-[360px] z-40 rounded-xl overflow-hidden border border-gray-400">
      <div className="h-[60px] w-full p-2 bg-white border-b border-blue-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={currentConversation?.userId?.avatar}
            className="border-gray-500 p-1 h-12 w-12 bg-blue-gray-100"
          />
          <div className="flex flex-col">
            <Typography className="text-sm font-bold">
              {currentConversation?.userId?.firstName}{" "}
              {currentConversation?.userId?.lastName}
            </Typography>
            <Typography className="text-xs text-gray-600 italic">
              {currentConversation?.userId?.email}
            </Typography>
          </div>
        </div>
        <div className="flex items-center">
          <IconButtonCustom
            className="bg-transparent active:bg-gray-200 transition-all"
            onClick={() => {
              setIsBoxChatBubble(true);
              setIsBoxChatOpen(false);
            }}
          >
            <icons.IoRemove size={24} />
          </IconButtonCustom>
          <IconButtonCustom
            className="bg-transparent active:bg-gray-200 transition-all"
            onClick={() => navigate("/messenger")}
          >
            <icons.BsArrowsFullscreen size={16} />
          </IconButtonCustom>
          <IconButtonCustom
            className="bg-transparent active:bg-gray-200 transition-all"
            onClick={() => {
              setIsBoxChatOpen(false);
              setIsBoxChatBubble(false);
            }}
          >
            <icons.IoClose size={24} />
          </IconButtonCustom>
        </div>
      </div>
      <div
        className="h-[calc(440px-120px)] flex flex-col gap-1  w-full overflow-x-auto p-3 bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]"
        ref={scrollContainerRef}
      >
        {currentConversation?.messages?.map((el, index) => {
          switch (el.type) {
            case "img":
              return <MediaMessage el={el} key={index} />;
            case "reply":
              return <ReplyMessage el={el} key={index} />;
            default:
              return (
                <TextMessage
                  el={el}
                  user={currentConversation?.userId}
                  key={index}
                />
              );
          }
        })}
      </div>
      <div className="h-[60px] p-2 flex items-center gap-2 bg-white">
        <input
          className="outline-none border-none flex-1 bg-gray-200 rounded-md p-[10px] placeholder:text-gray-600 text-sm font-bold"
          placeholder="Nhập tin nhắn"
          value={inputMesssageValue}
          onChange={(e) => setInputMessageValue(e.target.value)}
        />
        <IconButtonCustom className="rounded-md" onClick={handleSendMessage}>
          <icons.IoSendSharp />
        </IconButtonCustom>
      </div>
    </div>
  );
};

export default BoxChat;
