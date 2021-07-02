import { Client } from 'discord.js'
import mongoose from 'mongoose'
import 'dotenv/config'

import messageHandler from './app/middlewares/messageHandler'
import messageController from './app/controllers/messageController'

const main = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}?${process.env.MONGODB_OPTION}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })

    const client = new Client()

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
    })

    client.on('message', async (message) => {
        const guildData = await messageHandler.messageCheck(message)
        if (!guildData) return
        if (message.channel.id === guildData.intro_channel_id) return messageController.introduceCheck(message)
        if (message.content.startsWith(guildData.prefix)) {
            const args = message.content.slice(guildData.prefix.length).trim().split(' ')
            const command = args.shift().toLowerCase()
            if (command === 'help') return messageController.help(message)
            else if (command === 'price') return messageController.priceCheck(message)
            else if (command === 'build') return messageController.getBuild(message)
        }
    })

    client.login(process.env.TOKEN)
}

main()