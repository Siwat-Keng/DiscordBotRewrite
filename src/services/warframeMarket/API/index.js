import fetch from 'node-fetch'
import stringSimilarity from 'string-similarity'

const BASE_PRICE_API_URL = 'https://api.warframe.market/v1/items/'
const BASE_USER_URL = 'https://warframe.market/items/'
const BASE_ITEM_API_URL = 'https://api.warframe.market/v1/'

const getItems = () =>
    fetch(`${BASE_ITEM_API_URL}items`)
        .then(response => response.json())
        .then(body => body.payload.items)

const getClosestMatchItem = (name) => {
    let bestMatchItem
    let bestMatchScore = 0.3
    return getItems().then((items) => {
        items.map((item) => {
            if (
                stringSimilarity.compareTwoStrings(name, item.item_name) >=
                stringSimilarity.compareTwoStrings(name, item.url_name) &&
                stringSimilarity.compareTwoStrings(name, item.item_name) >
                bestMatchScore
            ) {
                bestMatchItem = item
                bestMatchScore = stringSimilarity.compareTwoStrings(
                    name,
                    item.item_name,
                )
            } else if (
                stringSimilarity.compareTwoStrings(name, item.url_name) >
                stringSimilarity.compareTwoStrings(name, item.item_name) &&
                stringSimilarity.compareTwoStrings(name, item.url_name) > bestMatchScore
            ) {
                bestMatchItem = item
                bestMatchScore = stringSimilarity.compareTwoStrings(
                    name,
                    item.url_name,
                )
            }
        })
        if (bestMatchScore) return bestMatchItem
    })
}

const getPriceData = (name) =>
    getClosestMatchItem(name).then(item =>
        fetch(`${BASE_PRICE_API_URL}${item.url_name}/orders?include=item`)
            .then(response => response.json())
            .then(order => {
                const orders = order.payload.orders.filter(item => item.user.status === 'ingame')
                let priceData = {}
                priceData.itemName = item.item_name
                priceData.url = `${BASE_USER_URL}${item.url_name}`
                priceData.maximumRank = -1
                priceData.buy = [...Array(11).keys()].map(() => [])
                priceData.sell = [...Array(11).keys()].map(() => [])
                orders.map((order) => {
                    if (order.mod_rank) {
                        priceData[order.order_type][order.mod_rank].push(order)
                        if (order.mod_rank > priceData.maximumRank)
                            priceData.maximumRank = order.mod_rank
                    } else priceData[order.order_type][0].push(order)
                })
                priceData.buy.map((items) => {
                    items.sort((item1, item2) => {
                        if (item1.platinum > item2.platinum) return -1
                        else if (item1.platinum < item2.platinum) return 0
                        return 1
                    })
                })
                priceData.sell.map((items) => {
                    items.sort((item1, item2) => {
                        if (item1.platinum > item2.platinum) return 1
                        else if (item1.platinum < item2.platinum) return 0
                        return -1
                    })
                })
                return priceData
            }))

module.exports = { getPriceData }
