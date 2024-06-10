function configuration() {
	return {
		twilio: {
			account_sid: process.env.TWILIO_ACCOUNT_SID,
			auth_token: process.env.TWILIO_AUTH_TOKEN
		}
	};
}

export default configuration;
