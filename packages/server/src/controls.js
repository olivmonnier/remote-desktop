import { MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';

const mouseButtons = {
  0: 'left',
  1: 'middle',
  2: 'right'
}

export function sendPosition(ev, peer) {
  peer.send(JSON.stringify({
    state: MOUSE_MOVE,
    mouse: { x: ev.movementX, y: ev.movementY }
  }))
}

export function sendClick(ev, peer) {
  peer.send(JSON.stringify({
    state: MOUSE_CLICK,
    button: mouseButtons[ev.button],
    double: false
  }))
}

export function sendDblClick(ev, peer) {
  peer.send(JSON.stringify({
    state: MOUSE_CLICK,
    button: mouseButtons[ev.button],
    double: true
  }))
}

export function sendKeyPressed(ev, peer) {
  ev.preventDefault();
  
  const alt = ev.altKey || false
  const ctrl = ev.ctrlKey || false
  const shift = ev.shiftKey || false
  const meta = ev.metaKey || false
  const code = ev.which || ev.keyCode
  const string = String.fromCharCode(code);

  peer.send(JSON.stringify({
    state: KEY_PRESS,
    keys: { alt, ctrl, shift, meta, code, string }
  }))
}