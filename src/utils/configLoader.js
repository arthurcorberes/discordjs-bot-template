import fs from 'fs';

function loadEnv(path = '.env') {
	if (!fs.existsSync(path)) return {};
	return Object.fromEntries(
		fs.readFileSync(path, 'utf8')
			.split('\n')
			.filter(line => line && !line.startsWith('#'))
			.map(line => line.split('=').map(s => s.trim())),
	);
}

export function loadConfig() {
	const envVars = loadEnv();

	const ENV = envVars.ENV || 'dev';

	const config = {
		MODE: ENV,
		TOKEN: ENV === 'dev' ? envVars.DEV_TOKEN : envVars.PROD_TOKEN,
		CLIENT_ID: ENV === 'dev' ? envVars.DEV_APP_ID : envVars.PROD_APP_ID,
		DEV_GUILD_ID: envVars.DEV_GUILD_ID,
	};

	return config;
}
