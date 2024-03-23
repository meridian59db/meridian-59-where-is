import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Form, Login } from './styles';

import FormField from '../FormField';

import auth from '../../services/auth';

import { useUserData } from '../../contexts/UserData';

const FormLogin = (): any => {
  const history = useHistory();

  const { userData } = useUserData();

  // If user is already logged in, push him
  useEffect(() => {
    const check = () => {
      if (localStorage.getItem(auth.tokenKey)) {
        history.push('/admin');
      }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = yup.object().shape({
    username: yup.string().required('E-mail/login inválido'),
    password: yup
      .string()
      .max(32, 'Sua senha só pode ter no máximo 32 caracteres!')
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  /**
   * Executed when we hit submit on the login form
   * @param data Dados do login
   */
  const onSubmit = async (data: any) => {
    await auth
      .login(data?.username, data?.password)
      .then((response: any) => {
        history.push('/admin');
        localStorage.setItem('acessToken', response?.data?.accessToken);

        toast.success('You successfully logged in!');
      })
      .catch(err => {
        const { error } = err.response.data;
        toast.error(error);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="username"
        label="Username"
        register={register}
        error={errors.username?.message}
        setValueFormState={setValue}
        width="100%"
      />
      <FormField
        name="password"
        type="password"
        label="Password"
        register={register}
        error={errors.password?.message}
        setValueFormState={setValue}
        width="100%"
        marginBottom="15px"
      />
      <Link to="/register">Not registered yet? click to register</Link>
      <Login type="submit">Login</Login>
    </Form>
  );
};

export default FormLogin;
