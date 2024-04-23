import { Schema, Types, model } from 'mongoose';

interface IShufflerCardSchema {
  name: string;
  createdAt: Date;
}

export interface IShufflerCard extends IShufflerCardSchema {
  _id: Types.ObjectId;
}

const ShufflerCardSchema = new Schema<IShufflerCardSchema>({
  name: {
    type: String,
    maxlength: 3000,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('ShufflerCard', ShufflerCardSchema);
