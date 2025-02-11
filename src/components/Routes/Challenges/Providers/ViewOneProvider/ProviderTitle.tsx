import { type FC } from 'react';

import useClientSettings from '../../../../../hooks/useClientSettings';

import GridTitle from '../../../../UI/Grid/GridTitle';

type propTypes = {
  provider: {
    id: number;
    type: string;
  };
};

const ProviderTitle: FC<propTypes> = (props) => {
  // debug?
  const { showDebugInfo } = useClientSettings();

  const titleText =
    props.provider.type +
    (showDebugInfo ? ' (id: ' + props.provider.id.toString() + ')' : '');

  return <GridTitle title={titleText} />;
};

export default ProviderTitle;
