/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, ReactElement } from 'react';

import {
  PERSONS,
  formatDis,
  checkIsAfter,
  parseData,
  prettifyName,
} from '../../utils';
import { Person } from '../../types/person';
import { TObject } from '../../types/TObject';
import * as S from './styles';
import {
  addDocumentToCollection,
  getAllDocuments,
  onSnapPositions,
} from '../../services/firebaseRepository';
import Revoting from '../../components/Revoting';
import { VoteButtonType } from '../../types/votebutton';
import SelectMap from '../../components/SelectMap';

const Dashboard: React.FC = () => {
  const [personsList, setPersonsList] = useState<any[]>([]);
  const [action, setAction] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [editing, setEditing] = useState<TObject[]>([]);
  const [myVotes, setMyVotes] = useState<TObject[]>([]);
  const [whichWereVoting, setWhichWereVoting] = useState<string[]>([]);
  const [spottedNpcs, setSpottedNpcs] = useState<number>(0);

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
      });
    };
    fetchData().then(async () => {
      const statistics = await getAllDocuments('statistics');
      console.log(statistics);
      setSpottedNpcs(statistics[0].data?.spotted);
      setLoaded(true);
    });
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
    }, 5000);
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
    <S.Wrapper>
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
        <S.Head>
          The updated spot should be marked when a first spotter report where
          the wanderer was seen.
          <S.HowMany>
            People have already spotted <strong>{spottedNpcs}</strong>{' '}
            wanderering npcs!
          </S.HowMany>
        </S.Head>
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
                <>
                  <S.Header>
                    {prettifyName(person.name)}
                    <S.HorizontalRule />
                  </S.Header>
                  <S.LastFound>
                    <S.FoundRow>
                      <S.FoundIcon />
                      {found?.where}
                    </S.FoundRow>

                    <S.Hour>
                      {found?.updatedAt
                        ? formatDis(found?.updatedAt, new Date())
                        : ''}
                    </S.Hour>
                  </S.LastFound>
                  <div>
                    <S.HorizontalRule />
                  </div>
                  <S.PlaceHolder>Vote now!</S.PlaceHolder>
                </>
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
                      <S.SelectContainer>
                        <SelectMap
                          key={person.index}
                          person={person}
                          whichWereVoting={whichWereVoting}
                          setWhichWereVoting={setWhichWereVoting}
                          setAction={setAction}
                        />
                      </S.SelectContainer>
                    </>
                  ) : (
                    <>
                      <div>
                        <S.Header>{prettifyName(person.name)}</S.Header>
                        <div>
                          {found?.name && found?.updatedAt && found?.where ? (
                            <>
                              <div style={{ marginBottom: '5px' }}>
                                {localStorage.getItem(
                                  person.name.toLowerCase(),
                                ) === 'true' && <></>}
                              </div>
                              <S.HorizontalRule />
                              <S.LastFound>
                                <S.FoundRow>
                                  <S.FoundIcon />
                                  {found?.where}
                                </S.FoundRow>

                                <S.Hour>
                                  {found.updatedAt
                                    ? formatDis(found.updatedAt, new Date())
                                    : ''}
                                </S.Hour>
                              </S.LastFound>
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
                              buttonAction="Vote now!"
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
                            <S.FoundRow>
                              <S.FoundIcon />
                              {found?.where}
                            </S.FoundRow>

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
                              setEditing={setEditing}
                              editing={editing}
                              buttonAction={<>Vote now!</>}
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
                              buttonAction="Vote now!"
                            />
                          </VoteButton>
                        </div>
                      )}
                    </div>
                  </>
                ) : !editing[person.index - 1]?.editing ? (
                  <div>
                    {found?.name && found?.updatedAt && found?.where ? (
                      <div>
                        <S.Header>{prettifyName(found?.name)}</S.Header>
                        <S.HorizontalRule />
                        <S.LastFound>
                          <S.FoundRow>
                            <S.FoundIcon />
                            {found?.where}
                          </S.FoundRow>

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
                          <S.HorizontalRule />
                          <Revoting
                            key={person.index}
                            person={person}
                            editing={editing}
                            setEditing={setEditing}
                            buttonAction="Vote now!"
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
                          <S.HorizontalRule />
                          <Revoting
                            key={person.index}
                            person={person}
                            editing={editing}
                            setEditing={setEditing}
                            buttonAction="Vote now!"
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
                    <S.SelectContainer>
                      <SelectMap
                        key={person.index}
                        person={person}
                        whichWereVoting={whichWereVoting}
                        setWhichWereVoting={setWhichWereVoting}
                        setAction={setAction}
                      />
                    </S.SelectContainer>
                  </>
                )}
              </>
            </S.Card>
          );
        })}
      </S.CardsContainer>
      <S.Footer>
        Created with love by
        <a
          style={{ color: '#8AABDC' }}
          href="https://github.com/meridian59db/meridian-59-where-is"
        >
          Magnus Clarke
        </a>
      </S.Footer>
    </S.Wrapper>
  );
};

export default Dashboard;
