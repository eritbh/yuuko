const Command = require('../src/Command')
const color = require('color')

module.exports = new Command('color', function (msg, args) {
  // Parse args as color
  const joinedArgs = args.join(' ')
  let col
  try {
    col = color(joinedArgs)
  } catch (e) {
    try {
      col = color('#' + joinedArgs)
    } catch (e) {
      return msg.channel.createMessage("Doesn't look like that's a valid CSS color.")
    }
  }
  const bareHex = col.hex().substr(1).toLowerCase()

  // End with message and an embed with more color information
  msg.channel.createMessage({
    content: `Got the color! ColorHexa has more info: <http://www.colorhexa.com/${bareHex}>`,
    embed: {
      title: `Color ${col.hex()}`,
      url: `http://www.colorhexa.com/${bareHex}`,
      description: `Hex: \`${col.hex()}\`
RGB: \`${col.rgb().string()}\` or \`${col.percentString()}\`
HSL: \`${col.hsl().round().string()}\`
${col.keyword() ? `Keyword: \`${col.keyword()}\`` : ''}`,
      image: {
        url: `https://dummyimage.com/240x50/${bareHex}.png?text=+`
      },
      color: col.rgbNumber()
    }
  })
})
module.exports.help = {
  desc: 'Gets alternate writings of a CSS color, plus a preview.',
  args: '<color>'
}
