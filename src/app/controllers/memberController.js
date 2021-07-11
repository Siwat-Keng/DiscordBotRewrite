import Guild from '../models/GuildModel'
import Member from '../models/MemberModel'

import { embedTemplateParser } from '../../libs/stringTemplate'

import response from '../../locales/response.json'

const memberJoin = async member => {
    const guildData = await Guild.Model.findOne({ guild_id: member.guild.id }).lean()
    const memberData = await Member.Model.findOne( { guild_id: member.guild.id, member_id: member.id }).lean()
    if (guildData.channels?.intro_channel_id && !memberData) {
        const introChannel = await member.guild.client.channels.fetch(guildData.channels.intro_channel_id)
        member.send({ 
            embed: embedTemplateParser(response.introduce.require, {
                'member.display_name': member.displayName,
                'intro_channel.name': introChannel.name,

            }),
        }).catch(async () => {
            const introChannel = await member.guild.client.channels.fetch(guildData.channels.intro_channel_id)
            introChannel.send(member.user.toString(), { 
                embed: embedTemplateParser(response.introduce.require, {
                    'member.display_name': member.displayName,
                    'intro_channel.name': introChannel.name,
    
                }),
            })
                .then(message => setTimeout(message.delete, 180000))
                .catch(error => console.error(error))
        })
    }
    if (memberData) {
        if (guildData.roles?.member_id) {
            const memberRole = await member.guild.roles.fetch(guildData.roles.member_id)
            member.roles.add(memberRole)
        }
        member.send({ 
            embed: embedTemplateParser(response.introduce.already, {
                'member.display_name': member.displayName,
                name: unescape(memberData.name),
                age: unescape(memberData.age),
                ign: unescape(memberData.in_game_name),
                clan: unescape(memberData.clan),
            }),
        })
    }
    else if (guildData.roles?.waiting_intro_id && !memberData) {
        const waitingRole = await member.guild.roles.fetch(guildData.roles.waiting_intro_id)
        member.roles.add(waitingRole)
    }
}

const memberLeave = member => console.log(`${member.user.tag}(${member.id}) left ${member.guild.name} server.`)

module.exports = { memberJoin, memberLeave }