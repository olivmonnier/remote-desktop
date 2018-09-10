import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import config from './config';
import media from './media';

let peers = {};

const socket = io(config.server.host, {
  query: {
    token: config.channel
  }
});

function handlerPeer(peer, socket) {
  peer.on('signal', signal => socket.emit('message', JSON.stringify({
    state: 'connect',
    signal
  })))

  peer.on('close', () => peer.destroy());
}

// function handleStream(stream) {
//   const video = document.querySelector('video');

//   video.srcObject = stream;
//   video.onloadedmetadata = (e) => video.play();
// }

function onMessage(data) {
  console.log(data);

  const { state, signal, peerId } = JSON.parse(data);

  if (state === 'ready') {
    media()
      .then((stream) => {
        // handleStream(stream);
        peers[peerId] = new SimplePeer({ initiator: true, stream });
        handlerPeer(peers[peerId], socket);
      });
  } 
  else if (state === 'connect') {
    peers[peerId].signal(signal);
  }
}

socket.on('message', onMessage);
