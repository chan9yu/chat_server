import { Injectable } from '@nestjs/common';
import { roomData } from '../common/data/room.data';

type RoomInfo = {
	exists: boolean;
	full?: boolean;
};

@Injectable()
export class RoomsService {
	public getRoomInfo(roomId: string) {
		let roomInfo: RoomInfo = { exists: false };
		const room = roomData.rooms.find(room => room.id === roomId);

		if (room) {
			const isFull = room.connectedUsers.length > 3;
			roomInfo = { exists: true, full: isFull };
		}

		return roomInfo;
	}
}
