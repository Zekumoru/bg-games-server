import { IShufflerCard } from '../../../../models/ShufflerCard';

const extractCard = ({ name, createdAt }: IShufflerCard) => ({
  name,
  createdAt,
});

export default extractCard;
