import {
  sendKeyPressed,
  sendPosition,
  sendClick
} from './controls';
import getCoordinates from './utils/getCoordinates';

let startX, startY, endX, endY, diffX, diffY, latesttap, taptimeout;
const Keyboard = window.SimpleKeyboard.default;
const keyboard = new Keyboard({
  onKeyPress: button => onKeyPress(button),
  layout: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{lock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift} {up} {down}",
      ".com @ {space} {hide} {left} {right}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift} {up} {down}",
      ".com @ {space} {hide} {left} {right}"
    ],
    caps: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} Q W E R T Y U I O P [ ] \\",
      "{lock} A S D F G H J K L ; ' {enter}",
      "{shift} Z X C V B N M , . / {shift} {up} {down}",
      ".com @ {space} {hide} {left} {right}"
    ]
  },
  display: {
    '{bksp}': 'backspace',
    '{enter}': '< enter',
    '{shift}': 'shift',
    '{tab}': 'tab',
    '{lock}': 'caps',
    '{accept}': 'Submit',
    '{space}': ' ',
    '{//}': ' ',
    '{hide}': 'hide',
    '{up}': 'up',
    '{down}': 'down',
    '{left}': 'left',
    '{right}': 'right'
  },
  buttonTheme: [
    {
      class: "keyboard-input-control",
      buttons: '{hide} {up} {down} {left} {right}'
    }
  ]
});

export default function () {
  const $keyboard = document.querySelector('#keyboard');

  const handleClickKeyboard = (ev) => onClickKeyboard(ev);
  const handleTouchStart = (ev) => onTouchStart(ev, window.peer);
  const handleTouchMove = (ev) => onTouchMove(ev, window.peer);
  const handleClick = (ev) => onClick(ev, window.peer);

  createBtnKeyboard();

  $keyboard.addEventListener('click', handleClickKeyboard);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('click', handleClick);
}

function onClickKeyboard(ev) {
  ev.stopPropagation();
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

  $keyboard.classList.add('show');
}

function onHideKeyboard() {
  const $keyboard = document.querySelector('#keyboard');

  $keyboard.classList.remove('show');
}

function onKeyPress(button) {
  console.log(button);

  if (button === '{shift}') 
    return handleShiftButton();
  else if (button === '{lock}')
    return handleCapsButton();
  else if (button === '{hide}') 
    return onHideKeyboard();
  else if (button === '{enter}')
    return sendKeyPressed(window.peer)({ code: 13 });
  else if (button === '{bksp}')
    return sendKeyPressed(window.peer)({ code: 8 });
  else if (button === '{tab}')
    return sendKeyPressed(window.peer)({ code: 9 });
  else if (button === '{up}')
    return sendKeyPressed(window.peer)({ code: 38 });
  else if (button === '{down}')
    return sendKeyPressed(window.peer)({ code: 40 });
  else if (button === '{left}')
    return sendKeyPressed(window.peer)({ code: 37 });
  else if (button === '{right}')
    return sendKeyPressed(window.peer)({ code: 39 });
  else if (button === '{space}')
    return sendKeyPressed(window.peer)({ string: ' ' });
  else 
    return sendKeyPressed(window.peer)({ string: button });
}

function handleShiftButton() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "shift" ? "default" : "shift";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}

function handleCapsButton() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "caps" ? "default" : "caps";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
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