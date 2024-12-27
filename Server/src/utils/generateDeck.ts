export const generateDeck = () => {
  const seeds = ["Bastoni", "Coppe", "Denari", "Spade"];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const deck = [];
  for (const seed of seeds) {
    for (const number of numbers) {
      deck.push({
        seed,
        number,
      });
    }
  }

  shuffleDeck(deck);
  return deck;
};

const shuffleDeck = (deck: any[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};
