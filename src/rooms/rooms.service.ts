import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
	constructor() {}

	public getAllRooms() {
		return 'getAllRooms';
	}

	public getRoom(roomId: string) {
		return 'getRoom' + roomId;
	}

	public createRoom() {
		return 'createRoom';
	}

	public joinRoom() {
		return 'joinRoom';
	}

	public leaveRoom() {
		return 'leaveRoom';
	}

	public closeRoom() {
		return 'closeRoom';
	}
}
