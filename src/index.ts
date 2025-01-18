import dotenv from "dotenv"

dotenv.config();

async function getToken() {
    const token = await fetch("https://iam.api.cloud.yandex.net/iam/v1/tokens", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify({
            yandexPassportOauthToken: process.env.OAuthToken, 
        }),
    });
    const data = await token.json();
    return data;
}

async function main() {
    const token = await getToken();

    console.log(`>> ${token.iamToken.length}`) //Select-Object -ExpandProperty iamToken
}

main()

