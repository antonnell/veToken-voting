import async from 'async';
import {
  MAX_UINT256,
  ERROR,
  TX_SUBMITTED,
  STORE_UPDATED,
  GAUGE_UPDATED,
  CONFIGURE_GAUGES,
  GAUGES_CONFIGURED,
  GET_PROJECTS,
  PROJECTS_RETURNED,
  GET_PROJECT,
  PROJECT_RETURNED
} from './constants';

import * as moment from 'moment';

import stores from './';
import { ERC20ABI } from './abis';
import { bnDec } from '../utils';
import BigNumber from 'bignumber.js';

const fetch = require('node-fetch');

class Store {
  constructor(dispatcher, emitter) {
    this.dispatcher = dispatcher;
    this.emitter = emitter;

    this.store = {
      projects: [
        {
          id: 'yearn',
          name: 'Yearn',
          logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png',
          url: 'yearn.finance',
          gaugeProxyAddress: '',
          tokenMetadata: {
            address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            symbol: 'YFI',
            decimals: 18,
            logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
          },
          veTokenMetadata: {
            address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            symbol: 'veYFI',
            decimals: 18,
            logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
          },
          vaults: [
            {
              address: 'addy',
              name: 'Farm 1',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 2',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 3',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 4',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            }
          ]
        },
        {
          id: 'spirit',
          name: 'Spirit Swap',
          logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png',
          url: 'spiritswap.finance',
          gaugeProxyAddress: '',
          tokenMetadata: {
            address: '0x5cc61a78f164885776aa610fb0fe1257df78e59b',
            symbol: 'spirit',
            decimals: 18,
            logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
          },
          veTokenMetadata: {
            address: '0x5cc61a78f164885776aa610fb0fe1257df78e59b',
            symbol: 'veSpirit',
            decimals: 18,
            logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
          },
          vaults: [
            {
              address: 'addy',
              name: 'Farm 1',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 2',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 3',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            },
            {
              address: 'addy',
              name: 'Farm 4',
              logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/yearn.finance.png'
            }
          ]
        }
      ]
    };

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE_GAUGES:
            this.configure(payload);
            break;
          case GET_PROJECTS:
            this.getProjects(payload);
            break;
          case GET_PROJECT:
            this.getProject(payload);
            break;
          default: {
          }
        }
      }.bind(this),
    );
  }

  getStore = (index) => {
    return this.store[index];
  };

  setStore = (obj) => {
    this.store = { ...this.store, ...obj };
    console.log(this.store);
    return this.emitter.emit(STORE_UPDATED);
  };

  configure = async (payload) => {
    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    this.emitter.emit(GAUGES_CONFIGURED)
  };

  getProjects = async (payload) => {
    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    const projects = await this._getProjects()

    this.emitter.emit(PROJECTS_RETURNED, projects)
  }

  _getProjects = async () => {
    // ...
    // get contract where we store projects
    // get project info
    // store them into the storage


    // for now just return stored projects
    return this.getStore('projects')

  }

  getProject = async (payload) => {
    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    console.log(payload)

    const projects = await this._getProjects()

    console.log(projects)
    let project = projects.filter((project) => {
      return project.id === payload.content.id
    })

    console.log(project)

    if(project.length > 0) {
      project = project[0]
    }

    this.emitter.emit(PROJECT_RETURNED, project)
  }

  _callContract = (web3, contract, method, params, account, gasPrice, dispatchEvent, callback) => {
    const context = this;
    contract.methods[method](...params)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
      })
      .on('transactionHash', function (hash) {
        context.emitter.emit(TX_SUBMITTED, hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (dispatchEvent && confirmationNumber === 1) {
          context.dispatcher.dispatch({ type: dispatchEvent });
        }
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
}

export default Store;
