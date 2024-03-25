import {
  formatDistance,
  isAfter,
  isEqual,
  addMinutes,
  isValid,
} from 'date-fns';
import { Person } from '../types/person';
import { TObject } from '../types/TObject';

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

export const parseData = (res: TObject[]): TObject[] => {
  const array: TObject[] = res.map((document: any) => {
    const doc = {
      ...document.data,
      id: document.id,
    };
    return doc;
  });
  return array;
};

export const objetoComMaisOcorrencias = (array: any[]): any => {
  // Criar um objeto para contar as ocorrências de cada valor em "where"
  const contador: any = {};

  // Iterar sobre cada objeto no array e contar as ocorrências de "where"
  array.forEach(objeto => {
    const { where } = objeto;
    contador[where] = (contador[where] || 0) + 1;
  });

  // Encontrar o valor com o maior número de ocorrências
  let maxOcorrencias = 0;
  let valorMaxOcorrencias: any = null;
  Object.entries(contador).map(([key, val]: any) => {
    if (contador[key] > maxOcorrencias) {
      maxOcorrencias = contador[key];
      valorMaxOcorrencias = key;
    }
    return val;
  });

  // Retornar o objeto com o valor que teve o maior número de ocorrências
  return array.find(objeto => objeto.where === valorMaxOcorrencias);
};

/**
 * Makes the city name prettified instead of the default (capitalized)
 *
 * @param { string } name
 * @returns Prettified name
 */
export function prettifyName(name: string): string {
  // Split the name into words
  const words = name.split(' ');

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

export default { PERSONS, formatDis, objetoComMaisOcorrencias, prettifyName };
