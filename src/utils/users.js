const users = []
const rooms = []

addUsers = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return { error: 'username and room are required!'}
    }

    const existUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existUser) {
        return { error: 'A user with this username already exist!'}
    }

    const user = { id, username, room }
    users.push(user);
    
    let check = true
    rooms.forEach(el => {
        if(el.room === user.room){
            check = false
        }
    })
    if(check){
        rooms.push({
            room: user.room,
            activeUser: getUsersInRoom(user.room).length
        })
    }
    if(rooms.length > 0 && !check){
        const index = rooms.findIndex(el => el.room === user.room)
        rooms[index].activeUser = getUsersInRoom(user.room).length
        console.log(getUsersInRoom(user.room))
    }

    return { user }
}

removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index !== -1){
        const user = users[index]
        console.log(getUsersInRoom(user.room).length)
        if(getUsersInRoom(user.room).length < 2){
            const ind = rooms.findIndex(el => el.room === user.room)
            rooms.splice(ind, 1);
        }
        return users.splice(index, 1)[0]
    }
}

getUser = (id) => {
    return users.find(user => user.id === id)
}

getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

getUserRooms = () => {
    return rooms
}

module.exports = { addUsers, removeUser, getUser, getUsersInRoom, getUserRooms }