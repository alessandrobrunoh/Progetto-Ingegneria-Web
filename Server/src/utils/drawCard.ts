import { connect } from "./database";
import { debugPrint } from "./debugPrint";

export const drawCard = async (code: String, player_id: String) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const connection = await connect();
  let cancellata = true;
  try {
    while (cancellata) {
      const [deck]: any = await connection.execute(
        "SELECT * FROM deck WHERE room_code = ? ORDER BY id ASC LIMIT 1",
        [code]
      );
      if(deck.length === 1){
        console.log("LAST CARD");
      }
      if (deck.length === 0) {
        console.log("No cards left in the deck");
        return "No cards left in the deck";
      }
      console.log(
        `Deck: ${deck[0].id} ${deck[0].number} ${deck[0].seed} ${deck[0].room_code}`
      );
      await connection.execute("DELETE FROM deck WHERE id = ?", [deck[0].id]);
      //console.log(`Carta cancellata: ${deck[0].number} ${deck[0].seed}`);
      
      const [existingHand]: any = await connection.execute(
        "SELECT * FROM hand_cards WHERE room_code = ? AND number = ? AND seed = ?",
        [code, deck[0].number, deck[0].seed]
      );
      console.log("Existing hand:", existingHand);
      
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
