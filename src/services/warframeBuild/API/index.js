import fetch from 'node-fetch'
import stringSimilarity from 'string-similarity'

const BASE_URL = 'https://overframe.gg/api/v1/'
const CATEGORY = ['Suits', 'LongGuns', 'Melee', 'Pistols', 'SpaceSuits', 'Sentinels', 'MoaPets']

const getItemByName = name =>
    fetch(`${BASE_URL}items?limit=9999`)
        .then(response => response.json())
        .then(json => {
            let bestMatchItem
            let bestMatchScore = 0.3
            json
                .results
                .filter(item => CATEGORY.includes(item.category))
                .map(item => {
                    if (
                        stringSimilarity.compareTwoStrings(item.name, name.toUpperCase()) > bestMatchScore
                    ) {
                        bestMatchItem = item
                        bestMatchScore = stringSimilarity.compareTwoStrings(
                            item.name,
                            name.toUpperCase(),
                        )
                    }
                })
            return bestMatchItem
        })

const fetchBuild = name =>
    getItemByName(name).then(item =>
        fetch(`${BASE_URL}builds?item_id=${item.id}&sort_by=Score`)
            .then(response => response.json())
            .then(json => json.results.slice(0, 5)),
    ).catch(() => [])

const fetchDefaultBuild = name =>
    getItemByName(name).then(item =>
        fetch(`${BASE_URL}builds?item_id=${item.id}&author_id=10027`)
            .then(response => response.json())
            .then(json => json.results),
    ).catch(() => [])

module.exports = { fetchBuild, fetchDefaultBuild }