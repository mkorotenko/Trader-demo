import 'normalize.css/normalize.css';
import './styles/index.scss';
import * as ioSocket from './socket.io.js';

import { Table, Button, AddSymbol } from './components/index';
import { ComponentFactory } from './models/componentFactory';

interface SymbolCell {
    id: string;
    action: string;
}

interface RateCell {
    symbol: string;
    price: number;
    action: string;
}

document.addEventListener("DOMContentLoaded", () => {

    //console.info('ioSocket', ioSocket);
    const compMap = new Map();
    compMap.set('my-table', Table);
    compMap.set('my-button', Button);
    compMap.set('my-add-symbol', AddSymbol);

    ComponentFactory.attach(compMap, (<any>document));

    const tables = Array.from(Table.instances);
    
    let symTable = tables.find(a => a.id === 'symbols');
    if (!symTable)
        console.error('SymTable not found');

    let ratesTable = tables.find(a => a.id === 'rates');
    if (!ratesTable)
        console.error('RatesTable not found');

    initRatesTable(ratesTable);
    initSymTable(symTable, ratesTable);

    let addSym = Array.from(AddSymbol.instances).find(a => a.id === 'addSym');
    if (addSym) {
        addSym.addSymbol.subscribe((sym: string) => {
            symTable.addRow(<SymbolCell>{ id: sym, action: `<div class="content-right"><my-button title="Watch" value="${sym}"></my-button></div>` });
        })
    }
    else
        console.error('AddSymbol component not found.');

});

function initRatesTable(ratesTable: Table) {

    ratesTable.rendered.subscribe(() => {
        console.info('ratesTable renderd', ratesTable);
        ratesTable.childComponents.forEach(remove => {
             if (remove instanceof Button) {
                 remove.click.subscribe((rem: Button) => {
                     console.info('Remove', rem);
                     ratesTable.removeRow(ratesTable.rows.find(r => !r.data.symbol || r.data.symbol === rem.value));
        //             const sym = addRate.value;
        //             ratesTable.addRow({ symbol: sym, price: 1.04 ,action: `<div class="content-right"><my-button title="Remove" value="${sym}"></my-button></div>` });
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
        catch(e){}
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
                        ratesTable.addRow(<RateCell>{ symbol: sym, price: 1.04 ,action: `<div class="content-right"><my-button title="Remove" value="${sym}"></my-button></div>` });
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
        catch(e){}
        symTable.addRows(res);
    }

    symTable.change.subscribe(() => {
        let data = symTable.rows.map(r => (<SymbolCell>{ id: r.data.id, action: r.data.action }));
        localStorage.setItem('symTable_rows', JSON.stringify(data));
    });
}