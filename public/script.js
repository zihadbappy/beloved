const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '3000'
  })

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    
    socket.on('user-connected',(userId) => {
        connectToNewUser(userId, stream)
    })
}).catch(err=>{ console.log(err)})


myPeer.on('open', id => {
    console.log('user:' ,id )
    socket.emit('join-room', ROOM_ID, id)
})



function connectToNewUser(userId, stream) {
    console.log('user connected:' , userId )
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
  }