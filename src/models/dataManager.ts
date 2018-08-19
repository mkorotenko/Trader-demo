import * as ioClient from '../socket.io.js';
import { EventEmitter } from './eventEmitter';

export class DataManager {

    private _refreshRate: number = 1;
    public set refreshRate(value: number) {
        console.info('DataManager refreshRate', value);
        this._refreshRate = value;
    };

    private _symbols: string[] = [];
    public set symbols(value: string[]) {
        console.info('DataManager symbols', value);
        this._symbols = value;
        if (!this._symbols.length)
            this.disconnect();
        else
            this._symbols.forEach(s => {
                this.connection.then(sock => {
                    sock.emit('subscribe-req', {
                        pair: s,
                        uid: Math.random()
                    })
                })
            });
    };

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
                this._socket.on('server-error', (eventData: any) => {
                    console.error('Server error', eventData)
                })
            });
        }
        return this._connection;
    }

    public disconnect() {
        this._connection = undefined;
        this.dataChange.unsubscribe();
    }

    constructor() {
        //var connection = ioClient('prices-server-mock.spotware.com:8084')
        // connection.on('connect', function () {
        //     connection.emit('subscribe-req', {
        //         pair: 'eurusd',
        //         uid: Math.random()
        //     })
        //     connection.on('price-change', function (data) {
        //         console.log('price-change', data)
        //     })
        // })
        //console.info('Socket', this.connection);
    }


}