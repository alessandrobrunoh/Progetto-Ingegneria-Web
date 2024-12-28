export const checkWinner = (b_seed: String, f_number: number, f_seed: String, p_number: number, p_seed: String) => {
  if (p_seed === f_seed && p_number === f_number) {
    return { player: "draw", value: 0 };
  }
  let p_value = 0;
  switch (p_number) {
    case 3:
      p_value = 10;
      break;
    case 1:
      p_value = 11;
      break;
    case 8:
      p_value = 2;
      break;
    case 9:
      p_value = 3;
      break;
    case 10:
      p_value = 4;
      break;
    default:
      p_value = 0;
      break;
  }

  let f_value = 0;
  switch (f_number) {
    case 3:
      f_value = 10;
      break;
    case 1:
      f_value = 11;
      break;
    case 8:
      f_value = 2;
      break;
    case 9:
      f_value = 3;
      break;
    case 10:
      f_value = 4;
      break;
    default:
      f_value = 0;
      break;
  }

  console.log("CHECK: ", p_value + "/" + f_value);

  if (p_seed === f_seed) {
    if (p_value > f_value) {
      //   return { seed: p_seed, value: p_value, number: p_number };
      console.log("A");
      return { player: "player", value: p_value + f_value };
    } else if (p_value < f_value) {
      console.log("B");
      return { player: "first", value: p_value + f_value };
    } else {
      if (p_number > f_number) {
        console.log("C");
        return { player: "player", value: p_value + f_value };
      } else {
        console.log("D");
        return { player: "first", value: p_value + f_value };
      }
    }
  } else {
    if (p_seed === b_seed && f_seed !== b_seed) {
      console.log("E");
      return { player: "player", value: p_value + f_value };
    } else if(p_seed !== b_seed && f_seed === b_seed) {
      console.log("F");
      return { player: "first", value: p_value + f_value };
    }
  }
  console.log("G");
}