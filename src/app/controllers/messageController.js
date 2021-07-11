import Member from '../models/MemberModel'
import Guild from '../models/GuildModel'

import { getPriceEmbed } from '../../services/warframeMarket'
import { getBuildMessage } from '../../services/warframeBuild'

import { checkSentence } from '../../libs/introduceCheck'
import { warframeMarketFooter, setIcon } from '../../libs/setFooter'
import { addWarframeMarketReaction, warframeMarketReaction } from '../../libs/handleReaction'
import { memberEmbed } from '../../libs/buildEmbed'
import { embedTemplateParser } from '../../libs/stringTemplate'

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
            memberData.member_tag = escape(message.author.tag)
            await Member.Model.updateOne({ member_id: message.author.id, guild_id: message.guild.id }, memberData)
        } else {
            await Member.Model({
                guild_id: message.guild.id,
                member_id: message.author.id,
                name: result.Name,
                in_game_name: result.Ign,
                age: result.Age,
                clan: result.Clan,
                member_tag: escape(message.author.tag),
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
        await message.author.send({ 
            embed: setIcon({ embed: embedTemplateParser(response.introduce.success.embed , {
                'author.tag': message.author.tag,
                'guild.me.displayName': message.guild.me.displayName,
                prefix: guildData.prefix,
                guild: message.guild.name,
            }),
            guild: message.guild,
            }),
        })
    } else {
        const guildData = await Guild.Model.findOne({ guild_id:message.guild.id }).lean()
        const introChannel = await message.guild.client.channels.fetch(guildData.channels.intro_channel_id)
        await message.react(reaction.fail)
        const embed = setIcon({
            embed: embedTemplateParser(response.introduce.fail.embed, {
                'author.tag': message.author.tag,
                'intro_channel.name': introChannel.name,
            }),
            guild: message.guild,
        })
        await message.author.send({ embed })
        setTimeout(() => message.delete(), 30000)
    }
}

const help = async message => {
    const guildData = await Guild.Model.findOne({ guild_id: message.guild.id }).lean()
    const embed = setIcon({
        embed: embedTemplateParser(response.help.embed, {
            'author.tag': message.author.tag,
            'guild.me.displayName': message.guild.me.displayName,
            prefix: guildData.prefix,
            guild: message.guild.name,
        }), guild: message.guild })
    message.author
        .send({ embed })
        .catch(() => message.channel.send({ embed }))
        .finally(() => message.react(reaction.success))
}

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

const getMember = async message => {
    const guildData = await Guild.Model.findOne({ guild_id: message.guild.id }).lean()
    const args = message.content.slice(guildData.prefix.length).trim().split(' ')
    args.shift()
    const members = await Member.Model.find({ guild_id: message.guild.id, member_tag: escape(args.join(' '))}).lean()
    members.map(member => message.channel.send({ 
        embed: setIcon({
            embed: memberEmbed(member),
            guild: message.guild,
        }),
    }))
    await message.react(reaction.success)
}

module.exports = { introduceCheck, help, priceCheck, getBuild, getMember }