const socket = io('http://localhost:3000')

const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('msgform')
const messageInput = document.getElementById('message-input')
const usrnameForm = document.getElementById('usrnameform')
const usrnameInput = document.getElementById('usrname-input')

//get time
function getTime() {
    var d = new Date()
    var hr = d.getHours()
    var min = d.getMinutes()
    var s = d.getSeconds()
    if (min < 10) {
        min = "0" + min;
    }
    var date = d.getDate();
    return string = "[" + hr + ":" + min + ":" + s + "]"
}

//random gen
function randomGen() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//prompt for username
function getUsrname() {
    messageForm.style.display = "none";
    usrnameForm.style.display = "block";
    usrnameForm.addEventListener('submit', e => {
        e.preventDefault()
        input = usrnameInput.value
        //console.log("usrname set to: " + input)
        usrnameForm.style.display = "none";
        messageForm.style.display = "block";
        messageForm.focus();
        return input
    })
}

//replace evil chars
function cleanString(stinky) {
    //clean = stinky.replace(/[<]/g,'&lt;')
    //clean = clean.replace(/[>]/g,'&gt;')
    clean = stinky
    return clean
}

//if form exists and usrname is set
if (messageForm != null) {
    const messageContainer = document.getElementById('message-container')
    //prompt for name, eventally change to not-shitty stupid browser popup window
    //const usrname = prompt('Enter display name:')

    //var usrname = getUsrname()
    //console.log("usrname set to: "+usrname)

    var usrname = ""

    messageForm.style.display = "none";
    usrnameForm.style.display = "block";
    usrnameForm.addEventListener('submit', e => {
        e.preventDefault()
        usrname = usrnameInput.value
        usrname = cleanString(usrname)
        //console.log("usrname set to: " + input)
        usrnameForm.style.display = "none";
        messageForm.style.display = "block";
        doStuff()
    })

    function doStuff() {
        if (usrname == (null || "" || " " || "null" || "Null")) {
            console.log("usrname is not set")
            setTimeout(doStuff, 1000)
            return
        }

        appendMessage(`Welcome, ${usrname}!`)
        socket.emit('new-user', roomName, usrname)
        //event listener for sending msg
        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendChat(usrn=(`You`), msg=(`${message}`))
            socket.emit('send-chat-message', roomName, message)
            messageInput.value = ''
        })
        //stuff
        socket.on('user-connected', usrname => {
            appendMessage(`${usrname} joined`)
        })
        socket.on('user-disconnected', usrname => {
            appendMessage(`${usrname} left`)
        })
        socket.on('chat-message', data => {
            appendChat(usrn=(`${data.usrname}`), (`${data.message}`))
        })
        //append new msgs
        function appendMessage(msg) {
            const messageDiv = document.createElement('div')
            messageDiv.innerHTML = `<p><mark>${msg}</mark></p>`
            messageContainer.append(messageDiv)
        }
        function appendChat(usrn, msg) {
            const mark = document.createElement('mark')
            const p = document.createElement('p')
            const messageDiv = document.createElement('div')
            var time = getTime()
            var id = randomGen()
            msg = cleanString(msg)
            const gkjj = document.createTextNode(`${time} ${usrn}: `)
            mark.appendChild(gkjj)
            p.appendChild(mark)
            const sdfl = document.createTextNode(`${msg}`)
            p.appendChild(sdfl)
            messageDiv.appendChild(p)
            //messageDiv.innerHTML = `<p><mark>${time} ${usrn}: </mark>${msg}</p>`
            messageDiv.setAttribute("id", `${id}`)
            messageContainer.append(messageDiv)
        }
    }
}

//copy room link on click
function copy(){
    var inp =document.createElement('input');
    document.body.appendChild(inp)
    inp.value = window.location.href
    inp.select();
    document.execCommand('copy',false);
    inp.remove();
}

socket.on('room-created', room => {
    //const roomElement = document.createElement('div')
    //roomElement.innerText = room
    //const roomLink = document.createElement('a')
    //roomLink.href = `/${room}`
    //roomLink.innerText = 'Join'
    //roomElement = roomElement + ' > ' + roomLink
    //roomContainer.append(roomElement)
    //roomContainer.append(roomLink)
})
