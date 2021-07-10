import { DateTime } from 'luxon'

const memberEmbed = member => ({
    title: unescape(member.member_tag),
    description: `ชื่อ : ${unescape(member.name)}\nอายุ : ${unescape(member.age)}\nIGN : ${unescape(member.in_game_name)}\nClan : ${unescape(member.clan)}`,
    footer: {
        text: `Discord ID : ${member.member_id}\nDate : ${DateTime.fromISO(member.updatedAt.toISOString()).toFormat('ff')}`,
    },
})

module.exports = { memberEmbed }