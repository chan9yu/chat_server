import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MeetsController } from './meets.controller';
import { MeetsGateway } from './meets.gateway';
import { MeetsService } from './meets.service';

@Module({
	controllers: [MeetsController],
	providers: [ConfigService, MeetsGateway, MeetsService]
})
export class MeetsModule {}
