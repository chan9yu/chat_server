import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
	controllers: [RoomsController],
	providers: [ConfigService, RoomsService]
})
export class RoomsModule {}
