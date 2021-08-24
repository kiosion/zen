const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }
})

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { Public: { users: {} } }

app.get('/', (req, res) => {
    res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
        //tell usr that room exists
    }
    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)
    // send msg that new room was created or smthing idk
    io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room })
})

server.listen(3000) //listen on port

io.on('connection', socket => {
    socket.on('new-user', (room, usrname) => {
        socket.join(room)
        rooms[room].users[socket.id] = usrname
        socket.to(room).emit('user-connected', usrname)
    })
    socket.on('send-chat-message', (room, message) => {
        console.log(`New message in ${room} from '${rooms[room].users[socket.id]}': ` + message)
        socket.to(room).emit('chat-message', { message: message, usrname: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.broadcast.emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
            //delete room if everyone leaves
            const roomFull = room.users
            if (!roomFull & !(room == 'Public')) delete rooms[room]
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}