import { Schema, Types, model } from 'mongoose';

interface IShufflerGameCardSchema {
  name: string;
  shuffled: string;
  guessed: boolean;
  guessedAt: Date | null;
}

export interface IShufflerGameCard extends IShufflerGameCardSchema {}

const ShufflerGameCardSchema = new Schema<IShufflerGameCardSchema>({
  name: {
    type: String,
    maxlength: 3000,
    required: true,
    trim: true,
  },
  shuffled: {
    type: String,
    maxlength: 3000,
    required: true,
    trim: true,
  },
  guessed: {
    type: Boolean,
    default: false,
  },
  guessedAt: {
    type: Date,
    default: null,
  },
});

interface IShufflerGameSchema {
  cards: IShufflerGameCard[];
  createdAt: Date;
}

export interface IShufflerGame extends IShufflerGameSchema {
  _id: Types.ObjectId;
}

const ShufflerGameSchema = new Schema<IShufflerGameSchema>({
  cards: {
    type: [ShufflerGameCardSchema],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default model('ShufflerGame', ShufflerGameSchema);
