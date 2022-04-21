const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const port = process.env['PORT'] || 3000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const type = {
  PUBLIC: 0,
  PRIVATE: 1
}

const rooms = {
  public: {
    users: {},
    type: type.PUBLIC
  },
  private: {
    users: {},
    type: type.PRIVATE
  }
}

app.get('/', (req, res) => {
  const filtered = {}
  Object.keys(rooms).forEach(room => {
    if (rooms[room].type === type.PUBLIC) {
      filtered[room] = rooms[room]
    }
  })
  res.render('index', { rooms: filtered })
});

app.post('/join', (req, res) => {
  if (rooms[req.body.room]) {
    return res.redirect(`/${req.body.room}`)
    //if room exists
  } else {
    //stay on index, give error
    //return res.redirect(`/?errorCode=404&errorMessage=Invalid Room Code!`)
    return res.redirect('/')
  }
});

app.post('/create', (req, res) => {
  //gen random string for room name
  const generated = Math.ceil((Math.random()*0xFFFFFFFFFFFF)).toString(36).split('').map((v)=>Math.round(Math.random())?v.toUpperCase():v.toLowerCase()).join('');
  rooms[generated] = { users: {} }
  res.redirect(`/${generated}`);
});

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.render('room', { roomName: req.params.room });
});

server.listen(port);

io.on('connection', socket => {

  socket.on('new-user', (room) => {
    if (!room) return;
    socket.join(room);
    rooms[room].users[socket.id] = `tmp-${socket.id}`;
    console.log(`User connected to ${room}`);
  })

  socket.on('usrname-set', (room, usrname) => {
    if (!room || !usrname || (rooms[room].users[socket.id] != `tmp-${socket.id}`) || usrname == '') return;
    if (!rooms[room]) {
      socket.emit('server-error', {code: 404, message: 'Not found.'});
      return;
    }
    // TODO: If username is already in use in specified room
    rooms[room].users[socket.id] = usrname
    console.log(`${usrname} set username in ${room}`)
    socket.to(room).emit('user-connected', usrname)
    //create room on usrname set if not exist
    if (!rooms[room]) {
      // send msg that new room was created or smthing idk
      console.log(`Room '${room}' created`);
    }
  })

  socket.on('send-chat-message', (timestamp, room, message) => {
    if (!room || !message || !timestamp) return;
    if (!rooms[room]) {
      socket.emit('server-error', {code: 404, message: 'Not found.'});
      return;
    }
    // If username is tmp
    if ((rooms[room]).users[socket.id] == `tmp-${socket.id}`) return;
    console.log(`New message in ${room} from '${rooms[room].users[socket.id]}': ` + message);
    socket.to(room).emit('chat-message', { timestamp: timestamp, usrname: rooms[room].users[socket.id], message: message });
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      if (rooms[room].users[socket.id] == `tmp-${socket.id}`) return; //if username is tmp
      //socket.broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
      //delete room if everyone leaves
      const roomFull = room.users;
      if (!roomFull & !(room == 'public')) delete rooms[room];
      console.log(`Room '${room}' deleted`);
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
