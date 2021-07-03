import { DateTime } from 'luxon'
import 'dotenv/config'

const getCurrentDateTime = ({ zone } = { zone: process.env.DEFAULT_TIMEZONE }) => {
    return DateTime.local().setZone(zone)
}

const getTimeStamp = () => {
    return getCurrentDateTime().ts
}

const getTimeFromFormat = ({ format, zone } = { format, zone: process.env.DEFAULT_TIMEZONE }) => {
    return getCurrentDateTime({zone}).toFormat(format)
}

const getDateTimeFromString = ({ string, oldFormat, newFormat, zone} = { string, oldFormat, newFormat, zone: process.env.DEFAULT_TIMEZONE }) => {
    return DateTime.fromFormat(string, oldFormat, {
        zone,
    }).toFormat(newFormat)
}


module.exports = { getCurrentDateTime, getTimeFromFormat, getTimeStamp, getDateTimeFromString }
