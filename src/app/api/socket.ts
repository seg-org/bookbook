import { NextApiRequest, NextApiResponse } from "next";
import { initSocket } from "./chat/(socket)/chat";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socket = res.socket as any;
  if (!socket.server.io) {
    console.log("Initializing WebSocket server...");
    socket.server.io = initSocket(socket.server);
  }
  res.end();
}
