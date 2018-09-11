import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { CONNECT, READY, MESSAGE, MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';
import config from './config';
import getUserMedia from './getUserMedia';
import * as robot from 'robotjs';

let peers = {};

const socket = io(config.server.host, {
  query: {
    token: config.channel
  }
});

function handlerPeer(peer, socket) {
  peer.on('signal', signal => socket.emit(MESSAGE, JSON.stringify({
    state: CONNECT,
    signal
  })))

  peer.on('close', () => peer.destroy());
}

function onMessage(data) {
  console.log(data);

  const { state, signal, peerId, mouse, button, double, keys } = JSON.parse(data);

  if (state === READY) {
    getUserMedia()
      .then((stream) => {
        peers[peerId] = new SimplePeer({ initiator: true, stream });
        handlerPeer(peers[peerId], socket);
      });
  } 
  else if (state === CONNECT) {
    peers[peerId].signal(signal);
  }
  else if (state === MOUSE_MOVE) {
    const { x: X, y: Y } = robot.getMousePos();

    robot.moveMouse(X + mouse.x, Y + mouse.y);
  }
  else if (state === MOUSE_CLICK) {
    robot.mouseClick(button, double);
  } 
  else if (state === KEY_PRESS) {
    const { alt, ctrl, shift, meta, code, string } = keys;

    if (alt) robot.keyToggle('alt', 'down');
    if (ctrl) robot.keyToggle('control', 'down');
    if (shift) robot.keyToggle('shift', 'down');
    if (meta) robot.keyToggle('command', 'down');

    if (string) robot.typeString(string);

    if (alt) robot.keyToggle('alt', 'up')
    if (ctrl) robot.keyToggle('control', 'up')
    if (shift) robot.keyToggle('shift', 'up')
    if (meta) robot.keyToggle('command', 'up')
  }
}

socket.on(MESSAGE, onMessage);
