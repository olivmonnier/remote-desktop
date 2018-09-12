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
  const c = contraints || contraintsDefault;

  return navigator.mediaDevices.getUserMedia(c)
    .catch(() => navigator.mediaDevices.getUserMedia(Object.assign({}, c, { audio: false })))
    .catch((err) => {
      throw new Error(err.message)
    });
}