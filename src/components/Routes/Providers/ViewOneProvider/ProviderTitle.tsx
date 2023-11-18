import { type FC } from 'react';

import { showDebugInfo } from '../../../../helpers/environment';

import GridTitle from '../../../UI/Grid/GridTitle';

type propTypes = {
  provider: {
    id: number;
    type: string;
  };
};

const ProviderTitle: FC<propTypes> = (props) => {
  const titleText =
    props.provider.type +
    (showDebugInfo ? ' (id: ' + props.provider.id + ')' : '');

  return <GridTitle title={titleText} />;
};

export default ProviderTitle;
