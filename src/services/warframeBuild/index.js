import { fetchBuild, fetchDefaultBuild } from './API'

const BASE_URL = 'https://overframe.gg'

const getBuildMessage = async itemName => {
    const defaultBuilds = await fetchDefaultBuild(itemName)
    if (defaultBuilds.length){
        return defaultBuilds.map( build => ({
            title: build.title,
            description: 'กดที่หัวข้อ เพื่อดูรายละเอียด',
            url: `${BASE_URL}${build.url}`,
            footer: {
                text: `By ${build.author.username} [ ${build.formas} Forma ] [ Vote : ${build.score} ]`,
            },
            color: '#F1C40F',
        }))
    } 
    const builds = await fetchBuild(itemName)
    if (builds.length) {
        return builds.map( build => ({
            title: build.title,
            description: 'กดที่หัวข้อ เพื่อดูรายละเอียด',
            url: `${BASE_URL}${build.url}`,
            footer: {
                text: `By ${build.author.username} [ ${build.formas} Forma ] [ Vote : ${build.score} ]`,
            },
            color: '#F1C40F',
        }))
    } else return [{
        title: 'ไม่พบ build',
        description: 'กรุณาลองตรวจสอบชื่อ item อีกครั้ง',
        color: '#F1C40F',
    }]
}

module.exports = { getBuildMessage }
