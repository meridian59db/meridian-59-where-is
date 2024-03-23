import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import auth from '../../services/auth';

const Logout = (): any => {
  const history = useHistory();

  useEffect(() => {
    const logOff = async () => {
      if (localStorage.getItem(auth.tokenKey) !== null) {
        auth.logout(() => {
          history.push('/login');
        });
      }
    };
    logOff();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>y</>;
};

export default Logout;
