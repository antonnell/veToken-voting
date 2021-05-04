import BigNumber from 'bignumber.js';

// URLS
export const GAS_PRICE_API = 'https://gasprice.poa.network/';
export const ETHERSCAN_URL = 'https://etherscan.io/';


// DEFINE CONTRACT ADDRESSES



// GENERAL
export const ERROR = 'ERROR';
export const STORE_UPDATED = 'STORE_UPDATED';
export const TX_SUBMITTED = 'TX_SUBMITTED';

export const CONNECTION_CONNECTED = 'CONNECTION_CONNECTED';
export const CONNECTION_DISCONNECTED = 'CONNECTION_DISCONNECTED';
export const CONNECT_WALLET = 'CONNECT_WALLET';

export const CONFIGURE = 'CONFIGURE';
export const CONFIGURE_RETURNED = 'CONFIGURE_RETURNED';

export const ACCOUNT_CONFIGURED = 'ACCOUNT_CONFIGURED';
export const ACCOUNT_CHANGED = 'ACCOUNT_CHANGED';

export const GET_GAS_PRICES = 'GET_GAS_PRICES';
export const GAS_PRICES_RETURNED = 'GAS_PRICES_RETURNED';


// PROJECTS
export const GET_PROJECTS = 'GET_PROJECTS';
export const PROJECTS_RETURNED = 'PROJECTS_RETURNED'

export const GET_PROJECT = 'GET_PROJECT'
export const PROJECT_RETURNED = 'PROJECT_RETURNED'




// GAUGES
export const CONFIGURE_GAUGES = 'CONFIGURE_GAUGES'
export const GAUGES_CONFIGURED = 'GAUGES_CONFIGURED'




export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0);
