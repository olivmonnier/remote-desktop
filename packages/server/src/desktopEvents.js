import {
  sendPosition,
  sendClick,
  sendDblClick,
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
  const handleMouseMove = (ev) => sendPosition(ev, peer);
  const handleClick = (ev) => sendClick(ev, peer);
  const handleDblClick = (ev) => sendDblClick(ev, peer);
  const handleKeypress = (ev) => sendKeyPressed(ev, peer);

  return () => {
    if (document.pointerLockElement === $content) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick, false);
      document.addEventListener('dblclick', handleDblClick, false);
      document.addEventListener('keypress', handleKeypress, false);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, false);
      document.removeEventListener('dblclick', handleDblClick, false);
      document.removeEventListener('keypress', handleKeypress, false);
    }
  }
}