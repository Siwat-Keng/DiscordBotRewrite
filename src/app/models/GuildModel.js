import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const GuildSchema = new mongoose.Schema({
    guild_id: {
        type: String,
        require: true,
        unique: true,
    },
    prefix: {
        type: String,
        default: process.env.DEFAULT_PREFIX,
        require: true,
    },
    channels: {
        notify_channel_id: {
            type: String,
        },
        alert_channel_id: {
            type: String,
        },
        intro_channel_id: {
            type: String,
        },
        command_channel_id: {
            type: String,
        },
        share_channels: [String],
    },
    roles: {
        waiting_intro_id: {
            type: String,
        },
        member_id: {
            type: String,
        },
        helminth: {
            type: String,
        },
        riven_sliver: {
            type: String,
        },
    },
    notifications: {
        helminth: {
            type: Boolean,
            default: false,
        },
        riven_sliver: {
            type: Boolean,
            default: false,
        },
    },
})

GuildSchema.index({ guild_id: 1 })

const guild = mongoose.model('Guild', GuildSchema)

module.exports = { Model: guild }
