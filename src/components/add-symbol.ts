import { IComponent } from '../models/component';
import { EventEmitter } from '../models/eventEmitter';
import { Button } from './index';

const SYMBOL_LIST = /symbols/i;
const COMPONENTS = new Set<AddSymbol>();

export class AddSymbol implements IComponent {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public symbolList: { id:string, description: string }[] = [];

    public change = new EventEmitter();
    public rendered = new EventEmitter();

    public addSymbol = new EventEmitter();

    constructor() {
        this.rendered.subscribe(() => {
            let butAdd = <Button>this.childComponents.find(c => c.id === 'add-symbol');
            if (!butAdd) {
                console.error('AddSymbol button not found');
                return;
            }
            butAdd.click.subscribe(() => {
                const sym = this.getSymbol();
                if (sym)
                        this.addSymbol.emit(sym)
            });
    })
    }

    private getSymbol(): string {
        const selects = Array.from(this.nativeNode.getElementsByTagName('select'));
        if (selects.length && selects[0].value !== selects[1].value)
            return selects.map(s => s.value).join('');
    }

    public applySettings(data: { setting: string, value: string }): AddSymbol {

        if (SYMBOL_LIST.test(data.setting)) {
            let list = data.value.split(';');
            this.symbolList = list.map(s => { 
                let sym = s.split(':');
                return {
                    id: sym[0],
                    description: sym[1]||sym[0]
                }
            });
        }
        return this;
    }

    private renderOption(symbol: { id: string,description: string }): string {
        return `<option value="${symbol.id}">${symbol.description}</option>`;
    }

    private renderSelect(): string {
        return `<select>${this.symbolList.map(s => this.renderOption(s)).join('')}</select>`;
    }

    public render(): string {
        return `<div class="symbol-content"><div class="select-symbol">
        ${this.renderSelect()}/
        ${this.renderSelect()}
      </div>
      <my-button title="Add" id="add-symbol"></my-button></div>`;
    }

}