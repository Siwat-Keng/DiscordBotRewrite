import Member from '../models/MemberModel'
import Guild from '../models/GuildModel'

import { getPriceEmbed } from '../../services/warframeMarket'
import { getBuildMessage } from '../../services/warframeBuild'

import { checkSentence } from '../../libs/introduceCheck'
import { warframeMarketFooter } from '../../libs/setFooter'
import { addWarframeMarketReaction, warframeMarketReaction } from '../../libs/handleReaction'

import response from '../../locales/response.json'
import reaction from '../../locales/reaction.json'

const introduceCheck = async message => {
    const result = checkSentence(message)
    if (result) {
        let memberData = await Member.Model.findOne({ member_id: message.author.id, guild_id: message.guild.id }).lean()
        if (memberData) {
            memberData.name = result.Name
            memberData.in_game_name = result.Ign
            memberData.age = result.Age
            memberData.clan = result.Clan
            memberData.member_tag = message.author.tag
            await Member.Model.updateOne({ member_id: message.author.id, guild_id: message.guild.id }, memberData)
        } else {
            await Member.Model({
                guild_id: message.guild.id,
                member_id: message.author.id,
                name: result.Name,
                in_game_name: result.Ign,
                age: result.Age,
                clan: result.Clan,
                member_tag: message.author.tag,
            }).save()
        }
        const guildData = await Guild.Model.findOne({ guild_id:message.guild.id }).lean()
        if (guildData.roles?.waiting_intro_id && guildData.roles?.member_id){
            const waitingIntroRole = await message.guild.roles.fetch(guildData.roles.waiting_intro_id)
            const MemberRole = await message.guild.roles.fetch(guildData.roles.member_id)
            await message.member.roles.add(MemberRole)
            await message.member.roles.remove(waitingIntroRole)
        }
        await message.react(reaction.success)
        await message.author.send({ embed: response.introduce.success.embed })
    } else {
        await message.react(reaction.fail)
        await message.author.send({ embed: response.introduce.fail.embed })
        setTimeout(() => message.delete(), 30000)
    }
}

const help = message => message.author
    .send({ embed: response.help.embed })
    .catch(() => message.channel.send({ embed: response.help.embed }))
    .finally(() => message.react(reaction.success))


const priceCheck = async message => {
    const guildData = await Guild.Model.findOne({ guild_id: message.guild.id }).lean()
    const args = message.content.slice(guildData.prefix.length).trim().split(' ')
    args.shift()
    const waitingMessage = await message.channel.send(response.loading.message)
    try {
        const priceEmbed = await getPriceEmbed(args.join(' '))
        priceEmbed.sell = warframeMarketFooter({ embed: priceEmbed.sell, guild: message.guild})
        priceEmbed.buy = warframeMarketFooter({ embed: priceEmbed.buy, guild: message.guild})
        waitingMessage.delete()
        const sellerMessage = await message.channel.send({ embed: priceEmbed.sell })
        const buyerMessage = await message.channel.send({ embed: priceEmbed.buy })
        addWarframeMarketReaction(sellerMessage, priceEmbed.sell.maxRank !== -1)
        addWarframeMarketReaction(buyerMessage, priceEmbed.buy.maxRank !== -1)
        warframeMarketReaction(sellerMessage, priceEmbed.sell)
        warframeMarketReaction(buyerMessage, priceEmbed.buy)
        await message.react(reaction.success)
    } catch (err) {
        console.error(err)
        waitingMessage.delete()
        message.react(reaction.fail)
    }
}

const getBuild = async message => {
    const guildData = await Guild.Model.findOne({ guild_id: message.guild.id }).lean()
    const args = message.content.slice(guildData.prefix.length).trim().split(' ')
    args.shift()
    const waitingMessage = await message.channel.send(response.loading.message)
    const buildsEmbed = await getBuildMessage(args.join(' '))
    await waitingMessage.delete()
    buildsEmbed.map( async build => await message.channel.send({ embed: build }))
    await message.react(reaction.success)
}

const getMember = async message => console.log(message.content)

module.exports = { introduceCheck, help, priceCheck, getBuild, getMember }