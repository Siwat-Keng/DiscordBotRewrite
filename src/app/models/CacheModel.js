import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const CacheSchema = new mongoose.Schema({
    guild_id: {
        type: String,
        require: true,
        unique: true,
    },
    alert_message_id: {
        type: String,
    },
})

CacheSchema.index({ guild_id: 1 })

const cache = mongoose.model('Cache', CacheSchema)

module.exports = { Model: cache }