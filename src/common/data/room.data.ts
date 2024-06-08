import { Logger } from '@nestjs/common';

export type ConnectedUser = {
	id: string;
	identity: string;
	roomId: string;
	socketId: string;
};

export type Room = {
	id: string;
	connectedUsers: ConnectedUser[];
};

class RoomData {
	private static instance: RoomData;

	private logger = new Logger('RoomData');

	public connectedUsers: ConnectedUser[] = [];
	public rooms: Room[] = [];

	private constructor() {
		this.logger.log('RoomData create instance!!');
	}

	public static getInstance() {
		if (!RoomData.instance) {
			RoomData.instance = new RoomData();
		}

		return RoomData.instance;
	}
}

export const roomData = RoomData.getInstance();
