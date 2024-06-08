import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	public getHello(): string {
		return `Hello, we're simple meet server`;
	}
}
