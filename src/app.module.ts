import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { ChatsModule } from './chats/chats.module';
import { AppService } from './app.service';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), ChatsModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
