const config = require('./config')

const Yuuko = require('./src/Yuuko')
const c = new Yuuko(config)

c.connect()
