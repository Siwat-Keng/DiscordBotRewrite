import fetch from 'node-fetch'

const BASE_URL = `https://api.warframestat.us/${process.env.PLATFORM}`

const fetchArbitration = () =>
    fetch(`${BASE_URL}/arbitration`).then(response => response.json())

const fetchCambionDriftCycle = () =>
    fetch(`${BASE_URL}/cambionCycle`).then((response) => response.json())

const fetchCetusCycle = () =>
    fetch(`${BASE_URL}/cetusCycle`).then((response) => response.json())

const fetchEarthCycle = () =>
    fetch(`${BASE_URL}/earthCycle`).then((response) => response.json())

const fetchVoidFissure = () =>
    fetch(`${BASE_URL}/fissures`).then((response) => response.json())

const fetchNews = () =>
    fetch(`${BASE_URL}/news`).then((response) => response.json())

const fetchRiven = () =>
    fetch(`${BASE_URL}/rivens`).then((response) => response.json())

const fetchSentientOutposts = () =>
    fetch(`${BASE_URL}/sentientOutposts`).then((response) => response.json())

const fetchSortie = () =>
    fetch(`${BASE_URL}/sortie`).then((response) => response.json())

const fetchVallisCycle = () =>
    fetch(`${BASE_URL}/vallisCycle`).then((response) => response.json())

const fetVoidTrader = () =>
    fetch(`${BASE_URL}/voidTrader`).then((response) => response.json())

module.exports = {
    fetchArbitration,
    fetchCambionDriftCycle,
    fetchCetusCycle,
    fetchEarthCycle,
    fetchVoidFissure,
    fetchNews,
    fetchRiven,
    fetchSentientOutposts,
    fetchSortie,
    fetchVallisCycle,
    fetVoidTrader,
}
