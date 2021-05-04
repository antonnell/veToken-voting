import AccountStore from './accountStore';
import GaugeStore from './gaugeStore';

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const accountStore = new AccountStore(dispatcher, emitter);
const gaugeStore = new GaugeStore(dispatcher, emitter);

export default {
  accountStore: accountStore,
  gaugeStore: gaugeStore,
  dispatcher: dispatcher,
  emitter: emitter,
};
