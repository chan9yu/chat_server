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

import { ConnectedUser, Room, meetData } from './meets.data';

export type CreateRoomMessage = {
	identity: string;
};

export type JoinRoomMessage = {
	identity: string;
	roomId: string;
};

enum SocketEvents {
	CONNECT = 'connect',
	CONNECTION_INIT = 'connection_init',
	CONNECTION_PREPARE = 'connection_prepare',
	CONNECTION_SIGNAL = 'connection_signal',
	CREATE_ROOM = 'create_room',
	JOIN_ROOM = 'join_room',
	ROOM_ID = 'room_id',
	ROOM_UPDATE = 'room_update',
	USER_DISCONNECTED = 'user_disconnected'
}

@WebSocketGateway({ cors: true })
export class MeetsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger('RoomsGateway');

	@WebSocketServer()
	server: Server;

	constructor() {
		this.logger.log('RoomsGateway create instance!!');
	}

	public afterInit() {
		this.logger.log('initialize RoomsGateway');
	}

	public handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`RoomsGateway connected: ${socket.id}`);
	}

	public handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`RoomsGateway disconnected: ${socket.id}`);
	}

	private createRoomId() {
		let newRoomId;

		return newRoomId;
	}

	@SubscribeMessage(SocketEvents.CREATE_ROOM)
	public createRoom(@MessageBody() data: CreateRoomMessage, @ConnectedSocket() socket: Socket) {
		const { identity } = data;
		const roomId = uuidv4();

		const newUser: ConnectedUser = {
			id: uuidv4(),
			identity,
			roomId,
			socketId: socket.id
		};

		const newRoom: Room = {
			id: roomId,
			connectedUsers: [newUser]
		};

		meetData.connectedUsers = [...meetData.connectedUsers, newUser];
		meetData.rooms = [...meetData.rooms, newRoom];

		socket.join(roomId);
		socket.emit(SocketEvents.ROOM_ID, { roomId });
		socket.emit(SocketEvents.ROOM_UPDATE, { connectedUsers: newRoom.connectedUsers });
	}

	public joinRoom(@MessageBody() data: JoinRoomMessage, @ConnectedSocket() socket: Socket) {
		const { identity, roomId } = data;

		const newUser: ConnectedUser = {
			id: uuidv4(),
			identity,
			roomId,
			socketId: socket.id
		};

		const room = meetData.rooms.find(room => room.id === roomId) as Room;
		room.connectedUsers = [...room.connectedUsers, newUser];

		meetData.connectedUsers = [...meetData.connectedUsers, newUser];

		room.connectedUsers.forEach(user => {
			if (user.socketId !== socket.id) {
				this.server.to(user.socketId).emit(SocketEvents.CONNECTION_PREPARE, { socketId: socket.id });
			}
		});

		socket.join(roomId);
		this.server.to(roomId).emit(SocketEvents.ROOM_UPDATE, { connectedUsers: room.connectedUsers });
	}
}
