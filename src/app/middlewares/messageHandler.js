import Guild from '../models/GuildModel'
import blacklist from '../../locales/blacklists.json'

const messageCheck = message => {
    if (blacklist.message.includes(message.content)) {
        message.delete().catch(err => console.log(err))
    }
    if (message.author.bot || !message.guild) return
    return Guild.Model.findOne({ guild_id: message.guild.id }).lean()
}

module.exports = { messageCheck }