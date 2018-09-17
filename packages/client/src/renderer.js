import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { CONNECT, READY, MESSAGE, MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';
import config from './config';
import getUserMedia from './getUserMedia';
import * as robot from 'robotjs';

let peers = {};

const SPECIAL_KEYS = new Map([
  [8, 'backspace'],
  [9, 'tab'],
  [13, 'enter'],
  [27, 'escape'],
  [37, 'left'],
  [38, 'up'],
  [39, 'right'],
  [40, 'down']
]);
const socket = io(config.server.host, {
  query: {
    token: config.channel
  }
});

function handlerPeer(peer, socket) {
  peer.on('signal', signal => socket.emit(MESSAGE, JSON.stringify({
    state: CONNECT,
    signal
  })));

  peer.on('data', function(data) {
    const d = JSON.parse(data.toString('utf8'));

    console.log(d);

    const { state, mouse, button, double, keys } = d;

    if (state === MOUSE_MOVE) {
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
  
      if (SPECIAL_KEYS.has(code)) {
        robot.keyTap(SPECIAL_KEYS.get(code));
      }
      else if (string) {
        robot.typeString(string);
      } 
  
      if (alt) robot.keyToggle('alt', 'up');
      if (ctrl) robot.keyToggle('control', 'up');
      if (shift) robot.keyToggle('shift', 'up');
      if (meta) robot.keyToggle('command', 'up');
    }
  });

  peer.on('close', () => peer.destroy());
}

function onMessage(data) {
  console.log(data);

  const { state, signal, peerId } = JSON.parse(data);

  if (state === READY) {
    getUserMedia()
      .then((stream) => {
        peers[peerId] = new SimplePeer({ initiator: true, stream });
        handlerPeer(peers[peerId], socket);
      });
  } 
  else if (state === CONNECT) {
    if (peers[peerId]) {
      peers[peerId].signal(signal);
    }
  }
}

socket.on(MESSAGE, onMessage);
