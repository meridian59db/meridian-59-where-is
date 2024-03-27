import { SetStateAction } from 'react';
import { TObject } from './TObject';

export type SnapType = {
  setMyVotes: Dispatch<SetStateAction<TObject[]>>;
};
