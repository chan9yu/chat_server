import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) {}

	@Get('/')
	public getAllRooms() {
		return this.roomsService.getAllRooms();
	}

	@Get('/:roomId')
	public getRoom(@Param('roomId') roomId: string) {
		return this.roomsService.getRoom(roomId);
	}

	@Post('/create')
	public createRoom(@Body() createRoomDto: any) {
		return this.roomsService.createRoom();
	}

	@Post('/join')
	public joinRoom(@Body() joinRoomDto: any) {
		return this.roomsService.joinRoom();
	}

	@Post('/leave')
	public leaveRoom(@Body() leaveRoomDto: any) {
		return this.roomsService.leaveRoom();
	}

	@Post('/close')
	public closeRoom(@Body() closeRoomDto: any) {
		return this.roomsService.closeRoom();
	}
}
