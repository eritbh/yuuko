const fs = require('fs');

module.exports = (path, indent) => {
	let data;
	try {
		data = fs.readFileSync(path);
	} catch (err) {
		data = {defaults: {}, guilds: {}};
	}

	async function saveData () {
		return fs.promises.writeFile(path, JSON.stringify(data, null, indent))
			.catch(err => {
				if (err) console.error(err);
			});
	}

	return {
		async get (guildId, key, raw = false) {
			if (data.guilds[guildId] === undefined || data.guilds[guildId][key] === undefined) {
				return raw ? undefined : data.defaults[key];
			}
			return data.guilds[guildId][key];
		},
		async set (guildId, key, value) {
			if (!data.guilds[guildId]) data.guilds[guildId] = {};
			data.guilds[guildId][key] = value;
			await saveData();
			return value;
		},
		// async push (guildId, key, element) {
		// 	let array = await this.get(guildId, key);
		// 	if (!array) {
		// 		array = [];
		// 	}
		// 	if (!Array.isArray(array)) throw new Error('cannot push to non-array');
		// 	array.push(element);
		// 	await this.set(guildId, key, array);
		// 	return element;
		// },
		// async delete (guildId, key, func) {
		// 	let array = await this.get(guildId, key);
		// 	if (!array) {
		// 		array = [];
		// 	}
		// 	if (!Array.isArray(array)) throw new Error('cannot push to non-array');
		// 	const index = Array.findIndex(func);
		// 	if (index === -1) return;
		// 	const val = array.splice(index, 1);
		// 	await this.set(guildId, key, array);
		// 	return val;
		// },
		async getDefault (key) {
			return data.defaults[key];
		},
		async setDefault (key, value) {
			data.defaults[key] = value;
			await saveData();
			return value;
		}
	};
};
