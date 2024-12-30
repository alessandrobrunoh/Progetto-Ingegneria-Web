let audioInstances = [];

export const playSound = (name, repeat = false) => {
  // Stop any existing audio instance with the same name
  stopSound(name);

  const audio = new Audio(require("../audio/" + name + ".mp3"));
  audio.loop = repeat;
  audio.play().catch(error => {
    console.error(`Error playing sound ${name}:`, error);
  });
  audioInstances.push(audio);
};

export const stopAllSounds = () => {
  audioInstances.forEach(audio => {
    audio.pause();
  });
  audioInstances = [];
};

export const stopSound = (name) => {
  audioInstances = audioInstances.filter(audio => {
    if (audio.src.includes(name)) {
      audio.pause();
      return false;
    }
    return true;
  });
};