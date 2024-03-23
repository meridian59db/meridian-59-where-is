import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Login, FormFieldContainer } from './styles';

import FormField from '../FormField';

import auth from '../../services/auth';

const FormRegister = (): any => {
  const history = useHistory();
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('Invalid username')
      .max(12, "Your username can't have more than 12 characters!"),
    /* email: yup.string().email().required('E-mail inválido'),
    emailConfirmation: yup
      .string()
      .email()
      .oneOf([yup.ref('email'), null], 'Emails must match'), */
    password: yup
      .string()
      .required('Please enter your password.')
      .max(15, 'Sua senha só pode ter no máximo 32 caracteres!'),
    passwordConfirmation: yup
      .string()
      .max(15, 'Sua senha só pode ter no máximo 32 caracteres!')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  /**
   * Executed when we hit submit on the register form
   * @param data Registering data
   */
  const onSubmit = async (data: any) => {
    const formattedData = {
      username: data.username,
      password: data.password,
    };
    await auth
      .registerUser(formattedData)
      .then(() => {
        toast.success('User successfully registered');
        history.push('/login');
      })
      .catch(err => {
        const errorList = err.response.data?.errors;

        if (errorList?.length) {
          toast.error(errorList[0].msg);
        }
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
      <FormFieldContainer>
        <FormField
          name="password"
          type="password"
          label="Password"
          register={register}
          error={errors.password?.message}
          setValueFormState={setValue}
          width="100%"
        />
        <FormField
          name="passwordConfirmation"
          type="password"
          label="Confirm Password"
          register={register}
          error={errors.passwordConfirmation?.message}
          setValueFormState={setValue}
          width="100%"
          margin_left="20px"
        />
      </FormFieldContainer>
      <Link to="/login">Already registered? click to login</Link>
      <Login type="submit">Register</Login>
    </Form>
  );
};

export default FormRegister;
