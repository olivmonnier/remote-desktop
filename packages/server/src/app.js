import Peer from 'simple-peer';
import io from 'socket.io-client';
import { CONNECT, READY, MESSAGE, MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';

let peer;
const $video = document.querySelector('video');
const socket = io(window.location.origin, {
  query: {
    token: getRoom()
  }
});
const mouseButtons = {
  0: 'left',
  1: 'middle',
  2: 'right'
}

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

$video.requestPointerLock = $video.requestPointerLock ||
$video.mozRequestPointerLock ||
$video.webkitPointerLockElement;

$video.addEventListener('click', function() {
  $video.requestPointerLock();
});

document.addEventListener('pointerlockchange', lockChange, false);
document.addEventListener('mozpointerlockchange', lockChange, false);
document.addEventListener('webkitpointerlockchange', lockChange, false);

function lockChange() {
  if (document.pointerLockElement === $video) {
    console.log('The pointer lock status is now locked');
    document.addEventListener('mousemove', sendPosition, false);
    document.addEventListener('click', sendClick, false);
    document.addEventListener('dblclick', sendDblClick, false);
    document.addEventListener('keypress', sendKeyPressed, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    document.removeEventListener('mousemove', sendPosition, false);
    document.removeEventListener('click', sendClick, false);
    document.removeEventListener('dblclick', sendDblClick, false);
    document.addEventListener('keypress', sendKeyPressed, false);
  }
}

function sendPosition(e) {
  socket.emit(MESSAGE, JSON.stringify({
    state: MOUSE_MOVE,
    mouse: { x: e.movementX, y: e.movementY }
  }));
}

function sendClick(e) {
  socket.emit(MESSAGE, JSON.stringify({
    state: MOUSE_CLICK,
    button: mouseButtons[e.button],
    double: false
  }))
}

function sendDblClick(e) {
  socket.emit(MESSAGE, JSON.stringify({
    state: MOUSE_CLICK,
    button: mouseButtons[e.button],
    double: true
  }))
}

function sendKeyPressed(e) {
  const alt = e.altKey || false
  const ctrl = e.ctrlKey || false
  const shift = e.shiftKey || false
  const meta = e.metaKey || false
  const code = e.which || e.keyCode
  const string = e.target.value

  socket.emit(MESSAGE, JSON.stringify({
    state: KEY_PRESS,
    keys: { alt, ctrl, shift, meta, code, string }
  }));
}