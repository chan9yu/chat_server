import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { AppService } from './app.service';
import { type Room, type User, globalData } from './common/data';

export type CreateRoomMessage = {
	identity: string;
};

export type JoinRoomMessage = {
	identity: string;
	roomId: string;
};

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger('web_socket');

	@WebSocketServer()
	server: Server;

	constructor(private readonly appService: AppService) {
		this.logger.log('constructor');
	}

	afterInit() {
		this.logger.log('init');
	}

	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`disconnected: ${socket.id}`);
		const user = globalData.connectedUsers.find(user => user.socketId === socket.id);

		if (user) {
			const room = globalData.rooms.find(room => room.id === user.roomId) as Room;
			room.connectedUsers = room.connectedUsers.filter(user => user.socketId !== socket.id);
			socket.leave(user.roomId);

			if (room.connectedUsers.length > 0) {
				socket.to(room.id).emit('user_disconnected', { socketId: socket.id });
				socket.to(room.id).emit('room_update', { connectedUsers: room.connectedUsers });
			} else {
				globalData.rooms = globalData.rooms.filter(r => r.id !== room.id);
			}
		}
	}

	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`connected: ${socket.id}`);
	}

	@SubscribeMessage('create_room')
	createRoom(@MessageBody() data: CreateRoomMessage, @ConnectedSocket() socket: Socket) {
		const { identity } = data;
		const roomId = uuidv4();

		const newUser: User = {
			id: uuidv4(),
			identity,
			roomId,
			socketId: socket.id
		};

		const newRoom: Room = {
			id: roomId,
			connectedUsers: [newUser]
		};

		globalData.connectedUsers = [...globalData.connectedUsers, newUser];
		globalData.rooms = [...globalData.rooms, newRoom];

		socket.join(roomId);
		socket.emit('room_id', { roomId });
		socket.emit('room_update', { connectedUsers: newRoom.connectedUsers });
	}

	@SubscribeMessage('join_room')
	joinRoom(@MessageBody() data: JoinRoomMessage, @ConnectedSocket() socket: Socket) {
		const { identity, roomId } = data;

		const newUser: User = {
			id: uuidv4(),
			identity,
			roomId,
			socketId: socket.id
		};

		const room = globalData.rooms.find(room => room.id === roomId) as Room;
		room.connectedUsers = [...room.connectedUsers, newUser];

		globalData.connectedUsers = [...globalData.connectedUsers, newUser];

		room.connectedUsers.forEach(user => {
			if (user.socketId !== socket.id) {
				this.server.to(user.socketId).emit('conn_prepare', { connUserSocketId: socket.id });
			}
		});

		socket.join(roomId);
		this.server.to(roomId).emit('room_update', { connectedUsers: room.connectedUsers });
	}
}
