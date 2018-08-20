import * as ioClient from '../socket.io.js';
import { EventEmitter } from './eventEmitter';

const SOCKET_SERVER_URL = 'prices-server-mock.spotware.com:8084';

export class DataManager {

	private _timerID: number;

	private _refreshRate: number = 1;
	public set refreshRate(value: number) {
		this._refreshRate = value;

		if (this._timerID) {
			clearInterval(this._timerID);
			this._timerID = undefined;
		}

		if (this._symbols.length) {
			this._timerID = setInterval(this.timerHandler.bind(this), this._refreshRate * 1000);
			this.timerHandler();
		}
	};

	private _symbols: string[] = [];
	public set symbols(value: string[]) {
		const prev: string[] = this._symbols.slice();
		const toDelete: string[] = this._symbols.slice();
		const toSubscribe: string[] = [];

		this._symbols = value;
		if (!this._symbols.length) {
			this.disconnect();
		}
		else {
			//TODO make unsubscribe
			this._symbols.forEach(s => {
				if (prev.indexOf(s) > -1) 
					toDelete.splice(toDelete.indexOf(s), 1);
				else
					toSubscribe.push(s);
			});
		}

		toDelete.forEach(pair => {
			this.unsubscribePair(pair);
			delete this.pairPrices[pair];
		});
		toSubscribe.forEach(pair => {
			this.subscribePair(pair);
			this.pairPrices[pair] = { price: 0 };
		});

		this.refreshRate = this._refreshRate;
	};

	private pairMessageUid: {
		[pair: string]: number
	} = {};

	private pairPrices: {
		[pair: string]: {price?: number, message?: string}
	} = {};

	public dataChange: EventEmitter = new EventEmitter();

	private _socket: any;
	private _connection: Promise<any>;
	public get connection(): Promise<any> {
		if (!this._connection) {
			this._connection = new Promise((resolve, reject) => {
				this._socket = ioClient(SOCKET_SERVER_URL);
				this._socket.on('connect', () => {
					this._socket.on('price-change', this.priceChangeHandler.bind(this));
					this._socket.on('unsubscribe-res', this.unsubscribeHandler.bind(this));
					resolve(this._socket);
				});
				this._socket.on('server-error', this.errorHandler.bind(this));
			});
		}
		return this._connection;
	}

	public disconnect() {
		this._connection = undefined;
		this.dataChange.unsubscribe();
	}

	private subscribePair(pair: string) {
		this.connection.then(sock => {
			sock.emit('subscribe-req', {
				pair: pair,
				uid: this.pairMessageUid[pair] = Math.random()
			})
		})
	}

	private unsubscribePair(pair: string) {
		this.connection.then(sock => {
			sock.emit('unsubscribe-req', {
				pair: pair,
				uid: this.pairMessageUid[pair] = Math.random()
			})
		})
	}

	private priceChangeHandler(data: { pair:string, price?: number, message?: string }) {
		this.pairPrices[data.pair] = { price: data.price }
	}

	private unsubscribeHandler(data: { uid: number }) {
		Object.keys(this.pairMessageUid).forEach(k => {
			if (this.pairMessageUid[k] === data.uid)
				delete this.pairPrices[k];
		})
	}

	private errorHandler(eventData: { uid: number, message: string }) {
		console.error('Server error', eventData);
		if (eventData.message.indexOf('Invalid "pair"') > -1) {
			this._symbols.forEach(s => {
				if (this.pairMessageUid[s] === eventData.uid)
					this.pairPrices[s] = { message: 'Invalid symbol' }
			});
		}
	}

	private timerHandler() {
		const data = Object.keys(this.pairPrices).map(k => ({ pair: k, price: this.pairPrices[k].price, message: this.pairPrices[k].message }));
		this.dataChange.emit(data);
	}
}