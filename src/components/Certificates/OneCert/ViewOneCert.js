import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxiosGet from '../../../hooks/useAxiosGet';
import useAxiosSend from '../../../hooks/useAxiosSend';

import { convertUnixTime } from '../../../helpers/time';

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

  const [apiGetState, updateGet] = useAxiosGet(
    `/v1/certificates/${id}`,
    'certificate',
    true
  );

  const [sendApiState, sendData] = useAxiosSend();
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
    sendData(
      `/v1/certificates/${id}`,
      'DELETE',
      null,
      true
    ).then((success) => {
      if (success) {
        // back to the accounts page
        //navigate('.');
        navigate('/certificates');
      }
    });
  };

  // logic for subject alt names
  var subjectAlts = '<none>';
  if (
    apiGetState.certificate.subject_alts &&
    apiGetState.certificate.subject_alts.length !== 0
  ) {
    subjectAlts = apiGetState.certificate.subject_alts
      .map((altName) => altName)
      .join(', ');
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
            <strong>Account Name:</strong>{' '}
            {apiGetState.certificate.acme_account.name}
          </FormInformation>
          <FormInformation>
            <strong>Account Type:</strong>{' '}
            {apiGetState.certificate.acme_account.is_staging
              ? 'Staging'
              : 'Production'}
          </FormInformation>
          <FormInformation>
            <strong>Private Key:</strong>{' '}
            {apiGetState.certificate.private_key.name}
          </FormInformation>
          <FormInformation>
            <strong>Challenge Method:</strong>{' '}
            {apiGetState.certificate.challenge_method.name}
          </FormInformation>
          <FormInformation>
            <strong>Subject:</strong> {apiGetState.certificate.subject}
          </FormInformation>
          <FormInformation>
            <strong>Subject (Alternates):</strong> {subjectAlts}
          </FormInformation>
          <FormInformation>
            <strong>API Key:</strong> {apiGetState.certificate.api_key}
          </FormInformation>
          {apiGetState.certificate.api_key_via_url && (
            <FormInformation>
              <span className='text-danger'>
                Warning: API Key allowed via URL.
              </span>
            </FormInformation>
          )}

          <strong>CSR</strong>
          <FormInformation>
            <strong>Organization:</strong>{' '}
            {apiGetState.certificate.organization}
          </FormInformation>
          <FormInformation>
            <strong>Organizational Unit:</strong>{' '}
            {apiGetState.certificate.organizational_unit}
          </FormInformation>
          <FormInformation>
            <strong>Country Code (2 Letter):</strong>{' '}
            {apiGetState.certificate.country}
          </FormInformation>
          <FormInformation>
            <strong>City:</strong> {apiGetState.certificate.city}
          </FormInformation>

          <Orders
            certId={id}
            sendApiState={sendApiState}
            sendData={sendData}
            updateGet={updateGet}
          />

          <FormInformation>
            <small>
              Created: {convertUnixTime(apiGetState.certificate.created_at)}
            </small>
          </FormInformation>
          <FormInformation>
            <small>
              Last Updated:{' '}
              {convertUnixTime(apiGetState.certificate.updated_at)}
            </small>
          </FormInformation>
        </Form>
      </>
    );
  }
};

export default ViewOneCert;
