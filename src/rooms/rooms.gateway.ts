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

import { roomData, type ConnectedUser, type Room } from '../common/data/room.data';

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

export type CreateRoomMessage = {
	identity: string;
};

export type JoinRoomMessage = {
	identity: string;
	roomId: string;
};

export type ConnectionSignalMessage = {
	signal: any;
	// signal: {
	// 	type: 'answer' | 'offer';
	// 	sdp: string;
	// };
	socketId: string;
};

export type ConnectionInitMessage = {
	socketId: string;
};

@WebSocketGateway({ cors: true })
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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

		// connectedUsers에서 socket 연결된 유저 있는지 확인
		const user = roomData.connectedUsers.find(user => user.socketId === socket.id);

		if (user) {
			// 해당 room에서 사용자 제거 및 socket leave 처리
			const room = roomData.rooms.find(room => room.id === user.roomId) as Room;
			room.connectedUsers = room.connectedUsers.filter(user => user.socketId !== socket.id);
			socket.leave(user.roomId);

			if (room.connectedUsers.length > 0) {
				socket.to(room.id).emit(SocketEvents.USER_DISCONNECTED, { socketId: socket.id });
				socket.to(room.id).emit(SocketEvents.ROOM_UPDATE, { connectedUsers: room.connectedUsers });
			} else {
				// 해당 room의 인원 수가 0인 경우 해당 room 삭제
				roomData.rooms = roomData.rooms.filter(r => r.id !== room.id);
			}
		}
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

		roomData.connectedUsers = [...roomData.connectedUsers, newUser];
		roomData.rooms = [...roomData.rooms, newRoom];

		socket.join(roomId);
		socket.emit(SocketEvents.ROOM_ID, { roomId });
		socket.emit(SocketEvents.ROOM_UPDATE, { connectedUsers: newRoom.connectedUsers });
	}

	@SubscribeMessage(SocketEvents.JOIN_ROOM)
	public joinRoom(@MessageBody() data: JoinRoomMessage, @ConnectedSocket() socket: Socket) {
		const { identity, roomId } = data;

		const newUser: ConnectedUser = {
			id: uuidv4(),
			identity,
			roomId,
			socketId: socket.id
		};

		// roomId에 해당하는 room에 새로운 user 추가
		const room = roomData.rooms.find(room => room.id === roomId) as Room;
		room.connectedUsers = [...room.connectedUsers, newUser];

		// connectedUsers에 새로운 user 추가
		roomData.connectedUsers = [...roomData.connectedUsers, newUser];

		// peer 연결을 준비하기 위해 이 room에 이미 있는 모든 user에게 emit
		room.connectedUsers.forEach(user => {
			if (user.socketId !== socket.id) {
				this.server.to(user.socketId).emit(SocketEvents.CONNECTION_PREPARE, { socketId: socket.id });
			}
		});

		socket.join(roomId);
		this.server.to(roomId).emit(SocketEvents.ROOM_UPDATE, { connectedUsers: room.connectedUsers });
	}

	@SubscribeMessage(SocketEvents.CONNECTION_SIGNAL)
	public connectionSignal(@MessageBody() data: ConnectionSignalMessage, @ConnectedSocket() socket: Socket) {
		const { signal, socketId } = data;
		this.server.to(socketId).emit(SocketEvents.CONNECTION_SIGNAL, { signal, socketId: socket.id });
	}

	@SubscribeMessage(SocketEvents.CONNECTION_INIT)
	public connectionInit(@MessageBody() data: ConnectionInitMessage, @ConnectedSocket() socket: Socket) {
		const { socketId } = data;
		this.server.to(socketId).emit(SocketEvents.CONNECTION_INIT, { socketId: socket.id });
	}
}
