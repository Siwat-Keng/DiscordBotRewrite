const warframeMarketFooter = ({ embed, guild }) => {
    embed.footer = {}
    embed.footer.text = `${guild.name} Discord ${embed.rankMessage}`
    embed.guildName = guild.name
    return setIcon({ embed, guild })
}

const setIcon = ({ embed, guild }) => {
    if (!embed.footer) embed.footer = {}
    embed.footer.icon_url = `${guild.iconURL()}`
    return embed
}

module.exports = { warframeMarketFooter, setIcon }