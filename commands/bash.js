const {Command} = require('../src/Yuuko.js')
const {exec} = require('child_process')

module.exports = new Command(['bash', 'sh', 'sys'], function (msg, args) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			return msg.channel.createMessage("You're not my dad.")
		}

		let content = ''
		let activeMsg

		msg.channel.createMessage('```\n```').then(outputMsg => {
			// Start the process
			const childProcess = exec(args.join(' '))

			// If the process errors, log the message and add a reaction
			childProcess.on('error', e => {
				pushData(`Error: ${e.message}`)
				react('💣')
			})

			// When the process exits, react based on exit code
			childProcess.on('exit', code => {
				let reaction
				if (code === 0) {
					react('✅')
				} else {
					react('❎')
				}
			})

			// Push stdout and stderr to the output message
			childProcess.stdout.on('data', pushData)
			childProcess.stderr.on('data', pushData)

			let allData = ''
			function pushData (data) {
				data = data.replace(/`/g, '`\u200b')
				allData += data
				outputMsg.edit(`\`\`\`\n${allData}\`\`\``).catch(console.log)
			}

			function react (reaction) {
				outputMsg.addReaction(reaction).catch(console.log)
			}
		}, console.log)
	})
})
