import { DateTime } from 'luxon'

const memberEmbed = member => ({
    title: unescape(member.member_tag),
    description: `ชื่อ : ${unescape(member.name)}\nอายุ : ${unescape(member.age)}\nIGN : ${unescape(member.in_game_name)}\nClan : ${unescape(member.clan)}`,
    footer: {
        text: `Discord ID : ${member.member_id}\nDate : ${DateTime.fromISO(member.updatedAt.toISOString()).toFormat('ff')}`,
    },
})

const messageLinkEmbed = message => ({
    author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL(),
    },
    description: message.cleanContent,
    image: {
        url: message.attachments?.first()?.url,
    },
    footer: {
        text: `${message.guild.name} [Server]`,
        icon_url: message.guild.iconURL(),
    },
    timestamp: new Date(),
    color: 0x6495ed,
})

module.exports = { memberEmbed, messageLinkEmbed }