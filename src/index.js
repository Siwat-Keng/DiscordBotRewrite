import { Client } from 'discord.js'
import mongoose from 'mongoose'
import 'dotenv/config'

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

    client.login(process.env.TOKEN)
}

main()