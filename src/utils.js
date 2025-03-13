async function getIamToken() {
    const IamToken = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            yandexPassportOauthToken: process.env.OAuthToken
        })
    }).catch(error => console.error(`Ошибка: ${error}`))
    
    const data = await IamToken.json();
    return data;
}

export const repository = {
    value: null,
    timer: null,
    async init(token) {
        const ONE_HOUR = 2000; //1000 * 3600;
        const setIamToken = async () => {
            const {iamToken} = await getIamToken(token);
            this.value = iamToken;
        }
        await setIamToken();

        this.timer = setInterval(async () => {
            await setIamToken();
        }, ONE_HOUR)
    }, 
    destroy() {
        this.timer && clearInterval(this.timer);
    }
}