import { type FC } from 'react';

import KeyIcon from '@mui/icons-material/Key';

import IconButtonAsLink from '../../../../UI/Button/IconButtonAsLink';

type propTypes = {
  keyId: number | undefined;
  keyName: string | undefined;
};

const KeyItem: FC<propTypes> = (props) => {
  const { keyId, keyName } = props;

  return (
    <>
      {keyId && keyName && (
        <>
          <IconButtonAsLink to={`/privatekeys/${keyId}`} tooltip={keyName}>
            <KeyIcon />
          </IconButtonAsLink>
        </>
      )}
    </>
  );
};

export default KeyItem;
