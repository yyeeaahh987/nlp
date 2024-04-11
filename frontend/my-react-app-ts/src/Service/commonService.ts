const REACT_APP_GPT_DOMAIN= process.env.REACT_APP_GPT_DOMAIN

export const sendMsgToGpt = async (content:any) => {
    let requestBody={
        content,
    }
    console.log(`REACT_GPT_DOMAIN`,REACT_APP_GPT_DOMAIN)
    let response = await fetch(`${REACT_APP_GPT_DOMAIN}/gptRouter/sendMsg`, {
        method: 'post',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response)
    if(response.status===200){
        let result = await response.json()
        console.log(`result`, result)
        return result
    }
    return ""
  };
  