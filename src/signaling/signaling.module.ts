import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';

@Module({
	controllers: [],
	providers: [SignalingGateway]
})
export class SignalingModule {}
