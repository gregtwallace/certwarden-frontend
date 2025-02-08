import { type selectInputOption } from './input-handler';

// func to build server list
type acmeServer = {
  id: number;
  name: string;
  is_staging: boolean;
};

export const buildAcmeServerOptions = (
  allServers: acmeServer[]
  // currentServer?: acmeServer | undefined
): selectInputOption<number>[] => {
  const acmeServers: selectInputOption<number>[] = [];

  // special treatment if current key is provided
  // if (currentServer) {
  //   acmeServers.push({
  //     value: currentServer.id,
  //     name:
  //       currentServer.name +
  //       (currentServer.is_staging ? ' (Staging)' : '') +
  //       ' - Current',
  //     alsoSet: [
  //       {
  //         name: 'dataToSubmit.accepted_tos',
  //         value: false,
  //       },
  //     ],
  //   });
  // }

  return acmeServers.concat(
    allServers.map((serv) => ({
      value: serv.id,
      name: serv.name + (serv.is_staging ? ' (Staging)' : ''),
      alsoSet: [
        {
          name: 'dataToSubmit.accepted_tos',
          value: false,
        },
      ],
    }))
  );
};

// func to build private key select options list
type privateKeyType = {
  id: number;
  name: string;
};

type privateKeyWithAlgType = privateKeyType & {
  algorithm: {
    name: string;
  };
};

export const buildPrivateKeyOptions = (
  allKeys: privateKeyWithAlgType[],
  currentKey?: privateKeyType
): selectInputOption<number>[] => {
  const privateKeys: selectInputOption<number>[] = [];

  // special treatment if current key is provided
  if (currentKey) {
    privateKeys.push({
      value: currentKey.id,
      name: currentKey.name + ' - Current',
    });
  }

  return privateKeys.concat(
    allKeys.map((key) => ({
      value: key.id,
      name: key.name + ' (' + key.algorithm.name + ')',
    }))
  );
};

// func to build acme account list
export type acmeAccount = {
  id: number;
  name: string;
  status: string;
  kid: string;
  acme_server: {
    is_staging: boolean;
  };
};

export const buildAcmeAccountOptions = (
  allAcmeAccounts: acmeAccount[],
  filterFunc?: (acct: acmeAccount) => boolean
): selectInputOption<number>[] => {
  const acmeAccounts: selectInputOption<number>[] = [];

  // if received a filterFunc, use it
  if (filterFunc) {
    allAcmeAccounts.map((acct) => {
      if (filterFunc(acct)) {
        acmeAccounts.push({
          value: acct.id,
          name: acct.name + (acct.acme_server.is_staging ? ' (Staging)' : ''),
        });
      }
    });
    return acmeAccounts;
  }

  // else, no filter
  return acmeAccounts.concat(
    allAcmeAccounts.map((acct) => ({
      value: acct.id,
      name: acct.name + (acct.acme_server.is_staging ? ' (Staging)' : ''),
    }))
  );
};
