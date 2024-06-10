declare namespace NodeJS {
	export interface ProcessEnv {
		// twilio auth info
		TWILIO_ACCOUNT_SID: string | undefined;
		TWILIO_AUTH_TOKEN: string | undefined;
	}
}
