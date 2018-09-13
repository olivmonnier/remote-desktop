import { MOUSE_MOVE, MOUSE_CLICK } from './constants';

let startX, startY, endX, endY, diffX, diffY;

export default function (peer) {
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('click', onClick);


  function onTouchStart(e) {
    startX = getCoord(e, 'X');
    startY = getCoord(e, 'Y');
    diffX = 0;
    diffY = 0;
  }
  
  function onTouchMove(e) {
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

  function onClick(e) {
    peer.send(JSON.stringify({
      state: MOUSE_CLICK,
      button: 'left',
      double: false
    }))
  }
  
  function getCoord(e, c) {
    return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
  }
}
