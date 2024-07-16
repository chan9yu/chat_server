import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SignalingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger('SignalingGateway');
	@WebSocketServer() private server: Server;

	public afterInit() {
		this.logger.log('initialize SignalingGateway');
	}

	public handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`Client connected: ${socket.id}`);
	}

	public handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`Client disconnected: ${socket.id}`);
	}

	@SubscribeMessage('message')
	public handleMessage(client: Socket, payload: any) {
		this.logger.log(`Message received from client ${client.id}: ${JSON.stringify(payload)}`);
		this.server.emit('message', payload);
	}
}
