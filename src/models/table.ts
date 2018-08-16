
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
