import Peer from 'simple-peer';
import io from 'socket.io-client';

let peer;

const socket = io(window.location.origin, {
  query: {
    token: getRoom()
  }
});

function getRoom() {
  let room = localStorage.getItem('channel');

  if (!room) {
    room = prompt('Enter a room');

    if (room !== '') {
      localStorage.setItem('channel', room);
    }
  }

  return room;
}

function handlerPeer(peer, socket) {
  peer.on('signal', signal => {
    socket.emit('message', JSON.stringify({
      state: 'connect',
      peerId: peer._id,
      signal
    }))
  })
  peer.on('stream', function (stream) {
    const video = document.querySelector('#remoteVideos')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
  peer.on('close', () => {
    peer.destroy()
  })
}

function onConnect() {
  if (peer && !peer.destroyed) {
    peer.destroy();
  }
  peer = new Peer();
  handlerPeer(peer, socket);

  socket.emit('message', JSON.stringify({
    state: 'ready',
    peerId: peer._id
  }));
}

function onMessage(data) {
  console.log(data);

  const { state, signal } = JSON.parse(data)

  if (state === 'connect' && !peer.connected) {
    peer.signal(signal);
  }
}

socket.on('connect', onConnect);
socket.on('message', onMessage);