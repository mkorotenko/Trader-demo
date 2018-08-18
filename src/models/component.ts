import { EventEmitter } from './eventEmitter';

export interface IComponent {
    id: string;
    nativeNode: Element;
    childNodes: Element[];
    childComponents: IComponent[];

    //instances: Set<IComponent>;

    change: EventEmitter;

    applySettings: (data?: any) => IComponent;
    render: (data?: any) => string;
}

export interface IComponentConstructor {
    new(): IComponent;
    new(args?: any): IComponent;
    new(args?: any[]): IComponent;
    new(...args: any[]): IComponent;

    instances: Set<IComponent>;
}