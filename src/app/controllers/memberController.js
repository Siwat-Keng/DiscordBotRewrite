import Guild from '../models/GuildModel'
import Member from '../models/MemberModel'

const memberJoin = async member => {
    const guildData = await Guild.Model.findOne({ guild_id: member.guild.id }).lean()
    const memberData = await Member.Model.findOne( { guild_id: member.guild.id, user_id: member.id }).lean()
    if (guildData.channels.intro_channel_id && !memberData) console.log('need introduce!')
    else if (guildData.channels.intro_channel_id && memberData) console.log('welcome back sir!')
}

const memberLeave = member => console.log(`${member.user.tag}(${member.id}) left ${member.guild.name} server.`)

module.exports = { memberJoin, memberLeave }