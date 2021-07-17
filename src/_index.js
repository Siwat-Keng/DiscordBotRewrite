import 'dotenv/config'
import { buildEmbed } from './services/warframeStatus'

buildEmbed().then(embed => console.log(embed))