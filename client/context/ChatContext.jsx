

import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // messages per user
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Fetch all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessage || {});
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch messages for a specific user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        const fetchedMessages = Array.isArray(data.messages) ? data.messages : [];

        // Mark all messages as seen locally
        setMessages((prev) => ({
          ...prev,
          [userId]: fetchedMessages.map((msg) => ({ ...msg, seen: true })),
        }));

        // Remove from unseen messages count locally
        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });

        // ❌ Removed backend axios.put to stop 404
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Send message to selected user
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);

      if (data.success && data.newMessage) {
        // Update local messages
        setMessages((prev) => ({
          ...prev,
          [selectedUser._id]: prev[selectedUser._id]
            ? [...prev[selectedUser._id], data.newMessage]
            : [data.newMessage],
        }));

        // Emit socket event
        if (socket) socket.emit("sendMessage", data.newMessage);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId = newMessage.senderId;

      // Add message to local state
      setMessages((prev) => {
        const userMessages = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [...userMessages, newMessage],
        };
      });

      // Update unseen count only if the user is not currently viewing the chat
      if (!selectedUser || senderId !== selectedUser._id) {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: prev[senderId] ? prev[senderId] + 1 : 1,
        }));
      } else {
        // Message is seen immediately locally
        setMessages((prev) => ({
          ...prev,
          [senderId]: prev[senderId]?.map((msg) =>
            msg._id === newMessage._id ? { ...msg, seen: true } : msg
          ),
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  // When selected user changes, fetch their messages
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setSelectedUser,
    setUnseenMessages,
    getMessages,
    sendMessage,
    getUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};


