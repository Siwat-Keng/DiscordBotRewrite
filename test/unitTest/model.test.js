/* eslint-env jest */

import Guild from '../../src/app/models/GuildModel'
import mongoose from 'mongoose'
import 'dotenv/config'

describe('Guild Model Test', () => {

    const mockGuild = {
        guild_id: '9999999',
        prefix: '#',
        timezone: 'mockTimezone',
        alert_channel_id: 'alert_channel_id',
        intro_channel_id: 'intro_channel_id',
        command_channel_id: 'command_channel_id',
    }

    beforeAll(() => {
        mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}?${process.env.MONGODB_OPTION}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true,
        })

    })

    afterEach(() =>
        Guild.Model.deleteOne({ guild_id: mockGuild.guild_id }),
    )

    afterAll(() =>
        mongoose.connection.close(),
    )

    it('Create New Guild success', async () => {
        await Guild.Model(mockGuild).save()
        const result = await Guild.Model.findOne({ guild_id: mockGuild.guild_id }).lean()

        expect(result).toMatchObject(mockGuild)
    })

    it('Remove Guild success', async () => {
        await Guild.Model(mockGuild).save()
        await Guild.Model.deleteOne({ guild_id: mockGuild.guild_id })
        const result = await Guild.Model.findOne({ guild_id: mockGuild.guild_id }).lean()

        expect(result).toBeNull()
    })

    it('Update data success', async () => {
        const newPrefix = 'prefix'
        await Guild.Model(mockGuild).save()
        await Guild.Model.updateOne({ guild_id: mockGuild.guild_id }, { prefix: newPrefix })
        const result = await Guild.Model.findOne({ guild_id: mockGuild.guild_id }).lean()

        expect(result.prefix).toEqual(newPrefix)
        expect(result.guild_id).toEqual(mockGuild.guild_id)
        expect(result.alert_channel_id).toEqual(mockGuild.alert_channel_id)
        expect(result.intro_channel_id).toEqual(mockGuild.intro_channel_id)
        expect(result.command_channel_id).toEqual(mockGuild.command_channel_id)
        expect(result.timezone).toEqual(mockGuild.timezone)
    })
})