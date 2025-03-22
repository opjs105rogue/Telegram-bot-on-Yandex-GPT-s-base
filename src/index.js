import dotenv from 'dotenv'
import { repository } from './utils.js'

dotenv.config();

const getTextCompletion = async (options = {}) => {
  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${repository.value}`
    },
    body: JSON.stringify({
      "modelUri": `gpt://${process.env.FOLDER_ID}/yandexgpt`,
    "completionOptions": {
      "stream": false,
      "temperature": 0.6,
      "maxTokens": "48000",
      "reasoningOptions": {
        "mode": "DISABLED"
      }
    },
    "messages": [
      {
        "role": "system",
        "text": options.role,
      },
      ...options.messages
    ]
    }), 
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
