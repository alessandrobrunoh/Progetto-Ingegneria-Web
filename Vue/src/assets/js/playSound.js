export const playSound = (name) => {
  const audio = new Audio(require("../audio/" + name + ".mp3"));
  audio.play();
};