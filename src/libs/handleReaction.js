import { increaseRank, decreaseRank, nextPage, previousPage, refreshEmbed } from '../services/warframeMarket'
import reaction from '../locales/reaction.json'

const filter = (react, user) => {
    if (!user.bot) react.users.remove(user.id)
    return (
        (react.emoji.name === reaction.plus ||
            react.emoji.name === reaction.minus ||
            react.emoji.name === reaction.left ||
            react.emoji.name === reaction.right ||
            react.emoji.name === reaction.load) &&
      !user.bot
    )
}

const addWarframeMarketReaction = (message, hasRank) => {
    if (hasRank)
        message.react(reaction.left).then(() =>
            message.react(reaction.right).then(() =>
                message
                    .react(reaction.plus)
                    .then(() => message.react(reaction.minus))
                    .then(() => message.react(reaction.load)),
            ),
        )
    else
        message
            .react(reaction.left)
            .then(() => message.react(reaction.right).then(() => message.react(reaction.load)))
}

const warframeMarketReaction = (message, embed) =>
    message.awaitReactions(filter, { max: 1, time: 300000 }).then((collected) => {
        if (collected.first()) {
            if (collected.first().emoji.name === reaction.plus) {
                embed = increaseRank(embed)
                message.edit({ embed: embed })
                warframeMarketReaction(message, embed)
            } else if (collected.first().emoji.name === reaction.minus) {
                embed = decreaseRank(embed)
                message.edit({ embed: embed })
                warframeMarketReaction(message, embed)
            } else if (collected.first().emoji.name === reaction.left) {
                embed = previousPage(embed)
                message.edit({ embed: embed })
                warframeMarketReaction(message, embed)
            } else if (collected.first().emoji.name === reaction.right) {
                embed = nextPage(embed)
                message.edit({ embed: embed })
                warframeMarketReaction(message, embed)
            } else if (collected.first().emoji.name === reaction.load) {
                refreshEmbed(embed).then((newEmbed) => {
                    newEmbed.footer = {}
                    newEmbed.footer.text = `${message.guild.name} Discord ${newEmbed.rankMessage}`
                    newEmbed.footer.icon_url = `${message.guild.iconURL()}`
                    newEmbed.guildName = message.guild.name
                    message.edit({ embed: newEmbed })
                    warframeMarketReaction(message, newEmbed)
                })
            }
        } else message.delete()
    })

module.exports = { addWarframeMarketReaction, warframeMarketReaction }