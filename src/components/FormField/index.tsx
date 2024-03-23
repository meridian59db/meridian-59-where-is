/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */

import { useState } from 'react';

import { Wrapper, LabelInput, Input, ErrorMessage } from './styles';

const FormField = ({
  type = 'text',
  name,
  label,
  width,
  marginLeft,
  defaultValue = '',
  register,
  setValueFormState = () => {},
  error,
  marginBottom,
}: any) => {
  const [value, setValue] = useState(() => {
    const newVal = defaultValue;
    return newVal;
  });

  /**
   * Gets the onChange
   */
  const onChange = (e: any) => {
    setValue(e.target.value);
    setValueFormState(name, e.target.value);
  };

  return (
    <Wrapper width={width} marginLeft={marginLeft} marginBottom={marginBottom}>
      <LabelInput>{label ?? ''}:</LabelInput>
      <Input
        type={type}
        {...register(name)}
        value={value}
        onChange={onChange}
      />
      <ErrorMessage>{error ?? ''}</ErrorMessage>
    </Wrapper>
  );
};

export default FormField;
