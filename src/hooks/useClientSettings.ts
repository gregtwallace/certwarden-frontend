import { type clientSettingsContextType } from '../context/ClientSettingsProvider';

import { useContext } from 'react';

import { ClientSettingsContext } from '../context/ClientSettingsProvider';

const useClientSettings = (): clientSettingsContextType => {
  return useContext(ClientSettingsContext);
};

export default useClientSettings;
