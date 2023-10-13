import PropTypes from 'prop-types';

import { showDebugInfo } from '../../../../helpers/environment';

import GridTitle from '../../../UI/Grid/GridTitle';

const ProviderTitle = (props) => {
  const titleText =
    props.provider.type +
    (showDebugInfo ? ' (id: ' + props.provider.id + ')' : '');

  return <GridTitle title={titleText} />;
};

ProviderTitle.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProviderTitle;
