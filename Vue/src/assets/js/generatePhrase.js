export const generatePhrase = (points) => {
  const phrases = {
    0: ["Really? Not even one?", "GG WP", "You didn't even try!"],  
    20: ["Did you even know the rules?"],
    40: [
      "Come on, try harder!",
      "Keep trying, you'll get there!",
      "You are a beginner, keep going!",
      "Everyone starts somewhere, don't give up!",
    ],
    58: [
      "I'm sorry, maybe next time!",
      "Better luck next time!",
      "Next time you'll get it!",
      "Don't worry, practice makes perfect!",
    ],
    59: [
      "Did you actually lose by one point?",
      "You need to be smarter than that!",
      "Play Smarter!",
      "Unlucky!",
    ],
    60: [
      "Not bad, but you can do better!",
      "Good Game",
      "Fair Fight",
      "You were one step away from winning!",
      "You were one step away from losing!",
      "Just one more point you wold have won!",
      "Just one less point you would have lost!",
    ],
    61: [
      "Don't you even think about celebrating, you won by one point!",
      "You barely won, don't get too excited!",
      "So Close!",
      "Next time you won't be so lucky!",
    ],
    62: [
      "You are getting the hang of it!",
      "Lucky!",
      "See? Practice makes perfect!",
    ],
    70: [
      "You are getting better!",
      "You understood how to play!",
      "Looks like you know the rules!",
      "You are improving!",
      "You are getting there!",
    ],
    120: [
      "You are too good for this game!",
      "Strike!",
      "Do you even have a life?",
    ],
  };
  if (points === 0) {
    return phrases[0][Math.floor(Math.random() * phrases[0].length)];
  } else if (points <= 20 && points > 0) {
    return phrases[20][Math.floor(Math.random() * phrases[20].length)];
  } else if (points <= 40 && points > 20) {
    return phrases[40][Math.floor(Math.random() * phrases[40].length)];
  } else if (points <= 58) {
    return phrases[58][Math.floor(Math.random() * phrases[58].length)];
  } else if (points === 59) {
    return phrases[59][Math.floor(Math.random() * phrases[59].length)];
  } else if (points === 60) {
    return phrases[60][Math.floor(Math.random() * phrases[60].length)];
  } else if (points === 61) {
    return phrases[61][Math.floor(Math.random() * phrases[61].length)];
  } else if (points >= 62 && points < 70) {
    return phrases[62][Math.floor(Math.random() * phrases[62].length)];
  } else if (points >= 70 && points < 120) {
    return phrases[70][Math.floor(Math.random() * phrases[70].length)];
  } else if (points === 120) {
    return phrases[120][Math.floor(Math.random() * phrases[120].length)];
  } else {
    return "No phrase available for the given points.";
  }
}