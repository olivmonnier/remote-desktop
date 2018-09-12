import Peer from 'simple-peer';
import io from 'socket.io-client';
import initDesktopEvents from './desktopEvents';
import initTouchEvents from './touchEvents';
import { CONNECT, READY, MESSAGE } from './constants';

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
    socket.emit(MESSAGE, JSON.stringify({
      state: CONNECT,
      peerId: peer._id,
      signal
    }))
  })
  peer.on('stream', function (stream) {
    const video = document.querySelector('#remoteVideos')
    video.srcObject = stream
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
  initDesktopEvents(peer);
  initTouchEvents(peer);

  socket.emit(MESSAGE, JSON.stringify({
    state: READY,
    peerId: peer._id
  }));
}

function onMessage(data) {
  console.log(data);

  const { state, signal } = JSON.parse(data)

  if (state === CONNECT && !peer.connected) {
    peer.signal(signal);
  }
}

socket.on('connect', onConnect);
socket.on(MESSAGE, onMessage);