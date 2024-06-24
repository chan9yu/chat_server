import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeetsService {
	constructor(private configService: ConfigService) {}

	public async getTest() {
		return 'meets module test';
	}
}
