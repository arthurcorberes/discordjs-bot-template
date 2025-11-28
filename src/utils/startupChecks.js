import fetch from 'node-fetch';

export async function startupChecks(config) {
	const prefix = 'Startup checks | ';
	console.log(prefix + 'Starting bot checks...\nDid you know that you can change the value of `ENV` in `.env` to switch between production and development tokens?');

	if (!config.TOKEN) {
		console.error(prefix + 'ERROR: Token is missing in your .env!');
		process.exit(1);
	}
	console.log(prefix + 'Token found');

	console.log(prefix + `Environment: ${config.MODE.toUpperCase()}`);

	try {
		const res = await fetch('https://discord.com/api/v10/users/@me', {
			headers: { Authorization: `Bot ${config.TOKEN}` },
		});

		if (res.status === 200) {
			const botData = await res.json();
			console.log(prefix + 'Token is valid!');
			console.log(prefix + 'Bot info:');
			console.log(`Username: ${botData.username}`);
			console.log(`Discriminator: #${botData.discriminator}`);
			console.log(`Bot ID: ${botData.id}`);
			console.log(`Verified: ${botData.verified ? 'Yes' : 'No'}`);
		}
		else if (res.status === 401) {
			console.error(prefix + 'ERROR: Token is invalid (Unauthorized)');
			process.exit(1);
		}
		else {
			console.warn(prefix + `WARNING: Unexpected Discord API response: ${res.status}`);
		}
	}
	catch (err) {
		console.error(prefix + 'Error checking token:', err);
		process.exit(1);
	}

	if (config.MODE === 'prod') {
		console.log(prefix + 'PRODUCTION mode detected! Waiting 10 seconds to confirm...');
		await new Promise(resolve => setTimeout(resolve, 10000));
		console.log(prefix + 'Continuing...');
	}

	console.log(prefix + 'All startup checks passed...');
}
