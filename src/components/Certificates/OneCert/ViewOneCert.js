import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useApiGet from '../../../hooks/useApiGet';
import useApiSend from '../../../hooks/useApiSend';

import ApiError from '../../UI/Api/ApiError';
import ApiLoading from '../../UI/Api/ApiLoading';
import FormInformation from '../../UI/Form/FormInformation';
import Button from '../../UI/Button/Button';
import Form from '../../UI/Form/Form';
import Modal from '../../UI/Modal/Modal';
import H2Header from '../../UI/Header/H2Header';

import Orders from './Orders/Orders';

// TODO: Revoke functionality
// TODO: CSR fields

const ViewOneCert = () => {
  const { id } = useParams();

  const [apiGetState] = useApiGet(
    `/v1/certificates/${id}`,
    'certificate'
  );

  const [sendApiState, sendData] = useApiSend();
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();

  // button handlers
  const editClickHandler = (event) => {
    event.preventDefault();
    navigate(`/certificates/${id}/edit`);
  };

  const backClickHandler = (event) => {
    event.preventDefault();
    navigate('/certificates');
  };

  // delete handlers
  const deleteClickHandler = () => {
    setDeleteModal(true);
  };
  const deleteCancelHandler = () => {
    setDeleteModal(false);
  };
  const deleteConfirmHandler = () => {
    setDeleteModal(false);
    sendData(`/v1/certificates/${apiGetState.certificate.id}`, 'DELETE').then(
      (success) => {
        if (success) {
          // back to the accounts page
          //navigate('.');
          navigate('/certificates');
        }
      }
    );
  };

  // logic for subject alt names
  var subjectAlts = '<none>'
  if (apiGetState.certificate.subject_alts) {
    subjectAlts = apiGetState.certificate.subject_alts.map((altName) => altName).join(', ')
  }

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        {deleteModal && (
          <Modal
            title={`Delete Certificate - ${apiGetState.certificate.name}`}
            hasCancel
            onClickCancel={deleteCancelHandler}
            hasConfirm
            onClickConfirm={deleteConfirmHandler}
          >
            Are you sure you want to delete the certificate '
            {apiGetState.certificate.name}'?
            <br />
            The certificate may be come irrecoverable, including being unable to
            revoke it.
          </Modal>
        )}
        <H2Header h2='Certificate'>
          <Button
            type='back'
            onClick={backClickHandler}
            disabled={sendApiState.isSending}
          >
            Back
          </Button>
          <Button
            type='edit'
            onClick={editClickHandler}
            disabled={sendApiState.isSending}
          >
            Edit
          </Button>
          <Button
            type='delete'
            onClick={deleteClickHandler}
            disabled={sendApiState.isSending}
          >
            Delete
          </Button>
        </H2Header>

        <Form>
          <FormInformation>
            <strong>Name:</strong> {apiGetState.certificate.name}
          </FormInformation>
          <FormInformation>
          <strong>Description:</strong> {apiGetState.certificate.description}
          </FormInformation>
          <FormInformation>
          <strong>Account Name:</strong> {apiGetState.certificate.acme_account.name}
          </FormInformation>
          <FormInformation>
          <strong>Account Type:</strong>{' '}
            {apiGetState.certificate.acme_account.is_staging
              ? 'Staging'
              : 'Production'}
          </FormInformation>
          <FormInformation>
          <strong>Challenge Method:</strong> {apiGetState.certificate.challenge_method.name}
          </FormInformation>
          <FormInformation>
          <strong>Subject:</strong> {apiGetState.certificate.subject}
          </FormInformation>
          <FormInformation>
          <strong>Subject (Alternates):</strong>{' '}
            {subjectAlts}
          </FormInformation>
          <FormInformation>
            <strong>TODO: </strong>CSR Stuff
          </FormInformation>

          <FormInformation>
          <strong>API Key:</strong> {apiGetState.certificate.api_key}
          </FormInformation>

          <Orders certId={id} />

          <FormInformation>
            <small>Created: {apiGetState.certificate.created_at}</small>
          </FormInformation>
          <FormInformation>
            <small>Last Updated: {apiGetState.certificate.updated_at}</small>
          </FormInformation>
        </Form>
      </>
    );
  }
};

export default ViewOneCert;
