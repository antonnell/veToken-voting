import async from "async";
import {
  GAS_PRICE_API,
  ERROR,
  STORE_UPDATED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  ACCOUNT_CHANGED,
  GET_GAS_PRICES,
  GAS_PRICES_RETURNED,
  CONFIGURE_GAUGES
} from "./constants";

import { ERC20ABI } from "./abis";

import { bnDec } from "../utils";

import stores from "./";

import {
  injected,
  walletconnect,
  walletlink,
  fortmatic,
  portis,
  network
} from "./connectors";

import BigNumber from "bignumber.js";
import Web3 from "web3";

class Store {
  constructor(dispatcher, emitter) {
    this.dispatcher = dispatcher;
    this.emitter = emitter;

    this.store = {
      account: null,
      web3context: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Fortmatic: fortmatic,
        Portis: portis
      },
      gasPrices: {
        slow: 90,
        standard: 90,
        fast: 100,
        instant: 130
      },
      gasSpeed: "fast",
      currentBlock: 11743358
    };

    dispatcher.register(
      function(payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return this.store[index];
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    console.log(this.store);
    return this.emitter.emit(STORE_UPDATED);
  }

  configure = async () => {
    this.getGasPrices();
    this.getCurrentBlock();

    injected.isAuthorized()
      .then(isAuthorized => {
        if (isAuthorized) {
          injected
            .activate()
            .then(a => {
              this.setStore({
                account: { address: a.account },
                web3context: { library: { provider: a.provider } }
              });
              this.emitter.emit(CONFIGURE_RETURNED);
              this.dispatcher.dispatch({ type: CONFIGURE_GAUGES });
            })
            .catch(e => {
              this.emitter.emit(ERROR, e);
              this.emitter.emit(CONFIGURE_RETURNED);
            });
        } else {
          //we can ignore if not authorized.
          this.emitter.emit(CONFIGURE_RETURNED);
        }
      })
      .catch(e => {
        this.emitter.emit(ERROR, e);
        this.emitter.emit(CONFIGURE_RETURNED);
      });

    if (window.ethereum) {
      this.updateAccount();
    } else {
      window.removeEventListener("ethereum#initialized", this.updateAccount);
      window.addEventListener("ethereum#initialized", this.updateAccount, {
        once: true
      });
    }
  };

  updateAccount = () => {
    const that = this;
    const res = window.ethereum.on("accountsChanged", function(accounts) {
      that.setStore({
        account: { address: accounts[0] },
        web3context: { library: { provider: window.ethereum } }
      });
      that.emitter.emit(ACCOUNT_CHANGED);
      that.emitter.emit(CONFIGURE_RETURNED);

      that.dispatcher.dispatch({ type: CONFIGURE_GAUGES });
    });
  };

  getCurrentBlock = async payload => {
    try {
      var web3 = new Web3(process.env.NEXT_PUBLIC_PROVIDER);
      const block = await web3.eth.getBlockNumber();
      this.setStore({ currentBlock: block });
    } catch (ex) {
      console.log(ex);
    }
  };

  getGasPrices = async payload => {
    const gasPrices = await this._getGasPrices();
    let gasSpeed = localStorage.getItem("yearn.finance-gas-speed");

    if (!gasSpeed) {
      gasSpeed = "fast";
      localStorage.getItem("yearn.finance-gas-speed", "fast");
    }

    this.setStore({ gasPrices: gasPrices, gasSpeed: gasSpeed });
    this.emitter.emit(GAS_PRICES_RETURNED);
  };

  _getGasPrices = async () => {
    try {
      const url = GAS_PRICE_API;
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json();

      if (priceJSON) {
        return priceJSON;
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  getGasPrice = async speed => {
    let gasSpeed = speed;
    if (!speed) {
      gasSpeed = this.getStore("gasSpeed");
    }

    try {
      const url = GAS_PRICE_API;
      const priceResponse = await fetch(url);
      const priceJSON = await priceResponse.json();

      if (priceJSON) {
        return priceJSON[gasSpeed].toFixed(0);
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  getWeb3Provider = async () => {
    try {
      let web3context = this.getStore("web3context");
      let provider = null;

      // if (!web3context) {
      //   provider = network.providers["1"];
      // } else {
      //   provider = web3context.library.provider;
      // }

      if(web3context && web3context.library) {
        provider = web3context.library.provider;
      }

      if (!provider) {
        return null;
      }
      return new Web3(provider);
    } catch(ex) {
      console.log(ex)
      return null
    }
  };
}

export default Store;
