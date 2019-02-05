import Peer from "simple-peer";
import io from "socket.io-client";
import initDesktopEvents from "./desktopEvents";
import initTouchEvents from "./touchEvents";
import fullscreen from "./utils/fullscreen";
import getRoom from "./utils/getRoom";
import { CONNECT, READY, MESSAGE } from "./constants/events";
import { $ } from "./utils/selector";

const isTouchScreen =
  "ontouchstart" in window ||
  (window.DocumentTouch && document instanceof DocumentTouch);

const socket = io(window.location.origin, {
  query: {
    token: getRoom()
  }
});

socket.on("connect", () => {
  const peer = onConnect(socket);

  if (isTouchScreen) {
    initTouchEvents(peer);
  } else {
    initDesktopEvents(peer);
  }
  socket.on(MESSAGE, data => onMessage(data, peer));
});

function handlerPeer(peer, socket) {
  const $video = $("#remoteVideos");

  peer.on("signal", signal => {
    socket.emit(
      MESSAGE,
      JSON.stringify({
        state: CONNECT,
        peerId: peer._id,
        signal
      })
    );
  });
  peer.on("stream", function(stream) {
    $video.srcObject = stream;
  });
  peer.on("close", () => {
    peer.destroy();
  });
}

function onConnect(socket) {
  const $app = $("#app");
  const $actions = $("#actions");
  const $btnActions = $("#btnActions");
  const $btnFullscreen = $("#fullscreen");
  const $btnCloseActions = $("#close");
  const $video = $("#remoteVideos");

  const newPeer = new Peer();
  handlerPeer(newPeer, socket);

  $btnActions.addEventListener("click", function() {
    this.classList.add("hide");
    $actions.classList.add("show");
  });

  $btnFullscreen.addEventListener("click", function(e) {
    e.stopPropagation();

    const el = isTouchScreen ? $app : $video;

    fullscreen(el);
  });

  $btnCloseActions.addEventListener("click", function(e) {
    $actions.classList.remove("show");
    $btnActions.classList.remove("hide");
  });

  socket.emit(
    MESSAGE,
    JSON.stringify({
      state: READY,
      peerId: newPeer._id
    })
  );

  return newPeer;
}

function onMessage(data, peer) {
  console.log(data);

  const { state, signal } = JSON.parse(data);

  if (state === CONNECT && !peer.connected) {
    peer.signal(signal);
  }
}
