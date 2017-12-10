const Command = require('../src/Command')
const request = require('request')

function getLinks (r) {
  let npm = r.package.links.npm
  let home = (r.package.links.homepage || '').replace(/\/$/, '')
  let repo = (r.package.links.repository || '').replace(/\/\s*$/, '')
  if (repo === home) {
    home = ''
  }
  return [
    `[npm](${npm})`,
    repo ? `[Repo](${repo})` : '',
    home ? `[Homepage](${home})` : ''
  ].filter(l => l).join(' - ')
}

function describePackage (r) {
  const author = r.package.publisher.name || r.package.publisher.username
  const byline = author ? ` *by ${author}*` : ''
  return `**\`${r.package.name}@${r.package.version}\`**${byline}
${r.package.description || '*No description provided.*'}
${getLinks(r)}`
}

function embedPackage (r) {
  return {
    color: 0xC12127,
    title: `${r.package.name} on npm`,
    description: describePackage(r),
    url: r.package.links.npm,
    provider: {
      name: 'npm',
      url: 'https://npmjs.com'
    }
  }
}

function embedResults (results, search) {
  const searchUrl = search && `https://www.npmjs.com/search?q=${encodeURIComponent(search)}`
  return {
    color: 0xC12127,
    title: `Search results for "${search}"`,
    description: `[See more results on npm ](${searchUrl})`,
    fields: results.map(r => {
      return {
        name: `**${r.package.name}**`,
        value: describePackage(r)
      }
    })
  }
}

module.exports = new Command('npm', function (msg, args) {
  args = args.join(' ').toLowerCase()
  let safeArgs = encodeURIComponent(args)
  msg.channel.sendTyping()
  request(`https://api.npms.io/v2/search?q=${safeArgs}`, (err, res, body) => { // npms.io api <3
    let result = JSON.parse(body)
    if (!(res.statusCode === 200 && !err)) return msg.channel.createMessage('Something went wrong while searching. Try again with a different query.')

    if (result.total > 0 && result.results[0].package.name === args) { // Perfect match
      let r = result.results[0]
      // console.log('Exact match found!')
      msg.channel.createMessage({
        content: `Found it! <${r.package.links.npm}>`,
        embed: embedPackage(r)
      }).catch(e => {
        this.u.error(e)
        msg.channel.createMessage('There was an error displaying the results.')
      })
      // c.reply(msg, JSON.stringify(r, null, 4))
    } else if (result.total > 0) { // Not an exact match, but at least we got *something*
      let results = result.results.slice(0, 3)
      msg.channel.createMessage({
        content: `Top 3 results:${results.map(r => `\n<${r.package.links.npm}>`)}`,
        embed: embedResults(results, args)
      }).catch(e => {
        this.u.error(e)
        msg.channel.createMessage('There was an error displaying the results.')
      })
    } else { // fuck
      msg.channel.createMessage('Sorry, no packages matched your search.')
    }
  })
}, {
  desc: 'Search for, and get information on, npm packages.',
  args: '<search>'
})
