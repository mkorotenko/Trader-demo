import { IComponent } from '../models/component';
import { IControl } from '../models/control';
import { EventEmitter } from '../models/eventEmitter';

const TITLE = /title/i;
const RATES = /rates/i;
const COMPONENTS = new Set<Refresh>();

interface RefreshRate {
    rate: number;
    description: string;
}

export class Refresh implements IComponent, IControl {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public title: string = '';
    public rates: RefreshRate[] = [];

    public change = new EventEmitter();
    public rendered = new EventEmitter();

    private _rate: Number = 1;
    public set rate(value: Number) {
        this._rate = value;
        this.change.emit(this);
    };
    public get rate(): Number {
        return this._rate;
    }

    public click = new EventEmitter();

    constructor() {
        this.rendered.subscribe(() => {
            let sel = this.nativeNode.getElementsByTagName('select');
            if (sel && sel.length) {
                sel[0].addEventListener('change', () => {
                    this.rate = Number(sel[0].value);
                });
            }
            else 
                console.error('my-refresh tag "select" not found.', this, sel);
        })
    }

    public applySettings(data: { setting: string, value: string }): Refresh {

        if (TITLE.test(data.setting)) {
            this.title = data.value;
        }

        if (RATES.test(data.setting)) {
            let _rates = data.value.split(';');
            this.rates = _rates.map(r => {
                let desc = r.split(':');
                return {
                    rate: Number(desc[0]),
                    description: desc[1]
                }
            });
        }

        return this;
    }

    private renderRates(): string {
        return this.rates.map(r => `<option value="${r.rate}"${r.rate === this.rate? ' selected':''}>${r.description}</option>`).join('');
    }

    public render(): string {
        return `<div class="title"><span>${this.title}</span></div>
        <select>${this.renderRates()}</select>`;
    }

}