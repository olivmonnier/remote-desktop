import {
  sendPosition,
  sendClick,
  sendKeyPressed
} from './controls';

const $content = document.querySelector('#content');

export default function(peer) {
  const handleLockChange = lockChange(peer);
  
  $content.requestPointerLock = $content.requestPointerLock ||
  $content.mozRequestPointerLock ||
  $content.webkitPointerLockElement;

  $content.addEventListener('click', function() {
    $content.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', handleLockChange, false);
  document.addEventListener('mozpointerlockchange', handleLockChange, false);
  document.addEventListener('webkitpointerlockchange', handleLockChange, false);

}

function lockChange(peer) {
  const handleMouseMove = (ev) => {
    const { movementX, movementY } = ev;

    return sendPosition(peer)(movementX, movementY);
  };
  const handleClick = (ev) => {
    const { button } = ev;

    return sendClick(peer)(button, false);
  };
  const handleDblClick = (ev) => {
    const { button } = ev;

    return sendClick(peer)(button, true);
  }
  const handleKeypress = (ev) => {
    ev.preventDefault();

    const alt = ev.altKey || false
    const ctrl = ev.ctrlKey || false
    const shift = ev.shiftKey || false
    const meta = ev.metaKey || false
    const code = ev.which || ev.keyCode
    const string = String.fromCharCode(code);

    return sendKeyPressed(peer)({ alt, ctrl, shift, meta, code, string });
  };

  return () => {
    if (document.pointerLockElement === $content) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick);
      document.addEventListener('dblclick', handleDblClick);
      document.addEventListener('keypress', handleKeypress);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('keypress', handleKeypress);
    }
  }
}