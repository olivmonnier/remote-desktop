import { MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from './constants';

let startX, startY, endX, endY, diffX, diffY, latesttap, taptimeout;

export default function (peer) {
  const $btnCloseKeyboard = document.querySelector('#keyboard .close');
  const $input = document.querySelector('#keyboard input');

  const handleInputChange = (ev) => onChange(ev, peer);
  const handleTouchStart = (ev) => onTouchStart(ev, peer);
  const handleTouchMove = (ev) => onTouchMove(ev, peer);
  const handleClick = (ev) => onClick(ev, peer);

  createBtnKeyboard();

  $btnCloseKeyboard.addEventListener('click', onHideKeyboard);
  $input.addEventListener('change', handleInputChange);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('click', handleClick);
}

function createBtnKeyboard() {
  const $actions = document.querySelector('#actions');
  const $btnKeyboard = document.createElement('button');

  $btnKeyboard.textContent = 'Keyboard';
  $btnKeyboard.id = 'btnKeyboard';

  $actions.appendChild($btnKeyboard);

  $btnKeyboard.addEventListener('click', onShowKeyboard);
}

function onShowKeyboard() {
  const $keyboard = document.querySelector('#keyboard');
  const $input = document.querySelector('#keyboard input');

  $keyboard.classList.add('show');
  $input.focus();
  $input.setSelectionRange(0, $input.value.length);
}

function onHideKeyboard() {
  const $keyboard = document.querySelector('#keyboard');

  $keyboard.classList.remove('show');
}

function onChange(ev, peer) {
  ev.preventDefault();

  const string = ev.target.value

  peer.send(JSON.stringify({
    state: KEY_PRESS,
    keys: { string }
  }))
}

function onTouchStart(ev) {
  ev.preventDefault();

  startX = getCoord(ev, 'X');
  startY = getCoord(ev, 'Y');
  diffX = 0;
  diffY = 0;
}

function onTouchMove(ev, peer) {
  ev.preventDefault();

  endX = getCoord(ev, 'X');
  endY = getCoord(ev, 'Y');
  diffX = endX - startX;
  diffY = endY - startY;

  peer.send(JSON.stringify({
    state: MOUSE_MOVE,
    mouse: { x: diffX, y: diffY }
  }));
  
  startX = endX;
  startY = endY;
}

function onClick(ev, peer) {
  ev.preventDefault();

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

function getCoord(ev, c) {
  return /touch/.test(ev.type) ? (ev.originalEvent || ev).changedTouches[0]['page' + c] : ev['page' + c];
}
