import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RoomsController } from './rooms.controller';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';

@Module({
	controllers: [RoomsController],
	providers: [ConfigService, RoomsService, RoomsGateway]
})
export class RoomsModule {}
