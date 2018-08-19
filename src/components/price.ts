import { IComponent } from '../models/component';
import { IControl } from '../models/control';
import { EventEmitter } from '../models/eventEmitter';

const SYM_SETTING = /sym/i;

const COMPONENTS = new Set<Price>();

export class Price implements IComponent {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public symbol: string;
    private _price: string = '1.45';
    public set price(value: string) {
        this._price = value;
        if (this.nativeNode)
            this.nativeNode.innerHTML = this._price;
    }
    public get price(): string {
        return this._price;
    }

    public change = new EventEmitter();
    public rendered = new EventEmitter();

    public applySettings(data: { setting: string, value: string }): Price {

        if (SYM_SETTING.test(data.setting))
            this.symbol = data.value;

        return this;
    }

    public render(): string {
        return this._price;
    }

}