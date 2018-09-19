import {
  sendKeyPressed,
  sendPosition,
  sendClick
} from './controls';
import getCoordinates from './utils/getCoordinates';

let startX, startY, endX, endY, diffX, diffY, latesttap, taptimeout;

export default function () {
  const $btnCloseKeyboard = document.querySelector('#keyboard .close');
  const $input = document.querySelector('#keyboard input[type="text"]');
  const $btnEnter = document.querySelector('#btnEnter');
  const $btnTab = document.querySelector('#btnTab');
  const $btnBackspace = document.querySelector('#btnBackspace');

  const handleInputChange = (ev) => onChange(ev, window.peer);
  const handleInputFocus = (ev) => onFocus(ev, window.peer);
  const handleBtnEnterPressed = (ev) => onBtnEnterPressed(ev, window.peer);
  const handleBtnTabPressed = (ev) => onBtnTabPressed(ev, window.peer);
  const handleBtnBackspacePressed = (ev) => onBtnBackspacePressed(ev, window.peer);
  const handleTouchStart = (ev) => onTouchStart(ev, window.peer);
  const handleTouchMove = (ev) => onTouchMove(ev, window.peer);
  const handleClick = (ev) => onClick(ev, window.peer);

  createBtnKeyboard();

  $input.addEventListener('change', handleInputChange);
  $input.addEventListener('focus', handleInputFocus);
  $btnEnter.addEventListener('click', handleBtnEnterPressed);
  $btnTab.addEventListener('click', handleBtnTabPressed);
  $btnBackspace.addEventListener('click', handleBtnBackspacePressed);
  $btnCloseKeyboard.addEventListener('click', onHideKeyboard);
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
  const $input = document.querySelector('#keyboard input[type="text"]');

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

  const ctrl = document.querySelector('#keyCTRL').checked;
  const alt = document.querySelector('#keyALT').checked;
  const shift = document.querySelector('#keySHIFT').checked;
  const string = ev.target.value;
  const code = string.length === 1 ? string.charCodeAt(0) : null;

  return sendKeyPressed(peer)({ ctrl, alt, shift, string, code });
}

function onFocus(ev) {
  ev.preventDefault();

  ev.target.setSelectionRange(0, ev.target.value.length);
}

function onTouchStart(ev) {
  ev.preventDefault();

  startX = getCoordinates(ev, 'X');
  startY = getCoordinates(ev, 'Y');
  diffX = 0;
  diffY = 0;
}

function onTouchMove(ev, peer) {
  ev.preventDefault();

  endX = getCoordinates(ev, 'X');
  endY = getCoordinates(ev, 'Y');
  diffX = endX - startX;
  diffY = endY - startY;

  sendPosition(peer)(diffX, diffY);
  
  startX = endX;
  startY = endY;
}

function onClick(ev, peer) {
  ev.preventDefault();

  const now = new Date().getTime();
  const timesince = now - latesttap;

  if ((timesince < 500) && (timesince > 0)) {
    sendClick(peer)(0, true);
    clearTimeout(taptimeout);
  } else {
    taptimeout = setTimeout(() => {
      sendClick(peer)();
    }, 550)
  }
      
  latesttap = new Date().getTime();
}

function onBtnEnterPressed(ev, peer) {
  ev.stopPropagation();

  return sendKeyPressed(peer)({ code: 13 });
}

function onBtnTabPressed(ev, peer) {
  ev.stopPropagation();

  return sendKeyPressed(peer)({ code: 9 });
}

function onBtnBackspacePressed(ev, peer) {
  ev.stopPropagation();

  return sendKeyPressed(peer)({ code: 8 });
}