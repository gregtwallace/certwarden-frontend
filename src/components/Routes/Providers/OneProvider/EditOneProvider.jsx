import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import useAxiosGet from '../../../../hooks/useAxiosGet';
import useAxiosSend from '../../../../hooks/useAxiosSend';
import { devMode } from '../../../../helpers/environment';

import ApiError from '../../../UI/Api/ApiError';
import ApiLoading from '../../../UI/Api/ApiLoading';
import Button from '../../../UI/Button/Button';
import DialogAlert from '../../../UI/Dialog/DialogAlert';
import Form from '../../../UI/FormMui/Form';
import FormContainer from '../../../UI/FormMui/FormContainer';
import TitleBar from '../../../UI/TitleBar/TitleBar';

const EditOneProvider = () => {
  const navigate = useNavigate();

  // id from router path
  const { id } = useParams();

  // get provider info
  const [apiGetState] = useAxiosGet(
    `/v1/app/challenges/providers/services/${id}`,
    'provider',
    true
  );

  // sender
  const [apiSendState, sendData] = useAxiosSend();

  // delete handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteClickHandler = () => {
    setDeleteOpen(true);
  };
  const deleteCancelHandler = () => {
    setDeleteOpen(false);
  };
  const deleteConfirmHandler = () => {
    setDeleteOpen(false);
    sendData(
      `/v1/app/challenges/providers/services/${id}`,
      'DELETE',
      { tag: apiGetState.provider.tag },
      true
    ).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        navigate('/providers');
      }
    });
  };

  const renderApiItems = apiGetState.isLoaded && !apiGetState.errorMessage; //&&
  // JSON.stringify({}) !== JSON.stringify(formState);

  return (
    <FormContainer>
      <TitleBar title='Edit Challenge Provider'>
        {renderApiItems && (
          <>
            <Button
              type='delete'
              onClick={deleteClickHandler}
              disabled={apiSendState.isSending}
            >
              Delete
            </Button>
          </>
        )}
      </TitleBar>

      {!apiGetState.isLoaded && <ApiLoading />}

      {apiGetState.errorMessage && (
        <ApiError
          code={apiGetState.errorCode}
          message={apiGetState.errorMessage}
        />
      )}

      {renderApiItems && (
        <>
          <DialogAlert
            title={`Are you sure you want to delete provider ${
              apiGetState.provider.type
            }${devMode ? ' (id:' + apiGetState.provider.id + ') ' : ''}?`}
            open={deleteOpen}
            onCancel={deleteCancelHandler}
            onConfirm={deleteConfirmHandler}
          >
            The following domains will become unavilable for challenge solving
            unless there is a wilcard provider and it supports them.
            <br />
            {apiGetState.provider.config.domains.join(', ')}
          </DialogAlert>

          <Form onSubmit={null}></Form>
        </>
      )}
    </FormContainer>
  );
};

export default EditOneProvider;
