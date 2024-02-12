import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger('Rooms');

	constructor() {
		this.logger.log('constructor');
	}

	afterInit() {
		this.logger.log('init');
	}

	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
	}

	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
	}

	@SubscribeMessage('join_room')
	joinRoom(@MessageBody() roomName: string, @ConnectedSocket() socket: Socket) {
		socket.join(roomName);
		socket.to(roomName).emit('welcome');
	}

	@SubscribeMessage('offer')
	offer(@MessageBody() message: string[], @ConnectedSocket() socket: Socket) {
		const [offer, roomName] = message;
		socket.to(roomName).emit('offer', offer);
	}

	@SubscribeMessage('answer')
	answer(@MessageBody() message: string[], @ConnectedSocket() socket: Socket) {
		const [answer, roomName] = message;
		socket.to(roomName).emit('answer', answer);
	}

	@SubscribeMessage('ice')
	ice(@MessageBody() message: string[], @ConnectedSocket() socket: Socket) {
		const [ice, roomName] = message;
		socket.to(roomName).emit('ice', ice);
	}
}
