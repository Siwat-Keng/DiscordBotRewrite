import { Client } from 'discord.js'
import mongoose from 'mongoose'
import 'dotenv/config'

import { cycleMessage, notification } from './libs/backgroundTask'

import messageHandler from './app/middlewares/messageHandler'

import messageController from './app/controllers/messageController'
import guildController from './app/controllers/guildController'
import memberController from './app/controllers/memberController'

const main = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}?${process.env.MONGODB_OPTION}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })

    const client = new Client()

    client.on('ready', () => {
        setInterval(cycleMessage, 60000, client)
        notification(client)
        console.log(`Logged in as ${client.user.tag}!`)
    })

    client.on('message', async message => {
        const guildData = await messageHandler.messageCheck(message)
        if (!guildData) return
        if (message.channel.id === guildData.channels?.intro_channel_id) return messageController.introduceCheck(message)
        if (guildData.channels?.share_channels?.includes(message.channel.id)) return messageController.linkedMessage(message)
        if (message.content.startsWith(guildData.prefix) && (!guildData.channels?.command_channel_id || guildData.channels?.command_channel_id === message.channel.id)) {
            const args = message.content.slice(guildData.prefix.length).trim().split(' ')
            const command = args.shift().toLowerCase()
            if (command === 'help') return messageController.help(message)
            else if (command === 'price') return messageController.priceCheck(message)
            else if (command === 'build') return messageController.getBuild(message)
            else if (command === 'member') return messageController.getMember(message)
        }
    })

    client.on('guildCreate', guild => guildController.guildJoin(guild))

    client.on('guildDelete', guild => guildController.guildLeave(guild))

    client.on('guildMemberAdd', member => memberController.memberJoin(member))

    client.on('guildMemberRemove', member => memberController.memberLeave(member))

    client.login(process.env.TOKEN)
}

main()