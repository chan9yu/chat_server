import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';

@Module({
	imports: [],
	providers: [ChatsGateway]
})
export class ChatsModule {}
