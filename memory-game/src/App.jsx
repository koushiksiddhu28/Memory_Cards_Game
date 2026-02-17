import { GameHeader } from "./components/Gameheader";
import { Card } from "./components/Card";
import { useEffect, useState } from "react";
import { Winmessage } from "./components/WinMessage";
const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];
function App() {
  const [cards, setcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const suffleArray = (array) => {
    const suffled = [...array];
    for (let i = suffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [suffled[i], suffled[j]] = [suffled[j], suffled[i]];
    }
    return suffled;
  };

  function initializegame() {
    const suffled = suffleArray(cardValues);
    const finalCards = suffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    setcards(finalCards);
    setScore(0);
    setMoves(0);
    setMatchedCards([]);
    setFlippedCards([]);
    setIsLocked(false);
  }

  useEffect(() => {
    initializegame();
  }, []);

  const handleCardClick = (card) => {
    if (card.isFlipped || card.isMatched || isLocked) {
      return;
    }
    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      } else {
        return c;
      }
    });
    setcards(newCards);
    const newFlippedCard = [...flippedCards, card.id];
    setFlippedCards(newFlippedCard);
    if (flippedCards.length === 1) {
      setIsLocked(true);
      const firstcard = cards[flippedCards[0]];
      if (firstcard.value === card.value) {
        // alert("Matched");
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstcard.id, card.id]);
          setScore((prev) => prev + 1);
          // const newMatchedCards = cards.map((c) => {
          //   if (c.id === card.id || c.id === firstcard.id) {
          //     return { ...c, isMatched: true };
          //   } else {
          //     return c;
          //   }
          // });

          setcards((prev) => {
            return /*newCards*/ prev.map((c) => {
              if (
                c.id === card.id ||
                c.id === firstcard.id /*flippedCards.includes(c.id)*/
              ) {
                return { ...c, isMatched: true };
              } else {
                return c;
              }
            });
          });
          // setcards(newMatchedCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        //flipback card1 and 2
        setTimeout(() => {
          const flippedBackcards = newCards.map((c) => {
            if (flippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });
          setcards(flippedBackcards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
      setMoves((prev) => prev + 1);
    }
  };

  const isGameCompleted = matchedCards.length === cardValues.length;
  return (
    <div className="app">
      <GameHeader score={score} moves={moves} onReset={initializegame} />
      {isGameCompleted && <Winmessage moves={moves} />}
      <div className="cards-grid">
        {cards.map((card) => (
          <Card card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
