let audioInstances = [];

export const playSound = (name, repeat = false) => {
  const audio = new Audio(require("../audio/" + name + ".mp3"));
  audio.loop = repeat;
  audio.play();
  audioInstances.push(audio);
};

export const stopAllSounds = () => {
  audioInstances.forEach(audio => {
    audio.pause();
  });
  audioInstances = [];
};

export const stopSound = (name) => {
  audioInstances.forEach(audio => {
    if (audio.src.includes(name)) {
      audio.pause();
    }
  });
}