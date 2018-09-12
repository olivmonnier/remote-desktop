const contraintsDefault = {
  audio: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  },
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      minWidth: 1280,
      maxWidth: 1920,
      minHeight: 720,
      maxHeight: 1080,
      maxFrameRate: 25
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