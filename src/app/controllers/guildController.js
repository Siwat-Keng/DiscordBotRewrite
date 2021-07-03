import Guild from '../models/GuildModel'

const guildJoin = guild => 
    Guild.Model.findOneAndUpdate(
        {
            guild_id: guild.id,
        },
        { 
            guild_id: guild.id,
        },
        { 
            upsert: true, 
            new: true, 
        },
    )


const guildLeave = guild => console.log(`${guild.me.displayName} left ${guild.name}!`)

module.exports = { guildJoin, guildLeave }