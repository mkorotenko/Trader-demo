
export class Table extends Array<Row> {

    constructor(columns: { name: string, description?: string}[]) {
        super();
        (<any>Object).setPrototypeOf(this, Table.prototype);
        this.columns = columns.map(c => new Column(c.name, c.description || ''));
    }

    public columns: Column[];

    public header: Row;

    public addRow(data: any): Row {
        let newRow = new Row(this.columns, data);
        this.push(newRow);
        return newRow;
    }

    public createHeader() {
        this.header = new Row(this.columns);
    }

    public removeHeader() {
        this.header = undefined;
    }

    private renderContent(): string {
        return this.header? this.header.render():'' +  this.map(r => r.render()).join();
    }

    public render(): string {
        return `<div class="Table">${this.renderContent()}</div>`;
    }

}

export class Header {

    public columns: Column[];

    public render(): string {
        return `<div class="Table-row Table-header">${this.renderContent()}</div>`;
    }

    private renderContent(): string {
        return this.columns.map(c => c.renderHeader()).join();
    }

}

export class Row {

    constructor(
        public columns: Column[],
        public data?: any
    ) {}

    public render(): string {
        return `<div class="Table-row">${this.renderContent()}</div>`;
    }

    private renderContent(): string {
        return this.columns.map(c => c.renderCell((this.data || {})[c.name] || '')).join();
    }

}

export class Column {
    constructor(
       public name: string,
       public description: string
    ) { }

    public renderHeader(): string {
       return `<div class="Table-row-item">${this.description}</div>`;
    }

    public renderCell(value: string): string {
        return `<div class="Table-row-item" data-header="${this.name}">${value }</div>`;
    }

}
