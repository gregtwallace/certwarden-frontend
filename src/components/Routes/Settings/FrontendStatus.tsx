import { type FC } from 'react';

import { frontendVersion } from '../../../helpers/constants';
import { showDebugInfo } from '../../../helpers/environment';
import { apiUrl } from '../../../helpers/environment';

import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const FrontendStatus: FC = () => {
  return (
    <GridItemContainer>
      <GridTitle title='Frontend Status' />

      <GridItemText>Status: Available</GridItemText>

      <GridItemText>Version: {frontendVersion}</GridItemText>

      <GridItemText wordBreak='break-word'>API URL: {apiUrl}</GridItemText>

      <GridItemText>
        Show Debug Info: {showDebugInfo ? 'Yes' : 'No'}
      </GridItemText>
    </GridItemContainer>
  );
};

export default FrontendStatus;
