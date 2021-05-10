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
  PROJECT_RETURNED,
  GET_TOKEN_BALANCES,
  TOKEN_BALANCES_RETURNED,
  LOCK,
  LOCK_RETURNED,
  APPROVE_LOCK,
  APPROVE_LOCK_RETURNED,
  VOTE,
  VOTE_RETURNED
} from './constants';

import { ERC20_ABI, GAUGE_CONTROLLER_ABI, GAUGE_ABI, VOTING_ESCROW_ABI, PICKLE_GAUGE_CONTROLLER_ABI } from './abis';

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
      configured: false,
      projects: [
        {
          type: 'curve',
          id: 'curve',
          name: 'curve.fi',
          logo: 'https://assets.coingecko.com/coins/images/12124/large/Curve.png',
          url: 'https://curve.fi',
          gaugeProxyAddress: '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
          gauges: [],
          vaults: [],
          tokenMetadata: {},
          veTokenMetadata: {},
        },
        {
          type: 'pickle',
          id: 'pickle',
          name: 'Pickle.finance',
          logo: 'https://assets.coingecko.com/coins/images/12435/large/pickle_finance_logo.jpg',
          url: 'https://pickle.finance',
          gaugeProxyAddress: '0x2e57627ACf6c1812F99e274d0ac61B786c19E74f',
          gauges: [],
          vaults: [],
          tokenMetadata: {},
          veTokenMetadata: {},
        },
      ],
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
          case GET_TOKEN_BALANCES:
            this.getTokenBalances(payload);
            break;
          case LOCK:
            this.lock(payload);
            break;
          case APPROVE_LOCK:
            this.approveLock(payload);
            break;
          case VOTE:
            this.vote(payload);
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

    const projects = this.getStore('projects');

    async.map(
      projects,
      (project, callback) => {
        this._getProjectData(project, callback);
      },
      (err, data) => {
        if (err) {
          this.emitter.emit(ERROR);
          return;
        }

        this.setStore({ projects: data, configured: true });

        this.emitter.emit(GAUGES_CONFIGURED);
      },
    );
  };

  _getProjectData = (project, callback) => {
    if(project.type === 'curve') {
      this._getProjectDataCurve(project, callback)
    } else if (project.type === 'pickle') {
      this._getProjectDataPickle(project, callback)
    }
  };

  _getProjectDataPickle = async (project, callback) => {
    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    const gaugeControllerContract = new web3.eth.Contract(PICKLE_GAUGE_CONTROLLER_ABI, project.gaugeProxyAddress);

    // get all the gaugesLPTokens
    const gaugesLPTokens = await gaugeControllerContract.methods.tokens().call();

    // get all the gauges
    const gaugesPromises = gaugesLPTokens.map((token) => {
      return new Promise((resolve, reject) => {
        resolve(gaugeControllerContract.methods.getGauge(token).call());
      });
    });

    const gauges = await Promise.all(gaugesPromises);

    // get the gauge relative weights
    const gaugesRelativeWeightsPromise = gaugesLPTokens.map((token) => {
      return new Promise((resolve, reject) => {
        resolve(gaugeControllerContract.methods.weights(token).call());
      });
    });

    const gaugesRelativeWeights = await Promise.all(gaugesRelativeWeightsPromise);

    // get LP token info
    const lpTokensPromise = gaugesLPTokens
      .map((lpToken) => {
        const lpTokenContract = new web3.eth.Contract(ERC20_ABI, lpToken);

        const promises = [];
        const namePromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.name().call());
        });
        const symbolPromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.symbol().call());
        });
        const decimalsPromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.decimals().call());
        });

        promises.push(namePromise);
        promises.push(symbolPromise);
        promises.push(decimalsPromise);

        return promises;
      })
      .flat();

    const lpTokens = await Promise.all(lpTokensPromise);

    let projectGauges = [];
    for (let i = 0; i < gauges.length; i++) {
      const gauge = {
        address: gauges[i],
        relativeWeight: BigNumber(gaugesRelativeWeights[i]).div(1e18).toNumber(),
        lpToken: {
          address: gaugesLPTokens[i],
          name: lpTokens[i * 3],
          symbol: lpTokens[i * 3 + 1],
          decimals: lpTokens[i * 3 + 2],
        },
      };

      projectGauges.push(gauge);
    }

    const totalWeight = await gaugeControllerContract.methods.totalWeight().call();

    const tokenAddress = await gaugeControllerContract.methods.PICKLE().call();
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

    const veTokenAddress = await gaugeControllerContract.methods.DILL().call();
    const veTokenContract = new web3.eth.Contract(ERC20_ABI, veTokenAddress);

    const projectTokenMetadata = {
      address: web3.utils.toChecksumAddress(tokenAddress),
      symbol: await tokenContract.methods.symbol().call(),
      decimals: parseInt(await tokenContract.methods.decimals().call()),
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${web3.utils.toChecksumAddress(tokenAddress)}/logo.png`,
    };

    const projectVeTokenMetadata = {
      address: web3.utils.toChecksumAddress(veTokenAddress),
      symbol: await veTokenContract.methods.symbol().call(),
      decimals: parseInt(await veTokenContract.methods.decimals().call()),
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${web3.utils.toChecksumAddress(veTokenAddress)}/logo.png`,
    };

    project.totalWeight = BigNumber(totalWeight).div(1e18).toNumber();
    project.tokenMetadata = projectTokenMetadata;
    project.veTokenMetadata = projectVeTokenMetadata;
    project.gauges = projectGauges;

    callback(null, project);
  }

  _getProjectDataCurve = async (project, callback) => {
    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    const gaugeControllerContract = new web3.eth.Contract(GAUGE_CONTROLLER_ABI, project.gaugeProxyAddress);

    // get how many gauges there are
    const n_gauges = await gaugeControllerContract.methods.n_gauges().call();
    const tmpArr = [...Array(parseInt(n_gauges)).keys()];

    // get all the gauges
    const gaugesPromises = tmpArr.map((gauge, idx) => {
      return new Promise((resolve, reject) => {
        resolve(gaugeControllerContract.methods.gauges(idx).call());
      });
    });

    const gauges = await Promise.all(gaugesPromises);

    // get the gauge relative weights
    const gaugesRelativeWeightsPromise = gauges.map((gauge) => {
      return new Promise((resolve, reject) => {
        resolve(gaugeControllerContract.methods.gauge_relative_weight(gauge).call());
      });
    });

    const gaugesRelativeWeights = await Promise.all(gaugesRelativeWeightsPromise);

    // get the gauge lp token
    const gaugesLPTokensPromise = gauges.map((gauge) => {
      return new Promise((resolve, reject) => {
        const gaugeContract = new web3.eth.Contract(GAUGE_ABI, gauge);

        resolve(gaugeContract.methods.lp_token().call());
      });
    });

    const gaugesLPTokens = await Promise.all(gaugesLPTokensPromise);

    // get LP token info
    const lpTokensPromise = gaugesLPTokens
      .map((lpToken) => {
        const lpTokenContract = new web3.eth.Contract(ERC20_ABI, lpToken);

        const promises = [];
        const namePromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.name().call());
        });
        const symbolPromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.symbol().call());
        });
        const decimalsPromise = new Promise((resolve, reject) => {
          resolve(lpTokenContract.methods.decimals().call());
        });

        promises.push(namePromise);
        promises.push(symbolPromise);
        promises.push(decimalsPromise);

        return promises;
      })
      .flat();

    const lpTokens = await Promise.all(lpTokensPromise);

    let projectGauges = [];
    for (let i = 0; i < gauges.length; i++) {
      const gauge = {
        address: gauges[i],
        relativeWeight: BigNumber(gaugesRelativeWeights[i]).div(1e18).toNumber(),
        lpToken: {
          address: gaugesLPTokens[i],
          name: lpTokens[i * 3],
          symbol: lpTokens[i * 3 + 1],
          decimals: lpTokens[i * 3 + 2],
        },
      };

      projectGauges.push(gauge);
    }

    const totalWeight = await gaugeControllerContract.methods.get_total_weight().call();

    const tokenAddress = await gaugeControllerContract.methods.token().call();
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

    const veTokenAddress = await gaugeControllerContract.methods.voting_escrow().call();
    const veTokenContract = new web3.eth.Contract(ERC20_ABI, veTokenAddress);

    const projectTokenMetadata = {
      address: web3.utils.toChecksumAddress(tokenAddress),
      symbol: await tokenContract.methods.symbol().call(),
      decimals: parseInt(await tokenContract.methods.decimals().call()),
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${web3.utils.toChecksumAddress(tokenAddress)}/logo.png`,
    };

    const projectVeTokenMetadata = {
      address: web3.utils.toChecksumAddress(veTokenAddress),
      symbol: await veTokenContract.methods.symbol().call(),
      decimals: parseInt(await veTokenContract.methods.decimals().call()),
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${web3.utils.toChecksumAddress(veTokenAddress)}/logo.png`,
    };

    project.totalWeight = BigNumber(totalWeight).div(1e18).toNumber();
    project.tokenMetadata = projectTokenMetadata;
    project.veTokenMetadata = projectVeTokenMetadata;
    project.gauges = projectGauges;

    callback(null, project);
  }

  getProjects = async (payload) => {
    const projects = await this._getProjects();

    this.emitter.emit(PROJECTS_RETURNED, projects);
  };

  _getProjects = async () => {
    // ...
    // get contract where we store projects
    // get project info
    // store them into the storage

    // for now just return stored projects
    return this.getStore('projects');
  };

  getProject = async (payload) => {

    const configured = this.getStore('configured')
    if(!configured) {
      return;
    }

    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    const projects = await this._getProjects();

    let project = projects.filter((project) => {
      return project.id === payload.content.id;
    });

    if (project.length > 0) {
      project = project[0];
    }

    this.emitter.emit(PROJECT_RETURNED, project);
  };

  getTokenBalances = async (payload) => {
    const configured = this.getStore('configured')
    if(!configured) {
      return;
    }

    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return null;
    }

    const account = stores.accountStore.getStore('account');
    if (!account || !account.address) {
      return null;
    }

    const projects = await this._getProjects();

    let project = projects.filter((project) => {
      return project.id === payload.content.id;
    });

    if (project.length > 0) {
      project = project[0];
    }

    const tokenContract = new web3.eth.Contract(ERC20_ABI, project.tokenMetadata.address);
    const tokenBalance = await tokenContract.methods.balanceOf(account.address).call();
    const allowance = await tokenContract.methods.allowance(account.address, project.veTokenMetadata.address).call();
    const totalLocked = await tokenContract.methods.balanceOf(project.veTokenMetadata.address).call();

    const veTokenContract = new web3.eth.Contract(ERC20_ABI, project.veTokenMetadata.address);
    const veTokenBalance = await veTokenContract.methods.balanceOf(account.address).call();
    const totalSupply = await veTokenContract.methods.totalSupply().call();

    project.tokenMetadata.balance = BigNumber(tokenBalance)
      .div(10 ** project.tokenMetadata.decimals)
      .toFixed(project.tokenMetadata.decimals);
    project.tokenMetadata.allowance = BigNumber(allowance)
      .div(10 ** project.tokenMetadata.decimals)
      .toFixed(project.tokenMetadata.decimals);
    project.tokenMetadata.totalLocked = BigNumber(totalLocked)
      .div(10 ** project.tokenMetadata.decimals)
      .toFixed(project.tokenMetadata.decimals);
    project.veTokenMetadata.balance = BigNumber(veTokenBalance)
      .div(10 ** project.veTokenMetadata.decimals)
      .toFixed(project.veTokenMetadata.decimals);
    project.veTokenMetadata.totalSupply = BigNumber(totalSupply)
      .div(10 ** project.veTokenMetadata.decimals)
      .toFixed(project.veTokenMetadata.decimals);

    let gaugeControllerContract = null
    let voteWeights = []

    if(project.type === 'curve') {
      // get the gauge vote weights for the user
      gaugeControllerContract = new web3.eth.Contract(GAUGE_CONTROLLER_ABI, project.gaugeProxyAddress);

      const gaugesVoteWeightsPromise = project.gauges.map((gauge) => {
        return new Promise((resolve, reject) => {
          resolve(gaugeControllerContract.methods.vote_user_slopes(account.address, gauge.address).call());
        });
      });

      voteWeights = await Promise.all(gaugesVoteWeightsPromise);

    } else if (project.type === 'pickle') {
      // get the gauge vote weights for the user
      gaugeControllerContract = new web3.eth.Contract(PICKLE_GAUGE_CONTROLLER_ABI, project.gaugeProxyAddress);

      const gaugesVoteWeightsPromise = project.gauges.map((gauge) => {
        return new Promise((resolve, reject) => {
          resolve(gaugeControllerContract.methods.votes(account.address, gauge.lpToken.address).call());
        });
      });

      voteWeights = await Promise.all(gaugesVoteWeightsPromise);
    }

    let totalPercentUsed = 0

    for (let i = 0; i < project.gauges.length; i++) {
      const gaugeVotePercent = BigNumber(voteWeights[i]).div(100)
      project.gauges[i].userVotesPercent = gaugeVotePercent.toFixed(2)
      totalPercentUsed = BigNumber(totalPercentUsed).plus(gaugeVotePercent)
    }

    project.userVotesPercent = totalPercentUsed.toFixed(2)

    let newProjects = projects.map((proj) => {
      if (proj.id === project.id) {
        return project;
      }

      return proj;
    });

    this.setStore({ projects: newProjects });

    this.emitter.emit(TOKEN_BALANCES_RETURNED, project);
  };

  approveLock = async (payload) => {
    const account = stores.accountStore.getStore('account');
    if (!account) {
      return false;
      //maybe throw an error
    }

    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return false;
      //maybe throw an error
    }

    const { amount, project } = payload.content;

    this._callApproveLock(web3, project, account, amount, (err, approveResult) => {
      if (err) {
        return this.emitter.emit(ERROR, err);
      }

      return this.emitter.emit(APPROVE_LOCK_RETURNED, approveResult);
    });
  };

  _callApproveLock = async (web3, project, account, amount, callback) => {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, project.tokenMetadata.address);

    let amountToSend = '0';
    if (amount === 'max') {
      amountToSend = MAX_UINT256;
    } else {
      amountToSend = BigNumber(amount)
        .times(10 ** project.tokenMetadata.decimals)
        .toFixed(0);
    }

    const gasPrice = await stores.accountStore.getGasPrice('fast');

    this._callContractWait(web3, tokenContract, 'approve', [project.veTokenMetadata.address, amountToSend], account, gasPrice, GET_TOKEN_BALANCES, { id: project.id }, callback);
  };

  lock = async (payload) => {
    const account = stores.accountStore.getStore('account');
    if (!account) {
      return false;
      //maybe throw an error
    }

    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return false;
      //maybe throw an error
    }

    const { amount, selectedDate, project } = payload.content;

    this._callLock(web3, project, account, amount, selectedDate, (err, lockResult) => {
      if (err) {
        return this.emitter.emit(ERROR, err);
      }

      return this.emitter.emit(LOCK_RETURNED, lockResult);
    });
  };

  _callLock = async (web3, project, account, amount, selectedDate, callback) => {
    const escrowContract = new web3.eth.Contract(VOTING_ESCROW_ABI, project.veTokenMetadata.address);

    const amountToSend = BigNumber(amount)
      .times(10 ** project.tokenMetadata.decimals)
      .toFixed(0);

    const gasPrice = await stores.accountStore.getGasPrice('fast');

    this._callContractWait(web3, escrowContract, 'create_lock', [amountToSend, selectedDate], account, gasPrice, GET_TOKEN_BALANCES, { id: project.id }, callback);
  };

  vote = async (payload) => {
    const account = stores.accountStore.getStore('account');
    if (!account) {
      return false;
      //maybe throw an error
    }

    const web3 = await stores.accountStore.getWeb3Provider();
    if (!web3) {
      return false;
      //maybe throw an error
    }

    const { amount, gaugeAddress, project } = payload.content;

    this._calVoteForGaugeWeights(web3, project, account, amount, gaugeAddress, (err, voteResult) => {
      if (err) {
        return this.emitter.emit(ERROR, err);
      }

      return this.emitter.emit(VOTE_RETURNED, voteResult);
    });
  };

  _calVoteForGaugeWeights = async (web3, project, account, amount, gaugeAddress, callback) => {
    const gaugeControllerContract = new web3.eth.Contract(GAUGE_CONTROLLER_ABI, project.gaugeProxyAddress);

    const amountToSend = BigNumber(amount)
      .times(100)
      .toFixed(0);

    const gasPrice = await stores.accountStore.getGasPrice('fast');

    console.log(gaugeControllerContract)
    console.log('vote_for_gauge_weights')
    console.log([gaugeAddress, amountToSend])

    this._callContractWait(web3, gaugeControllerContract, 'vote_for_gauge_weights', [gaugeAddress, amountToSend], account, gasPrice, GET_TOKEN_BALANCES, { id: project.id }, callback);
  };

  _callContract = (web3, contract, method, params, account, gasPrice, dispatchEvent, dispatchEventPayload, callback) => {
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
        console.log(receipt)
        console.log(confirmationNumber)
        if (dispatchEvent && confirmationNumber == 0) {
          context.dispatcher.dispatch({ type: dispatchEvent, content: dispatchEventPayload });
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

  _callContractWait = (web3, contract, method, params, account, gasPrice, dispatchEvent, dispatchEventPayload, callback) => {
    const context = this;
    contract.methods[method](...params)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
      })
      .on('transactionHash', function (hash) {
        context.emitter.emit(TX_SUBMITTED, hash);
      })
      .on('receipt', function (receipt) {
        console.log(receipt)
        callback(null, receipt.transactionHash);

        if (dispatchEvent) {
          console.log('dispatching new event')
          console.log(dispatchEvent)
          console.log(dispatchEventPayload)
          context.dispatcher.dispatch({ type: dispatchEvent, content: dispatchEventPayload });
        }
      })
      // .on('confirmation', function (confirmationNumber, receipt) {
      //   console.log(receipt)
      //   console.log(confirmationNumber)
      //   if(confirmationNumber === 0) {
      //     callback(null, hash);
      //
      //     if (dispatchEvent) {
      //       context.dispatcher.dispatch({ type: dispatchEvent, content: dispatchEventPayload });
      //     }
      //   }
      //
      // })
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
