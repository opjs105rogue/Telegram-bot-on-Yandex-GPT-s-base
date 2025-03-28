import dotenv from 'dotenv';
import {getTextCompletion} from './utils/yandexFetches.js';
import { repository } from './utils/getIamTokenUtil.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message, (ctx) => ctx.reply('Hello World!'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

async function main() {
    await repository.init(process.env.OAuthToken)
    const compl = await getTextCompletion(repository.value);
    console.log(`YandexGPTassistent: ${compl.result.alternatives[0].message.text}`)
}
main()
