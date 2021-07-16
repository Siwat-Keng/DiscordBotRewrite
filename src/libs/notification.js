import { DateTime } from 'luxon'
import 'dotenv/config'

const normallized = (time) => {
    const currentTime = DateTime.local().setZone(process.env.DEFAULT_TIMEZONE)
    if (currentTime < time) return time.diff(currentTime).values.milliseconds
    return time.plus({ week: 1 }).diff(currentTime).values.milliseconds
}

const getNotificationTimeout = () => {
    const rivenSliverTimeout = normallized(DateTime.fromObject({ hour:7, weekday: 4 }, { zone: process.env.DEFAULT_TIMEZONE }))
    const helminthTimeout = normallized(DateTime.fromObject({ hour:7, weekday: 1 }, { zone: process.env.DEFAULT_TIMEZONE }))
    return {
        helminthTimeout,
        rivenSliverTimeout,
    }
}

module.exports = { getNotificationTimeout }