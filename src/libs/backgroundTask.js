import Guild from '../app/models/GuildModel'
import Cache from '../app/models/CacheModel'

import { getTimeFromFormat } from './timer'

import { buildEmbed } from '../services/warframeStatus'

const cycleMessage = async client => {
    const guilds = await Guild.Model.find({}).lean()
    const cycleEmbed = await buildEmbed()
    guilds.map(async guild => {
        if (guild.channels?.alert_channel_id) {
            const channel = await client.channels.fetch(guild.channels.alert_channel_id)
            const embedObject = Object.assign({
                footer: {
                    text: `${channel.guild.name} - ${getTimeFromFormat({ format: 'hh:mm a' })}`,
                    icon_url: channel.guild.iconURL(),
                },
            }, cycleEmbed )
            const messageID = await Cache.Model.findOne({ guild_id: guild.guild_id}).lean()
            if (messageID?.alert_message_id) {
                try {
                    const message = await channel.messages.fetch(messageID.alert_message_id)
                    message.edit({ embed: embedObject })
                } catch {
                    const messages = await channel.messages.fetch()
                    messages.map(async msg => await msg.delete())
                    const newMessage = await channel.send({ embed: embedObject })
                    await Cache.Model.deleteMany({ guild_id: guild.guild_id })
                    await Cache.Model({ guild_id: guild.guild_id, alert_message_id: newMessage.id }).save()
                }
            } else {
                const newMessage = await channel.send({ embed: embedObject })
                await Cache.Model({ guild_id: guild.guild_id, alert_message_id: newMessage.id }).save()
            }
        }
    })
}

module.exports = { cycleMessage }