import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { RoomsModule } from './rooms/rooms.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.local'],
			load: [configuration],
			isGlobal: true
		}),
		RoomsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
