import { Server as SocketServer } from 'socket.io';
import { type Server as HttpServer } from 'node:http';

export let io: SocketServer;

export const setupSockets = (server: HttpServer) => {
  io = new SocketServer(server);

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
};