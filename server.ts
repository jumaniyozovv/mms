import "dotenv/config";
import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { initializeSocketHandlers } from "@/backend/socket/handlers";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    cors: {
      origin: dev ? `http://localhost:${port}` : false,
      credentials: true,
    },
  });

  initializeSocketHandlers(io);

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> Socket.io listening on path /api/socket`);
  });
});
