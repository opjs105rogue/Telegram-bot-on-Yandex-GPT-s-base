import dotenv from 'dotenv';
import {getTextCompletion} from './utils/yandexFetches.js';
import { repository } from './utils/getIamTokenUtil.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'; //-
import {getReplyId} from './utils/telegramModules.js'

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


bot.on('message', async (ctx) => {
    const replyId = getReplyId(ctx);

    switch(ctx.text) {
        case '/role':
            contextStore[replyId] = contextStore[replyId] || DEFAULT_USER_STATE;
            contextStore[replyId].isWaitungFor = "role";
            return ctx.reply('Выберите роль помощника');
        default:
            const isWaitungForRole = contextStore[replyId]?.isWaitungFor === 'role';
            if(isWaitungForRole) {
                contextStore[replyId].isWaitungFor = null;
                contextStore[replyId].role = ctx.text;
                return ctx.reply(`Для помощника выбрана роль: ${ctx.text}`);
            }

            if(!contextStore[replyId]) {
                return ctx.reply(`Нет контекста для пользователя с ID: ${replyId}`)
            }

            ctx.reply(await getTextCompletion({
                iamToken: repository.value,
                folderId: process.env.FOLDER_ID,
                model: 'yandexgpt/latest',
                role: contextStore[replyId].role,
                message: [
                    {
                        role: 'user',
                        text: ctx.text
                    }
                ]
            }))
            
            ctx.reply(alternatives[0].message.text, {parse_mode: 'MarkdownV2'})

            return ctx.reply(``)
    }})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

/** 
*@type{Record<number, { isWaitungFor?: 'role'; role:string; messages: Array<{role: 'user' | 'assistant'; text: string }>}>} 
*/
const contextStore = {
    
}

const DEFAULT_USER_STATE = {
    isWaitungFor: null,
    role:null,
    messages: [],
};

async function main() {
    await repository.init(process.env.OAuthToken)
    const compl = await getTextCompletion(repository.value);
    console.log(`YandexGPTassistent: ${compl.result.alternatives[0].message.text}`)
}
main()
