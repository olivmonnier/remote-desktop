import { MOUSE_MOVE } from './constants';

let startX, startY, endX, endY, diffX, diffY;

export default function (peer) {
  document.addEventListener('touchstart', onTouchStart(peer));
  document.addEventListener('touchmove', onTouchMove(peer));
}

function onTouchStart(peer) {
  return function(e) {
    startX = getCoord(e, 'X');
    startY = getCoord(e, 'Y');
    diffX = 0;
    diffY = 0;
  }
}

function onTouchMove(peer) {
  return function(e) {
    endX = getCoord(e, 'X');
    endY = getCoord(e, 'Y');
    diffX = endX - startX;
    diffY = endY - startY;
  
    peer.send(JSON.stringify({
      state: MOUSE_MOVE,
      mouse: { x: diffX, y: diffY }
    }));
    
    startX = endX;
    startY = endY;
  }
}

function getCoord(e, c) {
  return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
}