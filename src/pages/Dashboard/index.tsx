import React, { useState, useEffect, useMemo } from 'react';
import { PERSONS, formatDis, checkIsAfter } from '../../utils';
import { Person } from '../../types/person';
import * as S from './styles';
import api from '../../services';

const Dashboard: React.FC = () => {
  const [personsList, setPersonsList] = useState<any[]>([]);
  const [action, setAction] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const promises = PERSONS.map(async person => {
        const path = `pos/${person.name.toLowerCase()}.json`;
        const fileDataResponse = await api.getFileData({ path });
        const githubResponse = await api.getDataFromGithubFile(
          fileDataResponse.data.data,
        );
        return githubResponse.data;
      });

      try {
        await Promise.all(promises).then(values => {
          console.log(values);
          setPersonsList(values);
          setLoaded(true);
        });
      } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [action]);

  return personsList?.length && loaded ? (
    <>
      <h3>
        Please have in mind that if you choose wrongly, you will be trolling
        people, so do it with caution
      </h3>
      <S.CardsContainer>
        {PERSONS.map((person: Person) => {
          const found = personsList.find(
            p => p.name.toLowerCase() === person.name.toLowerCase(),
          );
          // console.log(personsList);
          // console.log(found);
          // personsList.map((per: any) => console.log(per));

          if (found && !checkIsAfter(new Date(found.when))) {
            return (
              <S.Card key={`${found.name}${found.when}`}>
                {found?.name} was last found wandering at {found?.where}{' '}
                {formatDis(found?.when, new Date())}
              </S.Card>
            );
          }
          return (
            <S.Card key={`${person.index}${person.name}`}>
              <div>
                <strong>Where did you last see {person.name}</strong>?
              </div>
              <div>
                <select
                  defaultValue={-1}
                  onChange={async (
                    event: React.ChangeEvent<HTMLSelectElement>,
                  ) => {
                    const data = {
                      path: `pos/${person.name.toLowerCase()}.json`,
                      where: event.target.value,
                    };

                    await api
                      .getFileData({
                        path: data.path,
                      })
                      .then(async response => {
                        await api
                          .updatePosition({
                            ...data,
                            ...{ sha: response.data.sha },
                          })
                          .then((res: any) => {
                            setAction(res);
                            alert('file found, replaced');
                          })
                          .catch((err: any) => {
                            console.error(err);
                          });
                      })
                      .catch(async (err: any) => {
                        if (err.response.status === 404) {
                          await api
                            .updatePosition({
                              ...data,
                            })
                            .then((re: any) => {
                              setAction(re);
                              alert('file not found, added');
                            })
                            .catch(() => {
                              console.error('error');
                            });
                        }
                      });
                  }}
                >
                  <option disabled value={-1}>
                    Select a place
                  </option>
                  {person.places.map((place: string) => {
                    return (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    );
                  })}
                </select>
              </div>
            </S.Card>
          );
        })}
      </S.CardsContainer>
    </>
  ) : (
    <>Loading</>
  );
};

export default Dashboard;
