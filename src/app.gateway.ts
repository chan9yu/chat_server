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
import { roomData, type ConnectedUser, type Room } from './common/data/room.data';

export type CreateRoomMessage = {
	identity: string;
};

export type JoinRoomMessage = {
	identity: string;
	roomId: string;
};

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger('AppGateway');

	@WebSocketServer()
	server: Server;

	constructor(private readonly appService: AppService) {
		this.logger.log('AppGateway create instance!!');
	}

	public afterInit() {
		this.logger.log('initialize AppGateway');
	}

	public handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`AppGateway connected: ${socket.id}`);
	}

	public handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`AppGateway disconnected: ${socket.id}`);

		// connectedUsers에서 socket 연결된 유저 있는지 확인
		const user = roomData.connectedUsers.find(user => user.socketId === socket.id);

		if (user) {
			// 해당 room에서 사용자 제거 및 socket leave 처리
			const room = roomData.rooms.find(room => room.id === user.roomId) as Room;
			room.connectedUsers = room.connectedUsers.filter(user => user.socketId !== socket.id);
			socket.leave(user.roomId);

			if (room.connectedUsers.length > 0) {
				socket.to(room.id).emit('user_disconnected', { socketId: socket.id });
				socket.to(room.id).emit('room_update', { connectedUsers: room.connectedUsers });
			} else {
				// 해당 room의 인원 수가 0인 경우 해당 room 삭제
				roomData.rooms = roomData.rooms.filter(r => r.id !== room.id);
			}
		}
	}

	@SubscribeMessage('create_room')
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
		socket.emit('room_id', { roomId });
		socket.emit('room_update', { connectedUsers: newRoom.connectedUsers });
	}

	@SubscribeMessage('join_room')
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
				this.server.to(user.socketId).emit('conn_prepare', { connUserSocketId: socket.id });
			}
		});

		socket.join(roomId);
		this.server.to(roomId).emit('room_update', { connectedUsers: room.connectedUsers });
	}
}
