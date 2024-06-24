import { Controller, Get } from '@nestjs/common';
import { MeetsService } from './meets.service';

@Controller('meets')
export class MeetsController {
	constructor(private readonly meetsService: MeetsService) {}

	@Get('/')
	public getTest() {
		return this.meetsService.getTest();
	}
}
