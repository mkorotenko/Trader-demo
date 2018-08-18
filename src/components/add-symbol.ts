import { IComponent } from '../models/component';
import { EventEmitter } from '../models/eventEmitter';

const SYMBOL_LIST = /symbols/i;
const COMPONENTS = new Set();

export class AddSymbol implements IComponent {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public symbolList: string[] = [];

    public change = new EventEmitter();

    public applySettings(data: { setting: string, value: string }): AddSymbol {

        if (SYMBOL_LIST.test(data.setting)) {
            this.symbolList = data.value.split(';');
        }
        return this;
    }

    private renderOption(symbol: string): string {
        return `<option value="${symbol}">${symbol}</option>`;
    }

    private renderSelect(): string {
        return `<select>
        ${this.symbolList.map(s => this.renderOption(s)).join('')}
      </select>`;
    }

    public render(): string {
        return `<div class="select-symbol">
        ${this.renderSelect()}/
        ${this.renderSelect()}
      </div>
      <my-button title="Add"></my-button>`;
    }

}