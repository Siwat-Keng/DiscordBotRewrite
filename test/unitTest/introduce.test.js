/* eslint-env jest */

import { checkSentence } from '../../src/libs/introduceChecker'

describe('Introduce Test', () => {

    it('Introduce success', () => {
        const name = 'myname'
        const age = '0'
        const ign = 'mygame'
        const clan = 'myclan'
        const message = {
            author: {
                id: 9999,
            },
            content: `ชื่อ : ${name}\nอายุ: ${age}\nign: ${ign}\nclan: ${clan}`,
        }
        const result = checkSentence(message)

        expect(name).toEqual(result.Name)
        expect(age).toEqual(result.Age)
        expect(ign).toEqual(result.Ign)
        expect(clan).toEqual(result.Clan)
        expect(message.author.id).toEqual(result.author_id)
    })

    it('Introduce fail', () => {
        const message = {
            author: {
                id: 9999,
            },
            content: '',
        }
        const result = checkSentence(message)

        expect(result).toBe(false)
    })
})