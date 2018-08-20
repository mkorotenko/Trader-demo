import * as ioClient from '../socket.io.js';
import { EventEmitter } from './eventEmitter';

export class DataManager {

	private _refreshRate: number = 1;
	public set refreshRate(value: number) {
		console.info('DataManager refreshRate', value);
		this._refreshRate = value;
		//TODO make interval
	};

	private _symbols: string[] = [];
	public set symbols(value: string[]) {
		console.info('DataManager symbols', value);
		this._symbols = value;
		if (!this._symbols.length)
			this.disconnect();
		else
			//TODO make unsubscribe
			this._symbols.forEach(s => {
				this.connection.then(sock => {
					this.pairMessageUid[s] = Math.random();
					sock.emit('subscribe-req', {
						pair: s,
						uid: this.pairMessageUid[s]
					})
				})
			});
	};

	private pairMessageUid: {
		[pair: string]: number
	} = {};

	public dataChange: EventEmitter = new EventEmitter();

	private _socket: any;
	private _connection: Promise<any>;
	public get connection(): Promise<any> {
		if (!this._connection) {
			this._connection = new Promise((resolve, reject) => {
				this._socket = ioClient('prices-server-mock.spotware.com:8084');
				this._socket.on('connect', () => {
					this._socket.on('price-change', (data: any) => this.dataChange.emit(data))
					resolve(this._socket);
				});
				this._socket.on('server-error', (eventData: { uid: number, message: string }) => {
					console.error('Server error', eventData);
					if (eventData.message.indexOf('Invalid "pair"') > -1) {
						this._symbols.forEach(s => {
							if (this.pairMessageUid[s] === eventData.uid)
								this.dataChange.emit({ pair: s, message: 'Invalid symbol' });
						});
					}
				})
			});
		}
		return this._connection;
	}

	public disconnect() {
		this._connection = undefined;
		this.dataChange.unsubscribe();
	}

}