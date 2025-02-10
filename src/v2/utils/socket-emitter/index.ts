import { Server } from "socket.io";

let io: Server;
const clients: Map<string, string> = new Map();

type SocketEventData = string | boolean | Array<any>;

export const initializeSocket = (server: any): Server => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://s4yt.org"
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("register", (clientId: string) => {
      if (clients.has(clientId)) {
        console.log(`Client ${clientId} is already registered.`);
      } else {
        clients.set(clientId, socket.id);
        console.log(`Registered client: ${clientId} with socket ID: ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      clients.forEach((id, clientId) => {
        if (id === socket.id) {
          clients.delete(clientId);
          console.log(`Client ${clientId} removed from map`);
        }
      });
    });
  });

  return io;
};

export const socketEmit = {
  send: (
    { target, event, data, transformData }: { 
      target: string, 
      event: string, 
      data: string | boolean | Array<any> | Object, 
      transformData?: (data: string | boolean | Array<any> | Object) => string | boolean | Array<any> | Object
    }
  ): void => {
    if (!io) {
      throw new Error("Socket.io is not initialized. Call initializeSocket first.");
    }

    const socketId = clients.get(target);
    console.log(socketId);
    if (!socketId) {
      console.error(`Client ${target} is not connected`);
      return;
    }

    // If you need to perform some computational or any logic on the data before
    // sending it, you can use the transformData callback for that.    
     const payload = transformData ? transformData(data) : data;

    // Send the payload to the event the client will be listening on 
    io.to(socketId).emit(event, payload);
    console.log(`Data sent to client ${target}:`, payload);
  },
};
