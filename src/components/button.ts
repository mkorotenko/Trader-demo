import { IComponent } from '../models/component';
import { EventEmitter } from '../models/eventEmitter';

const TITLE = /title/i;
const COMPONENTS = new Set();

export class Button implements IComponent {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public title: string = '';

    public change = new EventEmitter();

    public applySettings(data: { setting: string, value: string }): Button {

        if (TITLE.test(data.setting)) {
            this.title = data.value;
        }

        return this;
    }

    public render(): string {
        return `<button id="id1">${this.title}</button>`;
    }

}