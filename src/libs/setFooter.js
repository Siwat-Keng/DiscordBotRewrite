const warframeMarketFooter = ({ embed, guild }) => {
    embed.footer = {}
    embed.footer.text = `${guild.name} Discord ${embed.rankMessage}`
    embed.footer.icon_url = `${guild.iconURL()}`
    embed.guildName = guild.name
    return embed
}

module.exports = { warframeMarketFooter }