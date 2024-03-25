/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
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
  const [editing, setEditing] = useState<TObject[]>([]);

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
        setEditing([
          ...res.map((_: any, index: number) => {
            return { id: index, editing: false };
          }),
        ]);
        setLoaded(true);
      });
    };
    fetchData();
  }, [action]);

  return !personsList && !editing && !loaded ? (
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
            p => p?.name?.toLowerCase() === person?.name?.toLowerCase(),
          );

          if (
            found &&
            found?.updatedAt &&
            !checkIsAfter(new Date(found?.updatedAt))
          ) {
            return (
              <S.Card key={found.id}>
                <div>
                  <S.Header>{prettifyName(person.name)}</S.Header>
                  <S.HorizontalRule />
                  <S.LastFound>
                    <S.FoundIcon />
                    {found?.where}
                    {' - '}
                    <S.Hour>
                      {found?.updatedAt
                        ? formatDis(found?.updatedAt, new Date())
                        : ''}
                    </S.Hour>
                  </S.LastFound>{' '}
                </div>
              </S.Card>
            );
          }

          return (
            <S.Card key={person.index}>
              <>
                {localStorage.getItem(person.name.toLowerCase()) === 'true' ? (
                  editing[person.index - 1]?.editing ? (
                    <>
                      <div>
                        <strong>
                          <S.Header>
                            Where did you last see {person.name}
                          </S.Header>
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

                          const allDocuments = parseData(
                            await getAllDocuments(),
                          );

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
                              if (documentToUpdate.votes.length >= 1) {
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
                  ) : (
                    <>
                      <div>
                        <S.Header>{prettifyName(person.name)}</S.Header>
                        <div>
                          {found?.name && found?.updatedAt && found?.where ? (
                            <>
                              <S.HorizontalRule />
                              <div style={{ marginBottom: '5px' }}>
                                You already voted!
                              </div>
                              <S.HorizontalRule />
                              <S.LastFound>
                                <S.FoundIcon />
                                {found?.where}
                                {' - '}
                                <S.Hour>
                                  {found?.updatedAt
                                    ? formatDis(found?.updatedAt, new Date())
                                    : ''}
                                </S.Hour>
                              </S.LastFound>{' '}
                            </>
                          ) : (
                            <>
                              {/* <>
                            - It seems nobody has found{' '}
                            {found?.name === 'miriana' ? 'her' : 'him'} yet!
                            </> */}
                            </>
                          )}
                          <S.HorizontalRule />
                          <div style={{ marginTop: '10px' }}>
                            - After voting, you&apos;ll be able to vote again
                            after 10 minutes
                          </div>
                          <S.HorizontalRule />
                          {found?.updatedAt &&
                            checkIsAfter(new Date(found?.updatedAt)) && (
                              <S.Clickable
                                onClick={() => {
                                  const copy = [...editing];
                                  const toEdit = copy.find(
                                    edit => edit.id === person.index - 1,
                                  );
                                  if (toEdit) {
                                    copy[person.index - 1] = {
                                      ...toEdit,
                                      editing: !copy[person.index - 1].editing,
                                    };
                                    setEditing(copy);
                                  }
                                }}
                                style={{
                                  marginTop: '8px',
                                  textDecoration: 'underline',
                                }}
                              >
                                Did it swap? click to vote again
                              </S.Clickable>
                            )}
                        </div>
                      </div>
                    </>
                  )
                ) : !editing[person.index - 1]?.editing &&
                  !localStorage.getItem(person.name.toLowerCase()) &&
                  found?.votes?.length ? (
                  <>
                    <div>
                      {found?.name && found?.updatedAt && found?.where ? (
                        <>
                          <S.Header>{prettifyName(found.name)}</S.Header>
                          <S.HorizontalRule />
                          <div style={{ marginBottom: '5px' }}>
                            You already voted! RR
                          </div>
                          <S.LastFound>
                            <S.FoundIcon />
                            {found?.where}
                            {' - '}
                            <S.Hour>
                              {found?.updatedAt
                                ? formatDis(found?.updatedAt, new Date())
                                : ''}
                            </S.Hour>
                          </S.LastFound>{' '}
                          {found?.updatedAt &&
                            checkIsAfter(new Date(found?.updatedAt)) && (
                              <S.Clickable
                                onClick={() => {
                                  const copy = [...editing];
                                  const toEdit = copy.find(
                                    edit => edit.id === person.index - 1,
                                  );
                                  if (toEdit) {
                                    copy[person.index - 1] = {
                                      ...toEdit,
                                      editing: !copy[person.index - 1].editing,
                                    };
                                    setEditing(copy);
                                  }
                                }}
                                style={{ marginTop: '10px' }}
                              >
                                Do you think{' '}
                                {found?.name?.toLowerCase() === 'miriana'
                                  ? 'her'
                                  : 'he'}{' '}
                                had moved?
                              </S.Clickable>
                            )}
                        </>
                      ) : (
                        <div>
                          <S.Header>{prettifyName(person.name)}</S.Header>
                          <S.HorizontalRule />
                          <div>
                            - It seems nobody has found{' '}
                            {found?.name === 'miriana' ? 'her' : 'him'} yet!
                          </div>
                          {found?.updatedAt &&
                            checkIsAfter(new Date(found?.updatedAt)) && (
                              <S.Clickable
                                onClick={() => {
                                  const copy = [...editing];
                                  const toEdit = copy.find(
                                    edit => edit.id === person.index - 1,
                                  );
                                  if (toEdit) {
                                    copy[person.index - 1] = {
                                      ...toEdit,
                                      editing: !copy[person.index - 1].editing,
                                    };
                                    setEditing(copy);
                                  }
                                }}
                                style={{ marginTop: '10px' }}
                              >
                                Click to vote now!
                              </S.Clickable>
                            )}
                        </div>
                      )}
                    </div>
                  </>
                ) : !editing[person.index - 1]?.editing ? (
                  <div>
                    {/* editar */}
                    {found?.name && found?.updatedAt && found?.where ? (
                      <div>
                        <S.Header>{prettifyName(found?.name)}</S.Header>
                        <S.HorizontalRule />
                        <S.LastFound>
                          <S.FoundIcon />
                          {found?.where}
                          {' - '}
                          <S.Hour>
                            {found?.updatedAt
                              ? formatDis(found?.updatedAt, new Date())
                              : ''}
                          </S.Hour>
                        </S.LastFound>{' '}
                        {found?.updatedAt &&
                          checkIsAfter(new Date(found?.updatedAt)) && (
                            <S.Clickable
                              onClick={() => {
                                const copy = [...editing];
                                const toEdit = copy.find(
                                  edit => edit.id === person.index - 1,
                                );
                                if (toEdit) {
                                  copy[person.index - 1] = {
                                    ...toEdit,
                                    editing: !copy[person.index - 1].editing,
                                  };
                                  setEditing(copy);
                                }
                              }}
                              style={{
                                marginTop: '8px',
                                textDecoration: 'underline',
                              }}
                            >
                              Did it swap? click to vote again
                            </S.Clickable>
                          )}
                      </div>
                    ) : (
                      <div>
                        <S.Header>{prettifyName(person.name)}</S.Header>
                        <S.HorizontalRule />
                        <div>
                          - It seems nobody has found{' '}
                          {found?.name === 'miriana' ? 'her' : 'him'} yet!
                        </div>
                        {found?.updatedAt &&
                          checkIsAfter(new Date(found?.updatedAt)) && (
                            <S.Clickable
                              onClick={() => {
                                const copy = [...editing];
                                const toEdit = copy.find(
                                  edit => edit.id === person.index - 1,
                                );
                                if (toEdit) {
                                  copy[person.index - 1] = {
                                    ...toEdit,
                                    editing: !copy[person.index - 1].editing,
                                  };
                                  setEditing(copy);
                                }
                              }}
                              style={{ marginTop: '10px' }}
                            >
                              Click to vote now!
                            </S.Clickable>
                          )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <strong>
                        <S.Header>
                          Where did you last see {person.name}
                        </S.Header>
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
                            if (documentToUpdate.votes.length >= 1) {
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
