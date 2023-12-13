import { type FC } from 'react';

import Form from '../../UI/FormMui/Form';
import FormContainer from '../../UI/FormMui/FormContainer';
import FormInfo from '../../UI/FormMui/FormInfo';
import TitleBar from '../../UI/TitleBar/TitleBar';

const Restore: FC = () => {
  return (
    <FormContainer>
      <TitleBar title='Restore' />

      <Form onSubmit={() => {}}>
        <FormInfo>Coming soon.</FormInfo>
      </Form>
    </FormContainer>
  );
};

export default Restore;
