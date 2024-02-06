import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	root() {
		return {
			data: {
				title: 'Simple Meet',
				copyright: 'chan9yu'
			}
		};
	}
}
