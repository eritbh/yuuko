const Command = require('../src/Command')
const color = require('color')

throw new Error('I\'m an error!')

module.exports = new Command('color', (c, msg, args) => {
    // Parse args as color
    let col
    try {
        col = color(args.join(' '))
    } catch (e) {
        return msg.channel.createMessage("Doesn't look like that's a valid CSS color.")
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
                url: `https://dummyimage.com/50/${bareHex}.png?text=+`
            }
        }
    })
}, {
    desc: 'Gets alternate writings of a CSS color, plus a preview.',
    args: '<color>'
})
