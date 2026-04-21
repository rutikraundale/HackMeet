import { Server } from "socket.io";
import http from "http";
import express from "express";
import { corsOptions } from "../middleware/cors.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    // Map the userId to the unique socket connection ID
    if (userId !== "undefined" && userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit list of all currently online users to everyone connected
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { app, io, server };
