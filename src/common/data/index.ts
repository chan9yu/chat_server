export type User = {
	id: string;
	identity: string;
	roomId: string;
	socketId: string;
};

export type Room = {
	id: string;
	connectedUsers: User[];
};

class GlobalData {
	public static instance: GlobalData;

	// global data
	public connectedUsers: User[] = [];
	public rooms: Room[] = [];

	private constructor() {}

	public static getInstance() {
		if (!GlobalData.instance) {
			GlobalData.instance = new GlobalData();
		}

		return GlobalData.instance;
	}
}

export const globalData = GlobalData.getInstance();
