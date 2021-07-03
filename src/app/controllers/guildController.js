import Guild from '../models/GuildModel'

const guildJoin = async guild => {
    const guildData = await Guild.Model.findOne({ guild_id: guild.id}).lean()
    if (!guildData) await Guild.Model({ guild_id: guild.id }).save()
}

const guildLeave = guild => console.log(`${guild.me.displayName} left ${guild.name}!`)

module.exports = { guildJoin, guildLeave }