import dotenv from 'dotenv';
import {getTextCompletion} from './utils/yandexFetches.js';
import { repository } from './utils/getIamTokenUtil.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN)

await bot.telegram.setMyCommands([
    {
        command: '/start',
        description: 'Сброс контекста'
    },
    {
        command: '/reset',
        description: 'Сброс контекста'
    },
    {
        command: '/role',
        description: 'Задать prompt для роли'
    }
])


bot.on(message, (ctx) => ctx.reply('Hello World!'))
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
