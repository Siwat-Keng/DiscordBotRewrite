import { getTimeStamp } from '../libs/timer'
import stringSimilarity from 'string-similarity'
import wordListed from '../locales/format.json'

const splitter = /[: ]+/

const splitSentence = (string) => {
    const result = {}
    string.split('\n').map((s) => {
        let splitted = s.split(splitter)
        let bestMatchScore = -Infinity
        let bestMatchWord
        Object.keys(wordListed.introduceKeywords).map((word) => {
            let currentBestMatch = stringSimilarity.findBestMatch(
                splitted[0].toLowerCase(),
                wordListed.introduceKeywords[word],
            ).bestMatch
            if (currentBestMatch.rating > bestMatchScore) {
                bestMatchScore = currentBestMatch.rating
                bestMatchWord = word
            }
        })
        result[bestMatchWord] = splitted.slice(1).join(' ')
    })
    return result
}

const checkSentence = (message) => {
    const userIntro = splitSentence(message.content)
    if (JSON.stringify(Object.keys(userIntro).sort()) === JSON.stringify(Object.keys(wordListed.introduceKeywords).sort())) 
        return Object.assign( { author_id: message.author.id, timestamp: getTimeStamp('utc') }, userIntro )
    return false
}

module.exports = { checkSentence }
