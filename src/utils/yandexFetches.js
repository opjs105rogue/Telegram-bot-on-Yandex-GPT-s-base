import dotenv from 'dotenv'
import { repository } from './getIamTokenUtil.js'

dotenv.config();

const getTextCompletion = async (userText, options = {}) => {
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
        role: "user",
        text: userText ,
      },
      {
        role: "assistant",
        text: 'text'
      }
    ]
    }), 
  })

  const result = await response.json();
  return result;
}

export { getTextCompletion };