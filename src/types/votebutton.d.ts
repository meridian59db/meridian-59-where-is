import { TObject } from './TObject';
import { Person } from './person';

export type VoteButtonType = {
  found: TObject;
  person: Person;
  children: ReactChildren | undefined;
};
