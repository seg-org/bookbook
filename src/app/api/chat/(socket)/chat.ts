import { prisma } from "@/lib/prisma"; // Your Prisma instance
import { Server } from "socket.io";

let io: Server | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
      });

      socket.on("sendMessage", async ({ senderId, roomId, message }) => {
        // Save message to DB
        const chat = await prisma.chatMessage.create({
          data: { senderId, roomId, message },
        });

        // Broadcast message to room
        io?.to(roomId).emit("receiveMessage", chat);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return io;
}
