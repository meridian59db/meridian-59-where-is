import React, {
  SetStateAction,
  Dispatch,
  ReactElement,
  ReactNode,
} from 'react';
import * as S from './styles';
import { Person } from '../../types/person';
import { TObject } from '../../types/TObject';

type RevotingProps = {
  person: Person;
  setEditing: Dispatch<SetStateAction<TObject[]>>;
  editing: TObject[];
  buttonAction: ReactNode | string;
};

const Revoting = ({
  person,
  setEditing,
  editing,
  buttonAction,
}: RevotingProps): ReactElement => {
  return (
    <S.Clickable
      onClick={() => {
        const copy = [...editing];
        const toEdit = copy.find(edit => edit.id === person.index - 1);
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
      {/** Did it swap? click to vote again* */}
      {buttonAction}
    </S.Clickable>
  );
};

export default Revoting;
