
const generateMessage =(username,text)=>{
    console.log(username, text)
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
};

const generatelocationMessage = (username,url) =>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generatelocationMessage
}