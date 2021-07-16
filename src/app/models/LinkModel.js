import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const LinkSchema = new mongoose.Schema({
    channel_id: {
        type: String,
        require: true,
        unique: true,
    },
    linked_channels: [String],
})

LinkSchema.index({ channel_id: 1 })

const linked = mongoose.model('Linked', LinkSchema)

module.exports = { Model: linked }