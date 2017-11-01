const Command = require('../src/Command')
const request = require('request')

/**
 * Convert a number from 0 to 1 inclusive to a percent with at most 2 decimal places.
 * @param {number} n - The number to convert to a percentage.
 */
function percent (n) {
  return Math.round(n * 1000) / 10 + '%'
}

/**
 * Take a npms result and give back a description string on it.
 * @param r {object} - The decoded JSON data from npms.
 */
function describeThing (r) {
  return `<${r.package.links.npm}>`
}

function embedThing (r) {
  return {
    title: `${r.package.name} on npm`,
    description: `**\`${r.package.name}@${r.package.version}\`**${r.package.author ? ` *by ${r.package.author.name}*` : ''}\n${
      r.package.description}${
      r.package.links.repository ? `\n**Repo:** ${r.package.links.repository}` : ''}${
      r.package.links.homepage ? `\n**Homepage:** ${r.package.links.homepage}` : ''
    }`,
    url: r.package.links.npm,
    provider: {
      name: 'npm',
      url: 'https://npmjs.com'
    }
  }
}

module.exports = new Command('npm', function (msg, args) {
  args = args.join(' ').toLowerCase()
  let safeArgs = encodeURIComponent(args)
  request(`https://api.npms.io/v2/search?q=${safeArgs}`, (err, res, body) => { // npms.io api <3
    let result = JSON.parse(body)
    if (!(res.statusCode === 200 && !err)) return msg.channel.createMessage('Something went wrong while searching. Try again with a different query.')

    if (result.total > 0 && result.results[0].package.name === args) { // Perfect match
      let r = result.results[0]
      // console.log('Exact match found!')
      msg.channel.createMessage({
        content: describeThing(r),
        embed: embedThing(r)
      })
      // c.reply(msg, JSON.stringify(r, null, 4))
    } else if (result.total > 0) { // Not an exact match, but at least we got *something*
      let searchResults = result.results.slice(0, 3)
      let userResponse = `=== **Search results for \`${args}\` ===**`
      for (let r of searchResults) {
        userResponse += '\n\n' + describeThing(r)
      }
      msg.channel.createMessage(userResponse)
    } else { // fuck
      msg.channel.createMessage('Sorry, no packages matched your search.')
    }
  })
}, {
  desc: 'Things.',
  args: '<search>'
})
