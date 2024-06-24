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

class MeetData {
	private static instance: MeetData;

	private logger = new Logger('MeetData');

	public connectedUsers: ConnectedUser[] = [];
	public rooms: Room[] = [];

	private constructor() {
		this.logger.log('MeetData create instance!!');
	}

	public static getInstance() {
		if (!MeetData.instance) {
			MeetData.instance = new MeetData();
		}

		return MeetData.instance;
	}
}

export const meetData = MeetData.getInstance();
