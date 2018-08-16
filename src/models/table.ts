
export class Table extends Array {
    constructor() {
        super();
        (<any>Object).setPrototypeOf(this, Table.prototype);
        this.init();
    }

    public init() {
        console.info('Table init');
    }
}

export class Header {

    public columns: Column[];

    public render(): string {
        return `<div class="Table-row Table-header">${this.renderContent()}</div>`;
    }

    public renderContent(): string {
        return this.columns.map(c => c.renderHeader()).join();
    }
}

export class Row {

    public columns: Column[];
    public data: any;

    public render(): string {
        return `<div class="Table-row">${this.renderContent()}</div>`;
    }

    public renderContent(): string {
        return this.columns.map(c => c.renderCell(this.data[c.name])).join();
    }
}

 export class Column {
     constructor(
        public name: string,
        public description: string
     ) {

     }

     renderHeader(): string {
        return `<div class="Table-row-item">${this.description}</div>`;
     }

     renderCell(value: string): string {
         return `<div class="Table-row-item" data-header="${this.name}">${value }</div>`;
     }
 }