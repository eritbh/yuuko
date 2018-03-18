'use strict'

const Command = require('../src/Command')
const superagent = require('superagent')

module.exports = new Command('setavatar', function (msg, args) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			msg.channel.createMessage("You're not my dad.")
			return
		}
		// Get the URL of the image
		let url = args[0] || '' // URL specified in chat, or an empty string so we can handle errors later
		if (msg.attachments[0]) url = msg.attachments[0].url // URL specified by upload
		url = url.replace(/<([^>]+)>/, '$1') // Allow suppressed URLs
		if (!url) {
			msg.channel.createMessage('No image was uploaded or linked.')
			return
		}
		// Get the image itself by requesting the URL
		msg.channel.sendTyping()
		superagent.get(url).then(res => {
			// Handle possible errors
			if (!res.ok) {
				msg.channel.createMessage(`Got non-ok response (${res.statusCode}) while retrieving avatar`)
				return
			}
			// Edit the avatar
			this.editSelf({
				avatar: `data:${res.headers['content-type']};base64,${res.body.toString('base64')}`
			}).then(() => {
				msg.channel.createMessage('Avatar updated!')
			}).catch(() => {
				msg.channel.createMessage('There was an error while uploading the new avatar.')
			})
		}).catch(err => {
			msg.channel.createMessage('Error while retrieving avatar: ' + err)
		})
	})
})
