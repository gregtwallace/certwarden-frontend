import { type FC } from 'react';

import { frontendVersion } from '../../../helpers/constants';
import { apiUrl } from '../../../helpers/environment';

import useClientSettings from '../../../hooks/useClientSettings';

import Button from '../../UI/Button/Button';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemRowRight from '../../UI/Grid/GridItemRowRight';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const FrontendStatus: FC = () => {
  // debug?
  const { showDebugInfo, toggleShowDebugInfo } = useClientSettings();

  return (
    <GridItemContainer>
      <GridTitle title='Frontend Status' />

      <GridItemText>Status: Available</GridItemText>

      <GridItemText>Version: {frontendVersion}</GridItemText>

      <GridItemText wordBreak='break-word'>API URL: {apiUrl}</GridItemText>

      <GridItemText>
        Show Debug Info: {showDebugInfo ? 'Yes' : 'No'}
      </GridItemText>

      <GridItemRowRight>
        <Button onClick={toggleShowDebugInfo}>Toggle Debug</Button>
      </GridItemRowRight>
    </GridItemContainer>
  );
};

export default FrontendStatus;
