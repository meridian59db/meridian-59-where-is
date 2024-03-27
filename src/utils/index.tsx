import {
  formatDistance,
  isAfter,
  isEqual,
  addSeconds,
  isValid,
} from 'date-fns';
import { Person } from '../types/person';
import { TObject } from '../types/TObject';

/**
 * All the persons we have in the have
 */
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
      'Outside the Trading Post',
      'The Cragged Mountains',
      'A spring of vitality',
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
      'Cragged Mountains',
      "Kardde's Canyon",
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
      'Abandoned Fountain Tavern',
      "Resting Place of Marion's Ancestors",
    ],
  },
  {
    index: 5,
    name: 'Maleval',
    places: [
      "Frisconar's Mysticals",
      "Marion near Ran Er'Hots",
      'Chamber of Duke Kalior',
      'Blackstone Keep',
      'Temple of Qor',
    ],
  },
];

/**
 * Formats an interval of two dates to a more human way
 *
 * @param { Date } from The initial date from the interval
 * @param { Date } to The last date from the interval
 * @returns { string } The date formatted in a recursive way
 */
export const formatDis = (from: Date, to: Date): string => {
  return formatDistance(from, to, { addSuffix: true });
};

/**
 * Checks if the date we're passing is 10 minutes ahead
 *
 * @param { Date } from The date we're checking
 * @returns { boolean } If from is after the specified date
 */
export const checkIsAfter = (from: Date): boolean => {
  if (!isValid(from)) {
    throw new Error('Invalid date provided.');
  }
  const fromDatePlus5Minutes = addSeconds(from, 20); /* addMinutes(from, 10); */
  return (
    !isAfter(fromDatePlus5Minutes, new Date()) || isEqual(new Date(), from)
  );
};

/**
 * Parses the data to the format we need
 *
 * @param { TObject[] } res The response array we're parsing
 * @returns { TObject[] } The response array parsed to our format
 */
export const parseData = (res: TObject[]): TObject[] =>
  res.map((document: any) => {
    return {
      ...document.data,
      id: document.id,
    };
  });

/**
 * Gets the object that appears more than any other in the array based on 'where' key
 *
 * @param { any[] }array The array of objects we're trying to get information from
 * @returns { any } The object that appears most times
 */
export const mostConcurrentObject = (array: any[]): any => {
  // Create an object to count the occuencies of each value in "where"
  const count: any = {};

  // Iterate each object in the array and count the occurencies of "where"
  array.forEach(object => {
    const { where } = object;
    count[where] = (count[where] || 0) + 1;
  });

  // Encontrar o valor com o maior número de ocorrências
  let maxOcurrencies = 0;
  let maxOcurrenciesValue: any = null;
  Object.entries(count).map(([key, val]: any) => {
    if (count[key] > maxOcurrencies) {
      maxOcurrencies = count[key];
      maxOcurrenciesValue = key;
    }
    return val;
  });

  // Return the object with highest occurrency number
  return array.find(object => object.where === maxOcurrenciesValue);
};

/**
 * Makes the city name prettified instead of the default (capitalized)
 *
 * @param { string } name
 * @returns Prettified name
 */
export function prettifyName(name: string): string {
  // Split the name into words
  const words = name?.split(' ');

  // Array of words to keep lowercase
  const lowercaseWords = ['of', 'to', 'the', 'in'];

  // Function to capitalize the first letter of each word except the ones in lowercaseWords
  function capitalize(word: string, index: number) {
    if (index !== 0 && lowercaseWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  // Capitalize each word and join them back into a string
  const prettifiedName = words.map(capitalize).join(' ');

  return prettifiedName;
}

export default { PERSONS, formatDis, mostConcurrentObject, prettifyName };
