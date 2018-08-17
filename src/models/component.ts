export interface IComponent {
    applySettings: (data?: any) => IComponent;
    render: (data?: any) => string;
}

export interface IComponentConstructor {
    new(): IComponent;
    new(args?: any): IComponent;
    new(args?: any[]): IComponent;
    new(...args: any[]): IComponent;
}