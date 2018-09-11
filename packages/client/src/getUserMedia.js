const contraintsDefault = {
  audio: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  },
  video: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  }
}

export default function (contraints) {
  return navigator.mediaDevices.getUserMedia(contraints || contraintsDefault)
}