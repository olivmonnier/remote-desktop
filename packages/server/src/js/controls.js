import { MOUSE_MOVE, MOUSE_CLICK, KEY_PRESS } from "./constants";

const mouseButtons = {
  0: "left",
  1: "middle",
  2: "right"
};

export function sendPosition(peer) {
  return (x, y) => {
    peer.send(
      JSON.stringify({
        state: MOUSE_MOVE,
        mouse: { x, y }
      })
    );
  };
}

export function sendClick(peer) {
  return (button = 0, double = false) => {
    peer.send(
      JSON.stringify({
        state: MOUSE_CLICK,
        button: mouseButtons[button],
        double
      })
    );
  };
}

export function sendKeyPressed(peer) {
  return (keys = {}) => {
    peer.send(
      JSON.stringify({
        state: KEY_PRESS,
        keys
      })
    );
  };
}
