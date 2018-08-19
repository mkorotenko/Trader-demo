import { IComponent } from '../models/component';
import { IControl } from '../models/control';
import { EventEmitter } from '../models/eventEmitter';

const TITLE = /title/i;
const VALUE = /value/i;
const COMPONENTS = new Set<Button>();

export class Button implements IComponent, IControl {

    public id: string;
    public name: string;
    
    public nativeNode: Element;
    public childNodes: Element[];

    public childComponents: IComponent[];

    public static instances = COMPONENTS;

    public title: string = '';
    public value: string = '';

    public change = new EventEmitter();
    public rendered = new EventEmitter();

    public click = new EventEmitter();

    private _active: boolean = false;
    public set active(value: boolean) {
        this._active = value;
        this.getButtons().forEach(b => {
            if (this._active)
                b.classList.add('active');
            else
                b.classList.remove('active');
        });
    }
    public get active(): boolean {
        return this._active;
    }

    constructor() {
        this.rendered.subscribe(() => {
            this.getButtons().forEach(b => b.addEventListener('click', () => this.click.emit(this)));
        })
    }

    private getButtons(): Element[] {
        let but = this.nativeNode.getElementsByTagName('button');
        if (but && but.length) 
            return Array.from(but)
        else 
            console.error('my-button tag "button" not found.', this, but);
    }

    public applySettings(data: { setting: string, value: string }): Button {

        if (TITLE.test(data.setting)) {
            this.title = data.value;
        }

        if (VALUE.test(data.setting)) {
            this.value = data.value;
        }

        return this;
    }

    public render(): string {
        return `<button>${this.title}</button>`;
    }

}