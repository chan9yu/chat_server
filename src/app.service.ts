import { Injectable } from '@nestjs/common';
import { type Room, globalData } from './common/data';

type RoomInfo = {
	exists: boolean;
	full?: boolean;
};

@Injectable()
export class AppService {
	private findRoomById(roomId: string) {
		return globalData.rooms.find(room => room.id === roomId);
	}

	private isRoomFull(room: Room) {
		return room.connectedUsers.length > 3;
	}

	public getHello(): string {
		return `Hello, we're WebRTC Advanced server`;
	}

	public getRoomInfo(roomId: string) {
		let roomInfo: RoomInfo = { exists: false };
		const room = this.findRoomById(roomId);

		if (room) {
			const isFull = this.isRoomFull(room);
			roomInfo = { exists: true, full: isFull };
		}

		return roomInfo;
	}
}
