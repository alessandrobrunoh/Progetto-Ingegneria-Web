import { connect } from "./database";
import { debugPrint } from "./debugPrint";

export const drawCard2 = async (code: String, player_id: String) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const connection = await connect();
  let cancellata = true;
  try {
    while (cancellata) {
      const [deck]: any = await connection.execute(
        "SELECT * FROM deck WHERE room_code = ? ORDER BY id ASC LIMIT 1",
        [code]
      );
      console.log("CARTE IN DECK:", deck.length);
      if (deck.length === 0) {
        console.log("No cards left in the deck");
        return "No cards left in the deck";
      }
      await connection.execute("DELETE FROM deck WHERE id = ?", [deck[0].id]);
      //console.log(`Carta cancellata: ${deck[0].number} ${deck[0].seed}`);

      const [existingHand]: any = await connection.execute(
        "SELECT * FROM hand_cards WHERE room_code = ? AND number = ? AND seed = ?",
        [code, deck[0].number, deck[0].seed]
      );

      if (existingHand.length === 0) {
        cancellata = false;
        await connection.execute(
          "INSERT INTO hand_cards (room_code, number, seed, player_id) VALUES (?, ?, ?, ?)",
          [code, deck[0].number, deck[0].seed, player_id]
        );
        console.log(`Card drawn for room with CODE: ${code}`);
        return deck[0];
      } else {
        // If the card is a duplicate, delete it from the deck and continue the loop
        await connection.execute("DELETE FROM deck WHERE id = ?", [deck[0].id]);
        //console.log(`LA CANCELLO DI NUOVO: ${deck[0].number} ${deck[0].seed}`);
      }
    }
    console.log("Card drawn successfully");
  } catch (error) {
    console.error("Error drawing card:", error);
    throw error;
  }
};

export const drawCard = async (code: String, player_id: String) => {
  try {
    const connection = await connect();

    const [nextCard]: any = await connection.execute(
      "SELECT next_number, next_seed FROM rooms WHERE code = ?",
      [code]
    );

    const [deck]: any = await connection.execute(
      "SELECT * FROM deck WHERE room_code = ? ORDER BY id ASC LIMIT 2",
      [code]
    );
    if (deck.length === 0) {
      console.log("No cards left in the deck");
      return "No cards left in the deck";
    }

    console.log(`AAAACard: ${deck[0].number} ${deck[0].seed}`);
    console.log(
      `carta Ipoteizzata: ${nextCard[0].next_number} ${nextCard[0].next_seed}`
    );
    if (
      deck[0].number === nextCard[0].next_number &&
      deck[0].seed === nextCard[0].next_seed
    ) {
      await connection.execute(
        "UPDATE rooms SET next_number = ?, next_seed = ? WHERE code = ?",
        [deck[1].number, deck[1].seed, code]
      );
      console.log("Card drawn is the next card");
      console.log(
        `La Prossima Prossima Carta: ${deck[1].number} ${deck[1].seed}`
      );
      await connection.execute("DELETE FROM deck WHERE id = ?", [deck[0].id]);
      await connection.execute(
        "INSERT INTO hand_cards (room_code, number, seed, player_id) VALUES (?, ?, ?, ?)",
        [code, deck[0].number, deck[0].seed, player_id]
      );
      return deck[0];

    } else {
      console.log("Card drawn is not the next card");
      return "Card drawn is not the next card";
    }
  } catch (error) {
    console.error("Error drawing card:", error);
    throw error;
  }
};
