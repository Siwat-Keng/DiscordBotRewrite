import Guild from '../models/GuildModel'
import blacklist from '../../locales/blacklists.json'

const messageCheck = async message => {
    if (blacklist.message.includes(message.content)) {
        await message.delete()
        return undefined
    }
    if (message.author.bot || !message.guild) return
    return Guild.Model.findOne({ guild_id: message.guild.id }).lean()
}

module.exports = { messageCheck }