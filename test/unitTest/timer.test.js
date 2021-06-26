/* eslint-env jest */

import 'dotenv/config'
import { getCurrentDateTime, getTimeFromFormat, getTimeStamp, getDateTimeFromString } from '../../src/libs/timer'

describe('Timer Test', () => {

    it('getCurrentDateTime', () => {
        const americaTime = getCurrentDateTime({ zone:'America/Los_Angeles' })
        const thaiTime = getCurrentDateTime()
        
        expect(americaTime < thaiTime).toBe(true)
    })

    it('getTimeStamp', () => {
        const timeStamp = getTimeStamp()
        
        expect(timeStamp).not.toBeNull()
    })

    it('getTimeFromFormat', () => {
        const timeFormat = getTimeFromFormat({ format:'hh:mm:ss a' })

        expect(timeFormat).not.toBeNull()
    })

    it('getDateTimeFromString', () => {
        const newString = getDateTimeFromString({string:'06:03:08', oldFormat:'HH:mm:ss', newFormat:'hh:mm a'})

        expect(newString).toEqual('06:03 AM')
    })
})