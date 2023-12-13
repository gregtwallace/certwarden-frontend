import { type FC } from 'react';

import BackupNewDownload from './BackupNewDownload';
import BackupOnDisk from './BackupOnDisk';
import Restore from './Restore';

const BackupRestore: FC = () => {
  return (
    <>
      <BackupNewDownload />
      <BackupOnDisk />
      <Restore />
    </>
  );
};

export default BackupRestore;
