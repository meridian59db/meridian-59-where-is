/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, ReactElement } from 'react';

import { toast } from 'react-toastify';
import {
  PERSONS,
  formatDis,
  checkIsAfter,
  parseData,
  mostConcurrentObject,
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
import Revoting from '../../components/Revoting';
import { VoteButtonType } from '../../types/votebutton';

const Dashboard: React.FC = () => {
  const [personsList, setPersonsList] = useState<any[]>([]);
  const [action, setAction] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [editing, setEditing] = useState<TObject[]>([]);
  const [myVotes, setMyVotes] = useState<TObject[]>([]);

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
    onSnapPositions(setMyVotes);
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
        setMyVotes(
          parseData(res).map(position => {
            return { name: position.name, votes: position.votes };
          }),
        );

        setLoaded(true);
      });
    };
    fetchData();
  }, [action]);

  // Effect to refresh the page
  useEffect(() => {
    setInterval(() => {
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
        const trueReturn = parseData(res).map(position => {
          return { name: position.name, votes: position.votes };
        });
        setMyVotes(trueReturn);

        // Clear the votes that are stored
        PERSONS.map((person: any) => {
          const toRemove = trueReturn.filter(
            whatever =>
              whatever.name.toLowerCase() === person.name.toLowerCase(),
          );
          if (toRemove?.length === 0) {
            localStorage.removeItem(person?.name);
          }
          localStorage.removeItem(person.name.toLowerCase());
          return person;
        });

        setLoaded(true);
      });
    }, 10000);
  }, []);

  const VoteButton = ({
    found,
    person,
    children,
  }: VoteButtonType): ReactElement => {
    if (!found && !person) return <></>;
    const timePassed = checkIsAfter(new Date(found.updatedAt));
    const votesFilteredByNpcName: TObject = myVotes.find(
      vote => vote.name.toLowerCase() === person.name.toLowerCase(),
    )?.votes;

    const theVotes = votesFilteredByNpcName?.filter(
      (vote: TObject) => vote.userId === localStorage.getItem('userId'),
    );

    const hasAtLeastOneVote = theVotes?.length > 0;

    const alreadyVoted =
      localStorage.getItem(found.name.toLowerCase()) !== undefined &&
      localStorage.getItem(found.name.toLowerCase()) === 'true' &&
      hasAtLeastOneVote;

    const lastVoted = hasAtLeastOneVote ? theVotes[0]?.createdAt : new Date();

    const timePassedPlayer = checkIsAfter(new Date(lastVoted));

    if ((timePassed && alreadyVoted && timePassedPlayer) || timePassedPlayer) {
      return <>{children}</>;
    }
    return <></>;
  };

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

          if (!found) return <></>;

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
                                const topVoted = mostConcurrentObject(
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
                                toast.success(
                                  'Thank you for spotting and voting =)',
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
                                toast.error('Already voted');
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
                                {localStorage.getItem(
                                  person.name.toLowerCase(),
                                ) === 'true' && (
                                  <>
                                    <div>
                                      You&apos;ve already voted, and will be
                                      able to vote again after 10 minutes.
                                    </div>
                                  </>
                                )}
                              </div>
                              <S.HorizontalRule />
                              <S.LastFound>
                                <S.FoundIcon />
                                {found?.where}
                                {' - '}
                                <S.Hour>
                                  {found.updatedAt
                                    ? formatDis(found.updatedAt, new Date())
                                    : ''}
                                </S.Hour>
                              </S.LastFound>{' '}
                            </>
                          ) : (
                            <></>
                          )}
                          <S.HorizontalRule />
                          <VoteButton
                            key={found.id}
                            person={person}
                            found={found}
                          >
                            <Revoting
                              key={person.index}
                              person={person}
                              setEditing={setEditing}
                              editing={editing}
                              buttonAction="Click to vote!"
                            />
                          </VoteButton>
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
                            {localStorage.getItem(person.name.toLowerCase()) ===
                              'true' && <>You&apos;ve already voted!</>}
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
                          <VoteButton
                            key={found.id}
                            person={person}
                            found={found}
                          >
                            <Revoting
                              key={person.index}
                              person={person}
                              setEditing={setEditing}
                              editing={editing}
                              buttonAction={
                                <>
                                  {/* Do you think{' '}
                                  {found?.name?.toLowerCase() === 'miriana'
                                    ? 'her'
                                    : 'he'}{' '}
                              had moved? */}
                                  Click to vote!
                                </>
                              }
                            />
                          </VoteButton>
                        </>
                      ) : (
                        <div>
                          <S.Header>{prettifyName(person.name)}</S.Header>
                          <S.HorizontalRule />
                          <div>
                            - It seems nobody has found{' '}
                            {found?.name === 'miriana' ? 'her' : 'him'} yet!
                          </div>

                          <VoteButton
                            key={found.id}
                            person={person}
                            found={found}
                          >
                            <Revoting
                              key={person.index}
                              person={person}
                              editing={editing}
                              setEditing={setEditing}
                              buttonAction="Click to vote now!"
                            />
                          </VoteButton>
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
                        <S.HorizontalRule />
                        <VoteButton
                          key={found.id}
                          person={person}
                          found={found}
                        >
                          <Revoting
                            key={person.index}
                            person={person}
                            editing={editing}
                            setEditing={setEditing}
                            /* buttonAction={`Did ${
                              person.name.toLowerCase() === 'miriana'
                                ? 'she'
                                : 'he'
                            } swap position? click to vote again`} */
                            buttonAction="Click to vote!"
                          />
                        </VoteButton>
                      </div>
                    ) : (
                      <div>
                        <S.Header>{prettifyName(person.name)}</S.Header>
                        <S.HorizontalRule />
                        <div>
                          - It seems nobody has found{' '}
                          {found?.name === 'miriana' ? 'her' : 'him'} yet!
                        </div>

                        <VoteButton
                          key={found.id}
                          person={person}
                          found={found}
                        >
                          <Revoting
                            key={person.index}
                            person={person}
                            editing={editing}
                            setEditing={setEditing}
                            buttonAction="Click to vote now!"
                          />
                        </VoteButton>
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
                              const topVoted = mostConcurrentObject(
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
                              toast.success(
                                'Thank you for spotting and voting =)',
                              );
                            } else {
                              toast.error('Already voted');
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
