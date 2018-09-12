import { MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';

const $video = document.querySelector('video');
const mouseButtons = {
  0: 'left',
  1: 'middle',
  2: 'right'
}

$video.requestPointerLock = $video.requestPointerLock ||
$video.mozRequestPointerLock ||
$video.webkitPointerLockElement;

export default function(peer) {
  $video.addEventListener('click', function() {
    $video.requestPointerLock();
  });
  
  document.addEventListener('pointerlockchange', lockChange, false);
  document.addEventListener('mozpointerlockchange', lockChange, false);
  document.addEventListener('webkitpointerlockchange', lockChange, false);

  function lockChange() {
    if (document.pointerLockElement === $video) {
      document.addEventListener('mousemove', sendPosition, false);
      document.addEventListener('click', sendClick, false);
      document.addEventListener('dblclick', sendDblClick, false);
      document.addEventListener('keypress', sendKeyPressed, false);
    } else {
      document.removeEventListener('mousemove', sendPosition, false);
      document.removeEventListener('click', sendClick, false);
      document.removeEventListener('dblclick', sendDblClick, false);
      document.removeEventListener('keypress', sendKeyPressed, false);
    }
  }
  
  function sendPosition(ev) {
    peer.send(JSON.stringify({
      state: MOUSE_MOVE,
      mouse: { x: ev.movementX, y: ev.movementY }
    }))
  }
  
  function sendClick(ev) {
    peer.send(JSON.stringify({
      state: MOUSE_CLICK,
      button: mouseButtons[ev.button],
      double: false
    }))
  }
  
  function sendDblClick(ev) {
    peer.send(JSON.stringify({
      state: MOUSE_CLICK,
      button: mouseButtons[ev.button],
      double: true
    }))
  }
  
  function sendKeyPressed(ev) {
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
}
