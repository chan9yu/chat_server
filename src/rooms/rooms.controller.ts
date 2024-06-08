import { Controller, Get, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) {}

	@Get('/exists/:roomId')
	public getRoomInfo(@Param('roomId') roomId: string) {
		return this.roomsService.getRoomInfo(roomId);
	}
}
