'use strict'

const util = require('util')
let chalk
try {
  chalk = require('chalk')
} catch (e) {
  // Chalk isn't installed, that's fine
  // We'll create a thing that looks like chalk but really isn't
  chalk = text => text
  const codes = [ // Only the ones we actually use
    'bgRed',
    'green',
    'bgYellow',
    'cyan',
    'gray',
    'black',
    'white'
  ]
  for (let code of codes) {
    chalk[code] = chalk
  }
}

const logs = {
  debug: {text: 'dbug', style: chalk.white},
  info: {text: 'info', style: chalk.cyan},
  ok: {text: ' ok ', style: chalk.green},
  warn: {text: 'warn', style: chalk.black.bgYellow},
  error: {text: 'err!', style: chalk.white.bgRed}
}

chalk._log = function (...things) {
  let str = ''
  for (let thing of things) {
    if (typeof thing === 'string') {
      str += thing + ' '
    } else {
      let inspected = util.inspect(thing, {colors: true})
      str += inspected + ' '
    }
  }
  console.log(str.replace(/\n/g, '\n  '))
}
chalk.timestamp = function (text) {
  const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..*/, '')
  return chalk.gray(`[${timestamp} ${text}]`)
}
for (let log of Object.keys(logs)) {
  const {text, style} = logs[log]
  chalk[log] = function (...things) {
    this._log(this.timestamp(style(text)), ...things)
  }
}

module.exports = chalk
