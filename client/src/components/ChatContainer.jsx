



//.......................................
import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils.js';
import { ChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);
  const scrollEnd = useRef();
  const chatContainerRef = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
    scrollToBottomSmooth();
  };

  const handleSendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type?.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
      scrollToBottomSmooth();
    };
    reader.readAsDataURL(file);
  };

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  const userMessages = selectedUser ? messages[selectedUser._id] || [] : [];

  // Scroll functions
  const scrollToBottomInstant = () => {
    if (scrollEnd.current) scrollEnd.current.scrollIntoView({ behavior: 'auto' });
  };

  const scrollToBottomSmooth = () => {
    if (scrollEnd.current) scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages are rendered
  useEffect(() => {
    scrollToBottomInstant();
  }, [userMessages]);

  // Handle new incoming messages like WhatsApp
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId = newMessage.senderId;

      // Only scroll if the user is currently viewing the chat
      const container = chatContainerRef.current;
      const isAtBottom = container
        ? container.scrollHeight - container.scrollTop - container.clientHeight < 50
        : true;

      if (selectedUser && senderId === selectedUser._id) {
        if (isAtBottom) scrollToBottomSmooth();
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  return selectedUser ? (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500 sticky top-0 bg-gray-900 z-10'>
        <img
          src={assets.arrow_icon}
          alt="back"
          className='md:hidden max-w-7 cursor-pointer'
          onClick={() => setSelectedUser(null)}
        />
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 gap-2 text-lg flex items-center text-white'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500 ml-2'></span>}
        </p>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 min-h-0">
        {userMessages.length > 0 ? userMessages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id ? "flex-row-reverse" : ""}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"}`}>
                {msg.text}
              </p>
            )}
            <div>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        )) : <p className='text-center text-gray-400 mt-4'>No messages yet</p>}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input */}
      <div className='flex items-center gap-3 p-3 border-t border-stone-500 sticky bottom-0 bg-gray-900 z-10'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder='Send a message'
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input onChange={handleSendImage} type="file" id="image" accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;




