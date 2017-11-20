const Yuuko = require('./src/Yuuko')

let config = require('./config')
config.commandDir = require('path').join(__dirname, config.commandDir)
console.log(config)
const c = new Yuuko(config)

c.connect()
