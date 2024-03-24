import {
  formatDistance,
  isAfter,
  isEqual,
  addMinutes,
  isValid,
} from 'date-fns';
import { Person } from '../types/person';

export const PERSONS: Person[] = [
  {
    index: 1,
    name: 'Izzio',
    places: [
      "The Temple of Shal'ille",
      'West Merchant Way through Ilerian Woods',
      'Main gate of Barloque',
      "The King's Way",
      "Lake of Jala's Song",
    ],
  },
  {
    index: 2,
    name: 'Parrin',
    places: [
      'Cor Noth',
      'The Chambers of Duke Akardius',
      'The Bhrama & Falcon',
      "Pietro's Wicked Brews",
      'The Assembly Chamber',
    ],
  },
  {
    index: 3,
    name: 'Miriana',
    places: [
      'The Hills',
      'Off the beaten Path',
      'The Twisted Wood',
      'North Quilicia Wood',
    ],
  },
  {
    index: 4,
    name: 'Tendrath',
    places: [
      'The Cragged Mountains',
      'Ukgoth, Holy Land of Trolls',
      'Upstairs in Castle Victoria',
      'The Badlands',
    ],
  },
];

export const formatDis = (from: Date, to: Date): string => {
  return formatDistance(from, to, { addSuffix: true });
};

export const checkIsAfter = (from: Date): boolean => {
  if (!isValid(from)) {
    throw new Error('Invalid date provided.');
  }
  const fromDatePlus5Minutes = addMinutes(from, 5);
  return (
    !isAfter(fromDatePlus5Minutes, new Date()) || isEqual(new Date(), from)
  );
};

export default { PERSONS, formatDis };
