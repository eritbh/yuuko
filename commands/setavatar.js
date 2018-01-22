const Command = require('../src/Command')
const request = require('request')

module.exports = new Command('setavatar', function (msg, args) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			return msg.channel.createMessage("You're not my dad.")
		}
		// Get the URL of the image
		let url = args[0] || '' // URL specified in chat, or an empty string so we can handle errors later
		if (msg.attachments[0]) url = msg.attachments[0].url // URL specified by upload
		url = url.replace(/<([^>]+)>/, '$1') // Allow suppressed URLs
		if (url === '') return msg.channel.createMessage('No image was uploaded or linked.') // Return if no URL
		msg.channel.sendTyping()
		// Get the image itself by requesting the URL
		request.get({url: url, method: 'GET', encoding: null}, (err, res, body) => {
			// Handle possible errors
			if (err) return msg.channel.createMessage('Error while retrieving avatar: ' + err)
			else if (res.statusCode !== 200) return msg.channel.createMessage(`Got non-200 response (${res.statusCode} ${res.statusMessage}) while retrieving avatar`)
			// Edit the avatar
			this.editSelf({
				avatar: `data:${res.headers['content-type']};base64,${body.toString('base64')}`
			}).then(() => {
				msg.channel.createMessage('Avatar updated!')
			}).catch(() => {
				msg.challen.createMessage('There was an error while uploading the new avatar.')
			})
		})
	})
})
