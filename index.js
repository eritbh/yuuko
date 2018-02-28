const {Client} = require('./src/Yuuko')
const path = require('path')
const config = require('./config')
const request = require('superagent')

const c = new Client(config)

// Add commands
c.addCommandDir(path.join(__dirname, 'commands'))

// Handle pushing bot stats to bots.discord.pw
c.on('ready', () => {
	if (!config.dbotsId) return

	let lastSize = 0
	;(function updateStats (delay = 3600000) {
		if (lastSize === c.guilds.size) {
			setTimeout(updateStats, delay)
			return
		}
		lastSize = c.guilds.size
		request
			.post(`https://bots.discord.pw/api/bots/${config.dbotsId}/stats`)
			.set('Authorization', config.dbotsToken)
			.send({server_count: lastSize})
			.end((err, res) => {
				if (err) console.error(err)
				// console.log(res)
				setTimeout(updateStats, delay)
			})
	})()
})

// Connect
c.connect()
