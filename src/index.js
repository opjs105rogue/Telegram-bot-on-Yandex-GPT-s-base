import dotenv from 'dotenv';
import {getTextCompletion} from './utils/yandexFetches.js';
import { repository } from './utils/getIamTokenUtil.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'; //-

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on(message('text'), async (ctx) => {
    const userText = ctx.message.text;
    const response = await getTextCompletion(userText);
    ctx.reply(response.result.alternatives[0].message.text);
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

async function main() {
    await repository.init(process.env.OAuthToken)
    const compl = await getTextCompletion(repository.value);
}
main()
