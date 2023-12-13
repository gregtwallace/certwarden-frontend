import { type FC } from 'react';

import ButtonAsLink from '../../UI/Button/ButtonAsLink';
import GridItemContainer from '../../UI/Grid/GridItemContainer';
import GridItemRowRight from '../../UI/Grid/GridItemRowRight';
import GridItemText from '../../UI/Grid/GridItemText';
import GridTitle from '../../UI/Grid/GridTitle';

const BackupRestoreSettings: FC = () => {
  return (
    <GridItemContainer>
      <GridTitle title='Backup and Restore' />

      <GridItemText>Backup and Restore options are here:</GridItemText>

      <GridItemRowRight>
        <ButtonAsLink to='/backuprestore'>Backup & Restore</ButtonAsLink>
      </GridItemRowRight>
    </GridItemContainer>
  );
};

export default BackupRestoreSettings;
