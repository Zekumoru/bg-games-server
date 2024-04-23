import { Schema, Types, model } from 'mongoose';

interface IShufflerGameCardSchema {
  name: string;
  shuffled: string;
  guessed: boolean;
  guessedAt: Date | null;
  createdAt: Date;
}

export interface IShufflerGameCard extends IShufflerGameCardSchema {
  _id: Types.ObjectId;
}

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
    required: true,
    default: false,
  },
  guessedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('ShufflerGameCard', ShufflerGameCardSchema);
