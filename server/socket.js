// // socket.js
// import { Server } from "socket.io";

// export let io; // initialized later with initSocket
// export const userSocketMap = {};

// // Initialization function
// export const initSocket = (server) => {
//   io = new Server(server, { cors: { origin: "*" } });

//   io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;
//     console.log("User connected:", userId);

//     if (userId) userSocketMap[userId] = socket.id;

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", userId);
//       delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
//   });

//   return io;
// };

