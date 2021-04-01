const socket = io();
 
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector("#location");
const $messages = document.querySelector("#messages");
const $joinForm = document.querySelector("#join-form");
const $joinFormButton = document.querySelector("#joinButton");
// const $location = document.querySelector("#currentLocation");
//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-message-template").innerHTML;
const userListTemplate = document.querySelector("#userList-template").innerHTML;

const {username , room } = Qs.parse(location.search,{ ignoreQueryPrefix:true});

$locationButton.addEventListener("click",()=>{
    $locationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position);
        const latitude = position.coords.latitude;;
        const longitude = position.coords.longitude;
        socket.emit("currentLocation",{latitude,longitude},()=>{
            $locationButton.removeAttribute('disabled');
            console.log("The location was shared.");
        });
    })
})
// Jenny_Taborda's
$messageForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    $messageFormButton.setAttribute("disabled","disabled");
    // console.log("Form submitted", event.target.inputmessage.value);
    message = event.target.inputmessage.value;
    socket.emit("message", message,()=>{
        console.log("the message was delivered!");
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = "";
        $messageFormInput.focus();
    });
})


//autoScroll logic

const autoScroll = ()=>{
    //new message element
    const newMessage = $messages.lastElementChild;

    //new message height
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    
    const visibleHeight = $messages.offsetHeight;
    //height of message container 
    const containerHeight = $messages.scrollHeight;
    //howfar i have scrolled 
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }



}

socket.on("sendLocation",(message)=>{
    console.log(message, message.username);
    const locationHtml = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a" )
    });
    $messages.insertAdjacentHTML('beforeEnd',locationHtml);
    autoScroll();
})
socket.on("sendMessage",(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeEnd',html);
    autoScroll();
})
socket.emit("join",{username, room},(error)=>{
    if(error){
        console.log("error occured:", error);
    }
});

socket.on("sendUserList",({room,userList})=>{
    console.log("userList: ",userList," room: ",room);
    const html = Mustache.render(userListTemplate,{
        room:room,
        users:userList
    });
    document.querySelector("#sidebar").innerHTML = html;
})