import 'normalize.css/normalize.css';
import './styles/index.scss';
import * as ioSocket from './socket.io';

import { Table, Button, AddSymbol, Refresh, Price } from './components/index';
import { ComponentFactory } from './models/componentFactory';
import { IComponent } from './models/component';

const compMap = new Map();
compMap.set('my-table', Table);
compMap.set('my-button', Button);
compMap.set('my-add-symbol', AddSymbol);
compMap.set('my-refresh', Refresh);
compMap.set('my-price', Price);

interface SymbolCell {
    id: string;
    action: string;
}

interface RateCell {
    symbol: string;
    price: string;
    action: string;
}

document.addEventListener("DOMContentLoaded", () => {

    //console.info('ioSocket', ioSocket);

    ComponentFactory.attach(compMap, (<any>document));

    const refresh = getComponent('refresh');
    refresh.change.subscribe(()=>{
        const rate = refresh.rate || 1;
        console.info('Refresh rate:', rate);
    });
    initRefreshRate(refresh);

    let ratesTable: Table = getComponent('rates');
    ratesTable.change.subscribe(()=>{
        const symRates = ratesTable.rows.map(r => ({ sym: r.data.symbol }));
        console.info('Symbols:', symRates);
        Price.instances.forEach(p => console.info('Price view', p));
    });
    initRatesTable(ratesTable);

    let symTable: Table = getComponent('symbols');
    initSymTable(symTable, ratesTable);

    let addSym: AddSymbol = getComponent('addSym');
    addSym.addSymbol.subscribe((sym: string) => {
        if (!symTable.rows.find(r => r.data.id === sym))
            symTable.addRow(<SymbolCell>{ id: sym, action: `<div class="content-right"><my-button title="Watch" value="${sym}"></my-button></div>` });
    })

});

function getComponent(name: string): any {
    let res: any;
    compMap.forEach(i => {
        if (!res) {
            let inst: IComponent[] = Array.from(i.instances);
            res = inst.find(c => (<IComponent>c).id === name);
        }
    });

    if (!res)
        console.error(`Component ${name} not found`);

    return res;
}

function initRatesTable(ratesTable: Table) {

    ratesTable.rendered.subscribe(() => {
        ratesTable.childComponents.forEach(remove => {
            if (remove instanceof Button) {
                remove.click.subscribe((rem: Button) => {
                    ratesTable.removeRow(ratesTable.rows.find(r => !r.data.symbol || r.data.symbol === rem.value));
                });
            }
        });
    });

    let ratesData = localStorage.getItem('ratesTable_rows');
    if (ratesData) {
        let res = [];
        try {
            res = JSON.parse(ratesData);
        }
        catch (e) { }
        ratesTable.addRows(res);
    }

    ratesTable.change.subscribe(() => {
        let data = ratesTable.rows.map(r => (<RateCell>{ symbol: r.data.symbol, price: r.data.price, action: r.data.action }));
        localStorage.setItem('ratesTable_rows', JSON.stringify(data));
    });
    
}

function initSymTable(symTable: Table, ratesTable: Table) {

    symTable.rendered.subscribe(() => {
        symTable.childComponents.forEach(addRate => {
            if (addRate instanceof Button) {
                addRate.click.subscribe(() => {
                    const sym = addRate.value;
                    if (!ratesTable.rows.find(r => r.data.symbol === sym))
                        ratesTable.addRow(<RateCell>{ symbol: sym, price: `<my-price sym="${sym}"></my-price>`, action: `<div class="content-right"><my-button title="Remove" value="${sym}"></my-button></div>` });
                });
            }
        });
    });

    let symData = localStorage.getItem('symTable_rows');
    if (symData) {
        let res = [];
        try {
            res = JSON.parse(symData);
        }
        catch (e) { }
        symTable.addRows(res);
    }

    symTable.change.subscribe(() => {
        let data = symTable.rows.map(r => (<SymbolCell>{ id: r.data.id, action: r.data.action }));
        localStorage.setItem('symTable_rows', JSON.stringify(data));
    });
}

function initRefreshRate(refres: Refresh) {

    let rate = localStorage.getItem('refresh_rate');
    if (typeof rate !== 'undefined') {
        refres.rate = Number(rate);
    }

    refres.change.subscribe(() => {
        localStorage.setItem('refresh_rate', JSON.stringify(refres.rate));
    });
}