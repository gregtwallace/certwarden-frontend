import useAxiosGet from '../../hooks/useAxiosGet';

import { iso8601ToPretty } from '../../helpers/time';

import ApiLoading from '../UI/Api/ApiLoading';
import ApiError from '../UI/Api/ApiError';
import H2Header from '../UI/Header/H2Header';
import InputTextArea from '../UI/Form/InputTextArea';

const LogViewer = () => {
  const [apiGetState] = useAxiosGet('/v1/logs', 'logs', true);

  if (apiGetState.errorMessage) {
    return <ApiError>{apiGetState.errorMessage}</ApiError>;
  } else if (!apiGetState.isLoaded) {
    return <ApiLoading />;
  } else {
    return (
      <>
        <H2Header h2='Logs'></H2Header>
        <InputTextArea
          rows='40'
          readOnly
          value={apiGetState?.logs
            .map(
              (entry) =>
                iso8601ToPretty(entry.ts) +
                ', ' +
                entry.level +
                ', ' +
                entry.caller +
                ', ' +
                entry.msg
            )
            .reverse()
            .join('\n')}
        />
      </>
    );
  }
};

export default LogViewer;
