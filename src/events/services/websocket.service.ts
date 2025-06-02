import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService {
  public server: Server; // Will hold the WebSocket server instance

  // Call this method from EventsGateway to set the server
  setServer(server: Server) {
    this.server = server;
  }

  // Emit to a specific client
  emitToClient(clientId: string, event: string, data: any) {
    if (!this.server) throw new Error('WebSocket server not initialized');
    this.server.to(clientId).emit(event, data);
  }

  // Broadcast to all clients
  broadcast(event: string, data: any) {
    if (!this.server) throw new Error('WebSocket server not initialized');
    this.server.emit(event, data);
  }
}