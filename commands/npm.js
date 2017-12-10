const Command = require('../src/Command')
const request = require('request')

function describePackage (r) {
  const author = r.package.publisher.name || r.package.publisher.username
  const byline = author ? ` *by ${author}*` : ''
  const npm = r.package.links.npm
  const repo = r.package.links.repository || ''
  let home = r.package.links.homepage || ''

  // For the purpose of comparing the URLs, strip off trailing slashes, hashes,
  // and GitHub #readme anchors. If after that the two are the same, ignore the
  // homepage.
  const repoSimple = repo.replace(/[/#\s]*(#readme)?$/i, '')
  const homeSimple = home.replace(/[/#\s]*(#readme)?$/i, '')
  if (repoSimple === homeSimple) {
    home = ''
  }
  const links = [
    `[npm](${npm})`,
    repo ? `[repo](${repo})` : '',
    home ? `[homepage](${home})` : ''
  ].filter(l => l).join(', ')

  // \u2013: en-dash
  return `**\`${r.package.name}@${r.package.version}\`**${byline} \u2013 ${links}
${r.package.description || '*No description provided.*'}`
}

function embedResults (results, search) {
  return {
    color: 0xC12127, // npm brand color
    title: `Packages for "${search}"`,
    url: `https://www.npmjs.com/search?q=${search}`,
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
    const webLink = `<https://www.npmjs.com/search?q=${safeArgs}>`
    if (err || res.statusCode !== 200) {
      return msg.channel.createMessage(`Something went wrong while searching. Try again with a different query.\n${webLink}`)
    }
    if (result.total < 1) {
      return msg.channel.createMessage(`No results! ${webLink}`)
    }

    let results = result.results.slice(0, 3)
    let content = `Top results from ${webLink}`

    // Handle a perfect match
    if (results[0].package.name === args) {
      content += `\n(Exact match: <${result.results[0].package.links.npm}>)`
    }

    // Generate the message
    msg.channel.createMessage({
      content,
      embed: embedResults(results, args)
    }).catch(e => {
      this.u.error(e)
      msg.channel.createMessage('There was an error displaying the results.')
    })
  })
}, {
  desc: 'Search for, and get information on, npm packages.',
  args: '<search>'
})
