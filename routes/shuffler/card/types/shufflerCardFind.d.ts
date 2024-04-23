import { Document, FilterQuery } from 'mongoose';
import { IShufflerCard } from '../../../../models/ShufflerCard';

export type TShufflerCardFind = Document<IShufflerCard> &
  FilterQuery<IShufflerCard>;

declare global {
  namespace Express {
    interface Request {
      card: TShufflerCardFind;
    }
  }
}
