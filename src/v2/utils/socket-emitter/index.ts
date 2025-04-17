import { Server } from "socket.io";

let io: Server;
const clients: Map<string, string> = new Map();

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

    socket.on("register", (email: string, callback: (message: string) => void) => {
      if (clients.has(email)) {
        console.log(`User ${email} already has a registered socket connection.`);
      } else {
        clients.set(email, socket.id);
        console.log(`Registered user: ${email} with socket ID: ${socket.id}`);
      }
      callback("success");
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      clients.forEach((id, email) => {
        if (id === socket.id) {
          clients.delete(email);
          console.log(`User ${email} removed from socket client map.`);
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

    // If you need to perform some computational or any logic on the data before
    // sending it, you can use the transformData callback for that.    
    const payload = transformData ? transformData(data) : data;

    if (target !== 'all') {
      const socketId = clients.get(target);
      if (!socketId) {
        console.error(`Client ${target} is not connected`);
        return;
      }

      // Send the payload to the event the client will be listening on 
      io.to(socketId).emit(event, payload);
      console.log(`Event data ${event} sent to client ${target}:`, payload);
    } else {
      io.emit(event, payload);
      console.log(`Event data ${event} broadcast to all clients:`, payload);
    }
  },
};
