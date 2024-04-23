import { IShufflerGame } from '../../../../models/ShufflerGame';

const extractGame = ({ _id, cards, createdAt }: IShufflerGame) => ({
  id: _id,
  cards: cards.map(({ name, shuffled, guessed, guessedAt }) => ({
    name,
    shuffled,
    guessed,
    guessedAt,
  })),
  createdAt,
});

export default extractGame;
