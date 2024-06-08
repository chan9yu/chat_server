import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	public getHeoll() {
		return this.appService.getHello();
	}

	@Get('/room-exists/:roomId')
	public getRoomInfo(@Param('roomId') roomId: string) {
		return this.appService.getRoomInfo(roomId);
	}
}
