import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

import { roomData } from './rooms.data';

type TurnServer = {
	credential?: string;
	username?: string;
	url?: string;
	urls?: string;
};

type RoomInfo = {
	exists: boolean;
	full?: boolean;
};

type TurnInfo = {
	turnServers?: TurnServer[] | null;
	message?: string;
};

@Injectable()
export class RoomsService {
	constructor(private configService: ConfigService) {}

	public getRoomInfo(roomId: string) {
		let roomInfo: RoomInfo = { exists: false };
		const room = roomData.rooms.find(room => room.id === roomId);

		if (room) {
			const isFull = room.connectedUsers.length > 3;
			roomInfo = { exists: true, full: isFull };
		}

		return roomInfo;
	}

	public async getTurnInfo() {
		let turnInfo: TurnInfo = {};

		const accountSid = this.configService.get<string>('twilio.account_sid');
		const authToken = this.configService.get<string>('twilio.auth_token');

		try {
			const client = twilio(accountSid, authToken);
			const token = await client.tokens.create();

			turnInfo = {
				turnServers: token.iceServers
			};
		} catch (error) {
			turnInfo = {
				turnServers: null,
				message: (error as { message: string }).message
			};
		}

		return turnInfo;
	}
}
