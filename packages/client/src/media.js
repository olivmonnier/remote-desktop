const contraints = {
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

export default function () {
  return navigator.mediaDevices.getUserMedia(contraints)
}