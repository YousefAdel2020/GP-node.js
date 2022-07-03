require("dotenv").config();
const express = require("express")
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT;
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('view engine', 'ejs')

app.locals.user = null;

// Database
client = require('./config/db');

app.use('/api/auth', authRoutes);


server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});

const jwt = require('jsonwebtoken');

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`);
  socket.on('getusername', (cb) => {
    let token = '';
    let user_id = '';

    const cookies = socket.handshake.headers.cookie.split(';');
    cookies.forEach((cookie) => {

      let [key, value] = cookie.split('=');
      if(key.trim() == "jwt")
        token = value;
      if(key.trim() == "user_id")
        user_id = value
    })

    // const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    console.log('user_id is ' + user_id)
    // cb(socket.request.user ? socket.request.user.username : '');
    cb(user_id ? user_id : '');

  });

  socket.on('joinRoom', ({ room }) => {
    socket.join(room);

  });

  friends = []

  client.query('SELECT * from public.auth_user', (err, data) => {
    if (err) {
      console.log("error", err.stack)
    } else {
      // console.log("Suc", data.rows)
      friends = data.rows
      socket.emit('getfriends', friends)
    }
  })

  

  // Listen for chatMessage
  socket.on('chatMessage', ({username, room, msg}) => {
    console.log(username);
    io.to(room).emit('message', formatMessage(username, msg));
  });

});

function formatMessage(username, text) {
  return {
    username,
    text,
  };
}

app.use('/chat', chatRoutes)