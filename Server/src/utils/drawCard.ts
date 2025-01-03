import { connect } from "./database";
import { debugPrint } from "./debugPrint";

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

    if (
      deck[0].number === nextCard[0].next_number &&
      deck[0].seed === nextCard[0].next_seed
    ) {
      if (deck.length > 1) {
        await connection.execute(
          "UPDATE rooms SET next_number = ?, next_seed = ? WHERE code = ?",
          [deck[1].number, deck[1].seed, code]
        );
      } else {
        await connection.execute(
          "UPDATE rooms SET next_number = NULL, next_seed = NULL WHERE code = ?",
          [code]
        );
      }
      await connection.execute("DELETE FROM deck WHERE id = ?", [deck[0].id]);
      await connection.execute(
        "INSERT INTO hand_cards (room_code, number, seed, player_id) VALUES (?, ?, ?, ?)",
        [code, deck[0].number, deck[0].seed, player_id]
      );
      return deck[0];
    } else {
      return "Card drawn is not the next card";
    }
  } catch (error) {
    debugPrint("Error while drawing card" + error);
    console.error("Error drawing card:", error);
    throw error;
  }
};
