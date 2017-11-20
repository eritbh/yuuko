const Yuuko = require('./src/Yuuko')
const path = require('path')
let config = require('./config')

const c = new Yuuko(config)

c.addCommandDir(path.join(__dirname, 'commands')).connect()
