import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    this.messagesWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log({ clientId: client.id, payload });

    // ! Emit to client who send message
    // client.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no-message :/',
    // });

    // ! Emit to everybody exept who send message
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no-message :/',
    // });

    // ! Emit to everyone
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message :/',
    });
  }
}
