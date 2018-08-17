export interface IComponent {
    id: string;
    nativeNode: Element;
    childNodes: Set<Element>;

    applySettings: (data?: any) => IComponent;
    render: (data?: any) => string;
}

export interface IComponentConstructor {
    new(): IComponent;
    new(args?: any): IComponent;
    new(args?: any[]): IComponent;
    new(...args: any[]): IComponent;
}