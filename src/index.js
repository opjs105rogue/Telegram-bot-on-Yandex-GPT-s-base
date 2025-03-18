import dotenv from 'dotenv'
import { repository } from './utils.js'

dotenv.config();

const requestBody = {
    "modelUri": `gpt://${process.env.FOLDER_ID}/yandexgpt`,
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

const getTextCompletion = async (IamToken) => {
  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${repository.value}`
    },
    body: JSON.stringify(requestBody), 
  })

  const result = await response.json();
  return result;
}

async function main() {
    await repository.init(process.env.OAuthToken)
    const compl = await getTextCompletion(repository.value);
    console.log(`compl.result.alternatives: ${compl.result.alternatives[0].message.text}`)
}
main()
