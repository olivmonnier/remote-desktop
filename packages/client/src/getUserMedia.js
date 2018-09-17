const contraintsDefault = {
  audio: {
    mandatory: {
      chromeMediaSource: 'desktop'
    }
  },
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      minWidth: 720,
      maxWidth: 1280,
      minHeight: 480,
      maxHeight: 720,
      maxFrameRate: 25
    }
  }
}

export default function (contraints) {
  const c = contraints || contraintsDefault;

  console.log('Contraints Supported', navigator.mediaDevices.getSupportedConstraints());

  return navigator.mediaDevices.getUserMedia(c)
    .catch(() => navigator.mediaDevices.getUserMedia(Object.assign({}, c, { audio: false })))
    .catch((err) => {
      throw new Error(err)
    });
}