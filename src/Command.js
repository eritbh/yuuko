class Command {
    constructor (name, process, help = {}) {
        if (Array.isArray(name)) {
            this.name = name.splice(0,1)[0]
            this.aliases = name
        } else {
            this.name = name
            this.aliases = []
        }
        if (!this.name) throw new TypeError('Name is required')
        this.process = process
        if (!this.process) throw new TypeError('Process is required')
        this.help = {
            desc: help.desc || null,
            args: help.args || null
        }
        this.source = __filename
    }

    helpText (prefix) {
        let txt = ''
        if (this.help.desc) txt += `**Description:** ${this.help.desc}\n`
        if (this.help.args) txt += `**Usage:** \`${prefix}${this.name} ${this.help.args}\`\n`
        if (this.aliases.length) txt += `**Aliases:** ${this.aliases.map(p => '`' + prefix + p + '`').join(', ')}\n`
        return txt
    }

    get names () {
        return [this.name, ...this.aliases]
    }
}

module.exports = Command