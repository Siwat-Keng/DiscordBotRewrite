import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const MemberSchema = new mongoose.Schema({
    guild_id: {
        type: String,
        require: true,
    },
    member_tag: {
        type: String,
        require: true,
    },
    member_id: {
        type: String,
        require: true,
    },
    in_game_name: {
        type: String,
    },
    name: {
        type: String,
    },
    age: {
        type: String,
    },
    clan: {
        type: String,
    },
}, {
    timestamps: true,
})

MemberSchema.index({ guild_id: 1, member_id: 1 })

const member = mongoose.model('Member', MemberSchema)

module.exports = { Model: member }