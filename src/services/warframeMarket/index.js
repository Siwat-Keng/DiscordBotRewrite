import getPriceData from './API'

const BUY_TYPE = 0
const SELL_TYPE = 1

const getPriceEmbed = (name) =>
    getPriceData(name).then((priceData) => {
        let embeds = {}
        let rankMessage
        if (priceData.maximumRank === -1) rankMessage = ''
        else rankMessage = '[ Item Rank : 0 ]'
        embeds.sell = {}
        embeds.buy = {}
        embeds.sell.rankMessage = rankMessage
        embeds.sell.maxRank = priceData.maximumRank
        embeds.sell.itemName = priceData.itemName
        embeds.sell.data = priceData.sell
        embeds.sell.currentPage = 1
        embeds.sell.currentRank = 0
        embeds.sell.type = BUY_TYPE
        embeds.sell.color = '#F1C40F'
        embeds.sell.title = `${priceData.itemName} Sellers (Page ${
            embeds.sell.currentPage
        }/${Math.round(priceData.sell[embeds.sell.currentRank].length / 5)})`
        embeds.sell.url = priceData.url
        embeds.sell.fields = []
        priceData.sell[embeds.sell.currentRank].slice(0, 5).map((item) =>
            embeds.sell.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to buy: ${priceData.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
        embeds.buy.rankMessage = rankMessage
        embeds.buy.maxRank = priceData.maximumRank
        embeds.buy.itemName = priceData.itemName
        embeds.buy.data = priceData.buy
        embeds.buy.currentPage = 1
        embeds.buy.currentRank = 0
        embeds.buy.type = SELL_TYPE
        embeds.buy.color = '#F1C40F'
        embeds.buy.title = `${priceData.itemName} Buyers (Page ${
            embeds.buy.currentPage
        }/${Math.round(priceData.buy[embeds.buy.currentRank].length / 5)})`
        embeds.buy.url = priceData.url
        embeds.buy.fields = []
        priceData.buy[embeds.buy.currentRank].slice(0, 5).map((item) =>
            embeds.buy.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to sell: ${priceData.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
        return embeds
    })

const increaseRank = (embed) => {
    if (embed.currentRank >= embed.maxRank) return embed
    embed.currentRank++
    embed.currentPage = 1
    let msgType, titleType, rankMessage
    rankMessage = `[ Item Rank : ${embed.currentRank} ]`
    embed.rankMessage = rankMessage
    embed.footer.text = `${embed.guildName} Discord ${embed.rankMessage}`
    if (embed.type === BUY_TYPE) {
        msgType = 'buy'
        titleType = 'Sellers'
    } else {
        msgType = 'sell'
        titleType = 'Buyers'
    }
    embed.color = '#F1C40F'
    embed.title = `${embed.itemName} ${titleType} (Page ${
        embed.currentPage
    }/${Math.round(embed.data[embed.currentRank].length / 5)})`
    embed.fields = []
    embed.data[embed.currentRank]
        .slice(5 * (embed.currentPage - 1), 5 * embed.currentPage)
        .map((item) =>
            embed.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to ${msgType}: ${embed.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
    return embed
}

const decreaseRank = (embed) => {
    if (embed.currentRank <= 0) return embed
    embed.currentRank--
    embed.currentPage = 1
    let msgType, titleType, rankMessage
    rankMessage = `[ Item Rank : ${embed.currentRank} ]`
    embed.rankMessage = rankMessage
    embed.footer.text = `${embed.guildName} Discord ${embed.rankMessage}`
    if (embed.type === BUY_TYPE) {
        msgType = 'buy'
        titleType = 'Sellers'
    } else {
        msgType = 'sell'
        titleType = 'Buyers'
    }
    embed.color = '#F1C40F'
    embed.title = `${embed.itemName} ${titleType} (Page ${
        embed.currentPage
    }/${Math.round(embed.data[embed.currentRank].length / 5)})`
    embed.fields = []
    embed.data[embed.currentRank]
        .slice(5 * (embed.currentPage - 1), 5 * embed.currentPage)
        .map((item) =>
            embed.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to ${msgType}: ${embed.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
    return embed
}

const nextPage = (embed) => {
    if (embed.currentPage >= Math.round(embed.data[embed.currentRank].length / 5))
        return embed
    embed.currentPage++
    let msgType, titleType, rankMessage
    if (embed.maximumRank) rankMessage = `[ Item Rank : ${embed.currentRank} ]`
    else rankMessage = ''
    if (embed.type === BUY_TYPE) {
        msgType = 'buy'
        titleType = 'Sellers'
    } else {
        msgType = 'sell'
        titleType = 'Buyers'
    }
    embed.color = '#F1C40F'
    embed.title = `${embed.itemName} ${titleType} (Page ${
        embed.currentPage
    }/${Math.round(embed.data[embed.currentRank].length / 5)})`
    embed.fields = []
    embed.data[embed.currentRank]
        .slice(5 * (embed.currentPage - 1), 5 * embed.currentPage)
        .map((item) =>
            embed.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to ${msgType}: ${embed.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
    return embed
}

const previousPage = (embed) => {
    if (embed.currentPage === 1) return embed
    embed.currentPage--
    let msgType, titleType, rankMessage
    if (embed.maximumRank) rankMessage = `[ Item Rank : ${embed.currentRank} ]`
    else rankMessage = ''
    if (embed.type === BUY_TYPE) {
        msgType = 'buy'
        titleType = 'Sellers'
    } else {
        msgType = 'sell'
        titleType = 'Buyers'
    }
    embed.color = '#F1C40F'
    embed.title = `${embed.itemName} ${titleType} (Page ${
        embed.currentPage
    }/${Math.round(embed.data[embed.currentRank].length / 5)})`
    embed.fields = []
    embed.data[embed.currentRank]
        .slice(5 * (embed.currentPage - 1), 5 * embed.currentPage)
        .map((item) =>
            embed.fields.push({
                name: `Quantity : ${item.quantity} | Price : ${item.platinum} platinum. ${rankMessage}`,
                value: `/w ${item.user.ingame_name} Hi! I want to ${msgType}: ${embed.itemName} for ${item.platinum} platinum. (warframe.market)`,
                inline: false,
            }),
        )
    return embed
}

const refreshEmbed = (embed) =>
    getPriceEmbed(embed.itemName).then((embeds) => {
        if (embed.type === BUY_TYPE) return embeds.sell
        return embeds.buy
    })

module.exports = {
    getPriceEmbed,
    increaseRank,
    decreaseRank,
    nextPage,
    previousPage,
    refreshEmbed,
}
