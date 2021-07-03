import { DateTime } from 'luxon'
import api from './API'

const filterTime = string => {
    const newstring = string.replace(/\s*\d+s/, '')
    if (newstring) return newstring
    return '<1m'
}

const buildArbitrationMessage = (arbitration) => {
    try {
        let remainingTime = Math.round(
            DateTime.fromISO(arbitration.activation)
                .plus({ hours: 1 })
                .diff(DateTime.local().setZone('UTC'), 'minutes').values.minutes,
        )
        if (!remainingTime) remainingTime = '<1'
        const message =
      '**Arbitration**\n```• ' +
      `${arbitration.type.replace('Dark Sector ', '')} at ${
          arbitration.node
      }\n• Reset in ${remainingTime} ` +
      'minutes```'
        return message
    } catch (err) {
        return '**Arbitration**\n```• Loading...```'
    }
}

const buildCycleMessage = (earth, cetus, vallis, cambion) =>
    '**Server Time**\n```• Earth : ' +
  `${earth.state}\n• Reset in ${filterTime(earth.timeLeft)}` +
  '```\n```• Cetus : ' +
  `${cetus.state}\n• Reset in ${filterTime(cetus.timeLeft)}` +
  '```\n```• Orb Vallis : ' +
  `${vallis.state}\n• Reset in ${filterTime(vallis.timeLeft)}` +
  '```\n```• Cambion Drift : ' +
  `${cambion.active}\n• Reset in ${filterTime(cetus.timeLeft)}` +
  '```'

const buildSentientOutpostsMessage = (sentientOutposts) => {
    try {
        let remainingTime = Math.round(
            DateTime.fromISO(sentientOutposts.expiry).diff(
                DateTime.local().setZone('UTC'),
                'minutes',
            ).values.minutes,
        )
        if (!remainingTime) remainingTime = '<1'
        return (
            '**Sentient Anomaly**\n```• ' +
      `${sentientOutposts.mission.node}\n• Reset in ${remainingTime} minutes` +
      '```'
        )
    } catch (err) {
        return '**Sentient Anomaly**\n```• Loading...```'
    }
}

const buildNewsMessage = (news) => {
    const newsObject = {}
    news.reverse().some((element) => {
        if ('en' in element.translations) {
            newsObject.url = element.link
            newsObject.message =
        '```• ' +
        `${element.translations.en}\n• ${filterTime(element.eta)}` +
        '```'
            return newsObject
        }
    })
    return newsObject
}

const buildEmbed = () =>
    Promise.all([
        api.fetchArbitration(),
        api.fetchEarthCycle(),
        api.fetchCetusCycle(),
        api.fetchVallisCycle(),
        api.fetchCambionDriftCycle(),
        api.fetchSentientOutposts(),
        api.fetchNews(),
    ]).then(
        ([arbitration, earth, cetus, vallis, cambion, sentientOutposts, news]) => {
            const embed = {}
            embed.title = '[PC] Latest Warframe News'
            let newsObject = buildNewsMessage(news)
            embed.description = `${newsObject.message}\n${buildArbitrationMessage(
                arbitration,
            )}\n${buildCycleMessage(
                earth,
                cetus,
                vallis,
                cambion,
            )}\n${buildSentientOutpostsMessage(sentientOutposts)}`
            embed.url = newsObject.url
            embed.color = '#F1C40F'
            return embed
        },
    )

const getFissure = (tier = 'Lith') =>
    api.fetchVoidFissure().then((response) => {
        const embedObject = {}
        embedObject.title = `${tier} Missions`
        embedObject.fields = []
        response
            .filter((fissure) => fissure.tier === tier)
            .map((fissure) =>
                embedObject.fields.push({
                    name: `Available : ${filterTime(fissure.eta)}`,
                    value: `[${fissure.missionType}] ${fissure.node}`,
                    inline: false,
                }),
            )
        embedObject.color = '#F1C40F'
        return embedObject
    })

module.exports = { buildEmbed, getFissure }
