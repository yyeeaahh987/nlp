import fetch from 'node-fetch';

const GPT_DOMAIN = process.env.GPT_DOMAIN
const GPT_TOKEN = process.env.GPT_TOKEN

export async function sendMsg(content: any) {
    try {
        let requestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant."
                },
                {
                    "role": "user",
                    "content": content
                }
            ]
        }
        const response = await postRequest(`${GPT_DOMAIN}/v1/chat/completions`, requestBody)
        const data = await response.json()
        console.log(`data`, data.choices)
        if (data.choices.length > 0) {
            return data.choices[0]?.message?.content ?? ''
        }
        return ""
    } catch (error) {
        return ""
    }
}

async function getRequest(requestUrl: any) {
    const response = await fetch(requestUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_TOKEN}`
        },
    });
    return response
}

async function postRequest(requestUrl: any, body: any) {
    const response = await fetch(requestUrl, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_TOKEN}`
        }
    });
    return response
}