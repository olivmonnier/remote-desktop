import { sendKeyPressed, sendPosition, sendClick } from "./controls";
import getCoordinates from "./utils/getCoordinates";
import { $ } from "./utils/selector";
import { DEFAULT, SHIFT, CAPS, DISPLAY } from "./constants/keyboard";

let peer, startX, startY, endX, endY, diffX, diffY, latesttap, taptimeout;
const configKeyboard = {
  onKeyPress,
  layout: {
    default: DEFAULT,
    shift: SHIFT,
    caps: CAPS
  },
  display: DISPLAY,
  buttonTheme: [
    {
      class: "keyboard-input-control",
      buttons: "{hide} {up} {down} {left} {right}"
    }
  ]
};
const Keyboard = window.SimpleKeyboard.default;
const keyboard = new Keyboard(configKeyboard);
const $keyboard = $("#keyboard");

export default function(rtc) {
  peer = rtc;

  const handleClickKeyboard = ev => onClickKeyboard(ev);
  const handleTouchStart = ev => onTouchStart(ev);
  const handleTouchMove = ev => onTouchMove(ev, peer);
  const handleClick = ev => onClick(ev, peer);

  createBtnKeyboard();

  $keyboard.addEventListener("click", handleClickKeyboard);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("click", handleClick);
}

function onClickKeyboard(ev) {
  ev.stopPropagation();
}

function createBtnKeyboard() {
  const $actions = $("#actions");
  const $btnKeyboard = document.createElement("button");

  $btnKeyboard.textContent = "Keyboard";
  $btnKeyboard.id = "btnKeyboard";

  $actions.appendChild($btnKeyboard);

  $btnKeyboard.addEventListener("click", onShowKeyboard);
}

function onShowKeyboard() {
  const $keyboard = $("#keyboard");

  $keyboard.classList.add("show");
}

function onHideKeyboard() {
  const $keyboard = $("#keyboard");

  $keyboard.classList.remove("show");
}

function onKeyPress(button) {
  console.log(button);

  if (button === "{shift}") return handleShiftButton();
  else if (button === "{lock}") return handleCapsButton();
  else if (button === "{hide}") return onHideKeyboard();
  else if (button === "{enter}") return sendKeyPressed(peer)({ code: 13 });
  else if (button === "{bksp}") return sendKeyPressed(peer)({ code: 8 });
  else if (button === "{tab}") return sendKeyPressed(peer)({ code: 9 });
  else if (button === "{up}") return sendKeyPressed(peer)({ code: 38 });
  else if (button === "{down}") return sendKeyPressed(peer)({ code: 40 });
  else if (button === "{left}") return sendKeyPressed(peer)({ code: 37 });
  else if (button === "{right}") return sendKeyPressed(peer)({ code: 39 });
  else if (button === "{space}") return sendKeyPressed(peer)({ string: " " });
  else return sendKeyPressed(peer)({ string: button });
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

  startX = getCoordinates(ev, "X");
  startY = getCoordinates(ev, "Y");
  diffX = 0;
  diffY = 0;
}

function onTouchMove(ev, peer) {
  ev.preventDefault();

  endX = getCoordinates(ev, "X");
  endY = getCoordinates(ev, "Y");
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

  if (timesince < 500 && timesince > 0) {
    sendClick(peer)(0, true);
    clearTimeout(taptimeout);
  } else {
    taptimeout = setTimeout(() => {
      sendClick(peer)();
    }, 550);
  }

  latesttap = new Date().getTime();
}
