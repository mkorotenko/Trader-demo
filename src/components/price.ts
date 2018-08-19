import { IComponent } from '../models/component';
import { IControl } from '../models/control';
import { EventEmitter } from '../models/eventEmitter';

const COMPONENTS = new Set<Price>();

export class Price implements IComponent {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

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
        return this;
    }

    public render(): string {
        return this._price;
    }

}