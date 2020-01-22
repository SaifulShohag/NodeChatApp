const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/message') 
const { generateLocation } = require('./utils/location')
const { addUsers, removeUser, getUser, getUsersInRoom, getUserRooms } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    io.emit('roomList', { rooms: getUserRooms() })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocation(user, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('join', ({ username, room }, callback) => {
        const {error, user} = addUsers({id: socket.id, username, room})
        if(error){ 
            return callback(error)
        }
 
        socket.join(user.room)
        
        io.emit('roomList', { rooms: getUserRooms() })
        socket.emit('message', generateMessage({username: "Server"}, `Welcome ${user.username}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage(user, `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.emit('roomList', { rooms: getUserRooms() })
            io.to(user.room).emit('message', generateMessage(user, `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})