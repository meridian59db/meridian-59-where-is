import React, { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import * as S from './styles';
import { Person } from '../../types/person';
import {
  getAllDocuments,
  addDocumentToCollection,
  updateDocument,
} from '../../services/firebaseRepository';
import { TObject } from '../../types/TObject';
import { /* mostConcurrentObject, */ parseData } from '../../utils';

type SelectMapProps = {
  whichWereVoting: string[];
  setWhichWereVoting: Dispatch<SetStateAction<string[]>>;
  person: Person;
  setAction: any;
};

const SelectMap = ({
  whichWereVoting,
  setWhichWereVoting,
  person,
  setAction,
}: SelectMapProps): any => {
  return (
    <>
      <S.Select
        defaultValue={-1}
        onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
          const copy: string[] = [...whichWereVoting];
          copy[person.index - 1] = event.target.value;
          setWhichWereVoting(copy);
        }}
      >
        <option className="disabled-option" disabled value={-1}>
          Select where you saw{' '}
          {person.name.toLowerCase() === 'miriana' ? 'her' : 'him'}
        </option>
        {person.places.map((place: string) => {
          return (
            <option key={place} value={place}>
              {place}
            </option>
          );
        })}
      </S.Select>
      <S.Check
        key={person.index}
        onClick={async () => {
          if (whichWereVoting[person.index - 1] === '-1') {
            toast.error('Choose a place before voting!');
            return;
          }
          const data = {
            name: person.name.toLowerCase(),
            votes: [
              {
                where: whichWereVoting[person.index - 1],
                createdAt: new Date().toString(),
                updatedAt: null,
                userId: localStorage.getItem('userId'),
              },
            ],
          };

          const allDocuments = parseData(await getAllDocuments());

          const filteredDocuments = allDocuments.filter(
            (document: TObject) => document.name === person.name.toLowerCase(),
          );
          if (filteredDocuments.length <= 0) {
            await addDocumentToCollection(data);
          } else {
            const documentToUpdate = filteredDocuments.find(
              (document: TObject) =>
                document.name === person.name.toLowerCase(),
            );
            if (documentToUpdate) {
              await updateDocument(documentToUpdate.id, {
                ...data,
                votes: [],
                where: whichWereVoting[person.index - 1],
                updatedAt: new Date().toString(),
              });
              localStorage.setItem(person.name.toLowerCase(), 'true');
              const statistics = await getAllDocuments('statistics');
              const newStatistic = {
                spotted: statistics[0]?.data?.spotted + 1,
              };
              console.log(newStatistic);
              await updateDocument(
                statistics[0]?.id,
                newStatistic,
                'statistics',
              );
              toast.success('Thank you for spotting =)');

              // If voting before marking
              /* if (documentToUpdate.votes.length >= 1) {
                const topVoted = mostConcurrentObject(documentToUpdate.votes);
                await updateDocument(documentToUpdate.id, {
                  ...data,
                  votes: [],
                  where: topVoted.where,
                  updatedAt: new Date().toString(),
                });
                localStorage.setItem(person.name.toLowerCase(), 'true');
                toast.success('Thank you for spotting and voting =)');
              } else if (
                !documentToUpdate.votes.includes(
                  (vote: any) => vote.userId === localStorage.getItem('userId'),
                )
              ) {
                await updateDocument(documentToUpdate.id, {
                  ...data,
                  votes: [
                    ...documentToUpdate.votes,
                    {
                      createdAt: new Date().toString(),
                      userId: localStorage.getItem('userId'),
                      where: whichWereVoting[person.index - 1],
                    },
                  ],
                });
                localStorage.setItem(person.name.toLowerCase(), 'true');
              } else {
                toast.error('Already voted');
              } */
            }
          }
          setAction(new Date());
        }}
      />
    </>
  );
};

export default SelectMap;
