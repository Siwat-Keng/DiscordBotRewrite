import { DateTime } from 'luxon'
import Guild from '../app/models/GuildModel'
import Cache from '../app/models/CacheModel'

import { getNotificationTimeout } from './notification'

import { buildEmbed } from '../services/warframeStatus'

import formatString from '../locales/format.json'

const cycleMessage = async client => {
    const guilds = await Guild.Model.find({}).lean()
    const cycleEmbed = await buildEmbed()
    guilds.map(async guild => {
        if (guild.channels?.alert_channel_id) {
            const channel = await client.channels.fetch(guild.channels.alert_channel_id)
            const embedObject = Object.assign({
                footer: {
                    text: `${channel.guild.name} - ${DateTime.local().setZone(process.env.DEFAULT_TIMEZONE).toFormat('hh:mm a')}`,
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

const notification = async client => {
    const notifyHelminth = async (channel, role) => {
        await channel.send(`${formatString.notification.helminth} ${role.toString()}`)
        const { helminthTimeout } = getNotificationTimeout()
        setTimeout(notifyHelminth, helminthTimeout, channel, role)
    }
    const notifyRivenSliver = async (channel, role) => {
        await channel.send(`${formatString.notification.rivenSliver} ${role.toString()}`)
        const { rivenSliverTimeout } = getNotificationTimeout()
        setTimeout(notifyRivenSliver, rivenSliverTimeout, channel, role)
    }
    const guilds = await Guild.Model.find({}).lean()
    const notifyTimeout = getNotificationTimeout()
    guilds.filter(guild => guild.channels?.notify_channel_id).map(async guild => {
        const notifyChannel = await client.channels.fetch(guild.channels.notify_channel_id)
        if (guild.notifications?.helminth && guild.roles?.helminth) {
            const helminthRole = await notifyChannel.guild.roles.fetch(guild.roles.helminth)
            setTimeout(notifyHelminth, notifyTimeout.helminthTimeout, notifyChannel, helminthRole)
        }
        if (guild.notifications?.riven_sliver && guild.roles?.riven_sliver) {
            const rivenSliverRole = await notifyChannel.guild.roles.fetch(guild.roles.riven_sliver)
            setTimeout(notifyRivenSliver, notifyTimeout.rivenSliverTimeout, notifyChannel, rivenSliverRole)
        }
    })
}

module.exports = { cycleMessage, notification }