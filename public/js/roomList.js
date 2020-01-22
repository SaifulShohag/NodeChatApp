const socket = io()

// Templates
const roomTemplate = document.querySelector('#roomList-template').innerHTML

socket.on('roomList', ({rooms}) => {
    const html = Mustache.render(roomTemplate, {
        rooms
    })
    document.querySelector('#roomList').innerHTML = html
}) 