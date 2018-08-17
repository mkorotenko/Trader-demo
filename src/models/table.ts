import { IComponent } from "./component";

interface IColumn {
    name: string
    description?: string
}

const COL_SETTING = /column-\d/i;
const HAS_HEADER = /header/i;

export class Table extends Array<Row> implements IComponent {

    public columns: Column[] = [];

    public header: Header;

    private hasHeader: boolean = false;

    constructor(columns?: IColumn[]) {
         super();
         (<any>Object).setPrototypeOf(this, Table.prototype);

         if (columns)
            this.columns = columns.map((c) => new Column(c.name, c.description || ''));

            console.info('Table', this);
     }

    public applySettings(data: { setting: string, value: string }): Table {

        if (COL_SETTING.test(data.setting)) {
            let vals = data.value.split(';');
            this.columns.push(new Column(vals[0], vals[1] || ''));
        } else if (HAS_HEADER.test(data.setting)) {
            this.hasHeader = true;
        }

        return this;
    }
     
     //public map(): any {
    public map<U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any): U[] {
        let res: Row[] = [];
        this.forEach(r => res.push(r));

         return super.map.apply(res, Array.prototype.slice.apply(arguments))
     }

    public addRow(data: any): Row {
        let newRow = new Row(this.columns, data);
        this.push(newRow);
        return newRow;
    }

    public createHeader() {
        this.header = new Header(this.columns);
    }

    public removeHeader() {
        this.header = undefined;
    }

    private renderContent(): string {
        if (this.hasHeader && !this.header)
            this.createHeader();

        return this.header? this.header.render():'' +  this.map(r => r.render()).join('');
    }

    public render(): string {
        return `<div class="Table">${this.renderContent()}</div>`;
    }

}

class Header {

    constructor(
        public columns: Column[],
    ) {}

    public render(): string {
        return `<div class="Table-row Table-header">${this.renderContent()}</div>`;
    }

    private renderContent(): string {
        return this.columns.map(c => c.renderHeader()).join('');
    }

}

class Row {

    constructor(
        public columns: Column[],
        public data?: any
    ) {}

    public render(): string {
        return `<div class="Table-row">${this.renderContent()}</div>`;
    }

    private renderContent(): string {
        return this.columns.map(c => c.renderCell((this.data || {})[c.name] || '')).join('');
    }

}

class Column implements IColumn {
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
