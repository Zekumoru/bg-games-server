import { Document, FilterQuery } from 'mongoose';
import { IShufflerGame } from '../../../../models/ShufflerGame';

export type TShufflerGameFind =
  | (Document<IShufflerGame> & FilterQuery<IShufflerGame>)
  | null;

declare global {
  namespace Express {
    interface Request {
      game: TShufflerGameFind;
    }
  }
}
