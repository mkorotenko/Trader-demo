import { IComponent } from '../models/component';
import { IControl } from '../models/control';
import { EventEmitter } from '../models/eventEmitter';

const TITLE = /title/i;
const COMPONENTS = new Set();

export class Button implements IComponent, IControl {

    public id: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public title: string = '';

    public change = new EventEmitter();
    public rendered = new EventEmitter();

    public click = new EventEmitter();

    constructor() {
        this.rendered.subscribe(() => {
            let but = this.nativeNode.getElementsByTagName('button');
            if (but) 
                Array.from(but).forEach(b => b.addEventListener('click', () => this.click.emit(this)));
            else 
                console.error('my-button tag "button" not found.', this, but);
        })
    }

    public applySettings(data: { setting: string, value: string }): Button {

        if (TITLE.test(data.setting)) {
            this.title = data.value;
        }

        return this;
    }

    public render(): string {
        return `<button>${this.title}</button>`;
    }

}