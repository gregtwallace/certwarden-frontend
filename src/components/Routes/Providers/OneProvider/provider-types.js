import Http01InternalAdd from './Add/Http01InternalAdd';
import Http01InternalEdit from './Edit/Http01InternalEdit';

// providerTypes maps known types to their add and edit components
export const providerTypes = [
  {
    value: 'dns01cloudflare',
    name: 'DNS-01 Cloudflare',
    config_name: 'dns_01_cloudflare',
    addComponent: undefined,
    editComponent: undefined,
  },
  {
    value: 'http01internal',
    name: 'HTTP-01 Internal Server',
    config_name: 'http_01_internal',
    addComponent: Http01InternalAdd,
    editComponent: Http01InternalEdit,
  },
];
