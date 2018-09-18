import { MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';

let startX, startY, endX, endY, diffX, diffY, latesttap, taptimeout;

export default function (peer) {
  const $actions = document.querySelector('#actions');
  const $keyboard = document.querySelector('#keyboard');
  const $btnCloseKeyboard = document.querySelector('#keyboard .close');
  const $input = document.querySelector('#keyboard input');
  const $btnKeyboard = document.createElement('button');

  $btnKeyboard.textContent = 'Keyboard';
  $btnKeyboard.id = 'btnKeyboard';

  $actions.appendChild($btnKeyboard);

  $btnKeyboard.addEventListener('click', onShowKeyboard);
  $btnCloseKeyboard.addEventListener('click', onHideKeyboard);
  $input.addEventListener('change', onChange);

  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('click', onClick);

  function onShowKeyboard() {
    $keyboard.classList.add('show');
    $input.focus();
  }

  function onHideKeyboard() {
    $keyboard.classList.remove('show');
  }

  function onChange(ev) {
    ev.preventDefault();

    const string = $input.value
  
    peer.send(JSON.stringify({
      state: KEY_PRESS,
      keys: { string }
    }))
  }

  function onTouchStart(e) {
    e.preventDefault();

    startX = getCoord(e, 'X');
    startY = getCoord(e, 'Y');
    diffX = 0;
    diffY = 0;
  }
  
  function onTouchMove(e) {
    e.preventDefault();

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
    e.preventDefault();

    const now = new Date().getTime();
    const timesince = now - latesttap;

    if ((timesince < 500) && (timesince > 0)) {
      peer.send(JSON.stringify({
        state: MOUSE_CLICK,
        button: 'left',
        double: true
      }))
      clearTimeout(taptimeout);
    } else {
      taptimeout = setTimeout(() => {
        peer.send(JSON.stringify({
          state: MOUSE_CLICK,
          button: 'left',
          double: false
        }))
      }, 550)
    }
        
    latesttap = new Date().getTime();
  }
  
  function getCoord(e, c) {
    return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
  }
}
