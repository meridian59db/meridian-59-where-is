import React, { useState, useEffect } from 'react';
import {
  PERSONS,
  formatDis,
  checkIsAfter,
  parseData,
  objetoComMaisOcorrencias,
  prettifyName,
} from '../../utils';
import { Person } from '../../types/person';
import { TObject } from '../../types/TObject';
import * as S from './styles';
import {
  addDocumentToCollection,
  getAllDocuments,
  updateDocument,
  onSnapPositions,
} from '../../services/firebaseRepository';

const Dashboard: React.FC = () => {
  const [personsList, setPersonsList] = useState<any[]>([]);
  const [action, setAction] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);

  // Check id
  useEffect(() => {
    const fetch = async () => {
      // checar se tem id no banco / se não tiver, criar
      if (!localStorage.getItem('userId')) {
        const now = new Date().toString();
        await addDocumentToCollection(
          {
            createdAt: now,
            updatedAt: now,
          },
          'users',
        ).then((res: TObject) => {
          localStorage.setItem('userId', res.id);
        });
      } else {
        console.log('Id already present');
      }
    };
    fetch();
  }, []);

  // Snap positions
  useEffect(() => {
    onSnapPositions();
  }, []);

  // Get the persons
  useEffect(() => {
    const fetchData = async () => {
      getAllDocuments().then((res: any) => {
        // Limpar se não tem posições
        if (!res.length) {
          PERSONS.map((person: any) => {
            localStorage.removeItem(person.name.toLowerCase());
            window.location.reload();
            return person;
          });
        }

        setPersonsList(parseData(res));
        setLoaded(true);
      });
    };
    fetchData();
  }, [action]);

  return !personsList && !loaded ? (
    <></>
  ) : (
    <>
      <S.CardsContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <S.Title>
            Meridian 59 - <abbr title="Where are The Wanderers?">W.A.T.W</abbr>?
          </S.Title>
        </div>
        <h3>
          The position should be marked when at least three reporters mark the
          NPC positions
        </h3>
        {PERSONS.map((person: Person) => {
          const found = personsList.find(
            p => p.name.toLowerCase() === person.name.toLowerCase(),
          );

          if (
            found &&
            found?.updatedAt &&
            !checkIsAfter(new Date(found?.updatedAt))
          ) {
            return (
              <S.Card key={found.id}>
                <div>
                  <strong>{prettifyName(found?.name)}</strong> was last found
                  wandering at <strong>{found?.where}</strong>{' '}
                  <u>{formatDis(found?.updatedAt, new Date())}</u>
                </div>
              </S.Card>
            );
          }
          return (
            <S.Card key={person.index}>
              <>
                {localStorage.getItem(person.name.toLowerCase()) === 'true' ? (
                  <>
                    <div>You already voted on {person.name}!</div>
                    <div>
                      {found?.name && found?.updatedAt && found?.where && (
                        <>
                          <S.HorizontalRule />
                          But <strong>{prettifyName(found?.name)}</strong> was
                          last found wandering at.{' '}
                          <strong>{found?.where}</strong>{' '}
                          <u>
                            {found?.updatedAt
                              ? formatDis(found?.updatedAt, new Date())
                              : ''}
                          </u>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>
                        <u>Where did you last see {person.name}</u>
                      </strong>
                      ?
                    </div>
                    <S.Select
                      defaultValue={-1}
                      onChange={async (
                        event: React.ChangeEvent<HTMLSelectElement>,
                      ) => {
                        const data = {
                          name: person.name.toLowerCase(),
                          votes: [
                            {
                              where: event.target.value,
                              createdAt: new Date().toString(),
                              updatedAt: null,
                              userId: localStorage.getItem('userId'),
                            },
                          ],
                        };

                        const allDocuments = parseData(await getAllDocuments());

                        const filteredDocuments = allDocuments.filter(
                          (document: TObject) =>
                            document.name === person.name.toLowerCase(),
                        );
                        if (filteredDocuments.length <= 0) {
                          await addDocumentToCollection(data);
                        } else {
                          const documentToUpdate = filteredDocuments.find(
                            (document: TObject) =>
                              document.name === person.name.toLowerCase(),
                          );
                          if (documentToUpdate) {
                            if (documentToUpdate.votes.length >= 2) {
                              const topVoted = objetoComMaisOcorrencias(
                                documentToUpdate.votes,
                              );
                              await updateDocument(documentToUpdate.id, {
                                ...data,
                                votes: [],
                                where: topVoted.where,
                                updatedAt: new Date().toString(),
                              });
                              localStorage.setItem(
                                person.name.toLowerCase(),
                                'true',
                              );
                            } else if (
                              !documentToUpdate.votes.includes(
                                (vote: any) =>
                                  vote.userId ===
                                  localStorage.getItem('userId'),
                              )
                            ) {
                              await updateDocument(documentToUpdate.id, {
                                ...data,
                                votes: [
                                  ...documentToUpdate.votes,
                                  {
                                    createdAt: new Date().toString(),
                                    userId: localStorage.getItem('userId'),
                                    where: event.target.value,
                                  },
                                ],
                              });
                              localStorage.setItem(
                                person.name.toLowerCase(),
                                'true',
                              );
                            } else {
                              console.log('Already voted');
                            }
                          }
                        }
                        setAction(new Date());
                      }}
                    >
                      <option className="disabled-option" disabled value={-1}>
                        Select where you saw{' '}
                        {person.name.toLowerCase() === 'miriana'
                          ? 'her'
                          : 'him'}
                      </option>
                      {person.places.map((place: string) => {
                        return (
                          <option key={place} value={place}>
                            {place}
                          </option>
                        );
                      })}
                    </S.Select>
                  </>
                )}
              </>
            </S.Card>
          );
        })}
      </S.CardsContainer>
    </>
  );
};

export default Dashboard;
