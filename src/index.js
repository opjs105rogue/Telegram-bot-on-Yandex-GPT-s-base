import dotenv from 'dotenv'
import {repository} from './utils.js'

dotenv.config();

const request = {
    "modelUri": "gpt://procces.env.FOLDER_ID/yandexgpt",
    "completionOptions": {
      "stream": false,
      "temperature": 0.6,
      "maxTokens": "2000",
      "reasoningOptions": {
        "mode": "DISABLED"
      }
    },
    "messages": [
      {
        "role": "system",
        "text": "Найди ошибки в тексте и исправь их"
      },
      {
        "role": "user",
        "text": "Ламинат подойдет для укладке на кухне или в детской комнате – он не боиться влаги и механических повреждений благодаря защитному слою из облицованных меламиновых пленок толщиной 0,2 мм и обработанным воском замкам."
      }
    ]
  }

async function main() {
    console.log(typeof repository.value);
    await repository.init(process.env.OAuthToken)
    console.log(typeof repository.value);
}

main()
