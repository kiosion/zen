const socket = io(`${window.location.host}`)
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('msgform')
const messageInput = document.getElementById('message-input')
const usrnameForm = document.getElementById('usrnameform')
const usrnameInput = document.getElementById('usrname-input')

// Mokey patch socket.emit to log all events emitted over the websocket
const emit = socket.emit
socket.emit = function() {
  emit.apply(socket, arguments)
  console.debug(`[SOCKET] Emitted event: '${arguments[0]}'`)
}

window.addEventListener('keydown', (e) => {
  if (usrnameForm.style.display === 'block') {
    window.activeElement !== usrnameInput && usrnameInput.focus()
  } else if (messageForm.style.display === 'block') {
    window.activeElement !== messageInput && messageInput.focus()
  }
})

//get time
const getTime = (timestamp, format = 'time') => {
  let d = new Date(timestamp)
  let hr = ('0'.concat(d.getHours())).substr(-2)
  let min = ('0'.concat(d.getMinutes())).substr(-2)
  let s = ('0'.concat(d.getSeconds())).substr(-2)
  const getWeekday = weekday => {
    return {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday'
    }[weekday]
  }
  const getMonth = month => {
    return {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    }[month]
  }
  let weekday = getWeekday(d.getDay())
  let month = getMonth(d.getMonth())
  let day = d.getDate()
  let year = d.getFullYear()
  let hours = d.getHours()
  let minutes = ('0'.concat(d.getMinutes())).substr(-2)
  let seconds = ('0'.concat(d.getSeconds())).substr(-2)

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (format == "time") return string = "[" + hr + ":" + min + "]"
  if (format == "fulltime") return string = `${weekday}, ${day} ${month}, ${year} at ${hours}:${minutes}`
}

//random gen
function randomGen() {
  let S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}

//prompt for username
function getUsrname() {
  messageForm.style.display = "none"
  usrnameForm.style.display = "block"
  usrnameForm.addEventListener('submit', e => {
    e.preventDefault()
    input = usrnameInput.value
    //check that usrname is unique
    usrnameForm.style.display = "none"
    messageForm.style.display = "block"
    messageForm.focus()
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

//if msgform exists
if (messageForm != null) {
  const messageContainer = document.getElementById('message-container')

  var usrname = ""
  socket.emit('new-user', roomName)

  messageForm.style.display = "none"
  usrnameForm.style.display = "block"
  usrnameForm.addEventListener('submit', e => {
    e.preventDefault()
    usrname = usrnameInput.value
    usrname = usrname.trim()
    usrname = cleanString(usrname)
    //console.log("usrname set to: " + input)
    usrnameForm.style.display = "none"
    messageForm.style.display = "block"
    doStuff()
  })

  function doStuff() {
    if (usrname == (null || "" || "null" || "Null")) {
      console.log("usrname is not set")
      setTimeout(doStuff, 1000)
      return
    }

    appendMessage(`Welcome, ${usrname}!`)
    socket.emit('usrname-set', roomName, usrname)
    //event listener for sending msg
    messageForm.addEventListener('submit', e => {
      e.preventDefault()
      const message = messageInput.value
      if (message.trim() === '') return
      const timestamp = Date.now()
      appendChat((timestamp), (`You`), (`${message}`))
      socket.emit('send-chat-message', timestamp, roomName, message)
      messageInput.value = ''
    })

    //stuff
    socket.on('user-connected', usrname => {
      console.debug(`${usrname} joined`)
      appendMessage(`${usrname} joined`)
    })
    socket.on('user-disconnected', usrname => {
      console.debug(`${usrname} left`)
      appendMessage(`${usrname} left`)
    })
    socket.on('chat-message', data => {
      console.debug(`Message from ${data.usrname}: ${data.message}`)
      appendChat((data.timestamp), (`${data.usrname}`), (`${data.message}`))
    })
    socket.on('error', data => {
      if (data.errorcode == 404) {
        console.debug(`Error: ${data.errorcode} - ${data.errormsg}`)
        window.location.href = window.location.host
      }
      
    })

    //append new msgs
    function appendMessage(msg) {
      const mark = document.createElement('mark')
      const p = document.createElement('p')
      const messageDiv = document.createElement('div')
      const sdfh = document.createTextNode(`${msg}`)
      mark.appendChild(sdfh)
      p.appendChild(mark)
      messageDiv.appendChild(p)
      messageContainer.append(messageDiv)
    }
    function appendChat(timestamp, usrn, msg) {
      const mark = document.createElement('mark')
      const p = document.createElement('p')
      const messageDiv = document.createElement('div')
      let time = getTime((timestamp), ("time")) //render timestamp as time
      let date = getTime((timestamp), ("fulltime")) //render timestamp as date
      let id = randomGen()
      msg = cleanString(msg)
      const gkjj = document.createTextNode(`${time} ${usrn}: `)
      mark.appendChild(gkjj)
      p.appendChild(mark)
      const sdfl = document.createTextNode(`${msg}`)
      p.appendChild(sdfl)
      messageDiv.appendChild(p)
      //messageDiv.innerHTML = `<p><mark>${time} ${usrn}: </mark>${msg}</p>`
      messageDiv.setAttribute("id", id)  
      messageDiv.setAttribute("title", date)
      messageContainer.append(messageDiv)
      document.getElementById(id).scrollIntoView()
    }
  }

}

//copy room link on click
function copy() {
  let inp = document.createElement('input')
  document.body.appendChild(inp)
  inp.value = window.location.href
  inp.select()
  document.execCommand('copy', false)
  inp.remove()
}
