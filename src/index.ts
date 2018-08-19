import 'normalize.css/normalize.css';
import './styles/index.scss';
import * as ioSocket from './socket.io.js';

import { Table, Button, AddSymbol } from './components/index';
import { ComponentFactory } from './models/componentFactory';

document.addEventListener("DOMContentLoaded", () => {

    console.info('ioSocket', ioSocket);
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

    symTable.rendered.subscribe(() => {
        console.info('symTable renderd', symTable);
        symTable.childComponents.forEach(addRate => {
            if (addRate instanceof Button) {
                addRate.click.subscribe(() => {
                    const sym = addRate.value;
                    ratesTable.addRow({ symbol: sym, price: 1.04 ,action: `<div class="content-right"><my-button title="Remove" value="${sym}"></my-button></div>` });
                });
            }
        });
    });

    let addSym = Array.from(AddSymbol.instances).find(a => a.id === 'addSym');
    if (addSym) {
        addSym.addSymbol.subscribe((sym: string) => {
            symTable.addRow({ id: sym, action: `<div class="content-right"><my-button title="Watch" value="${sym}"></my-button></div>` });
        })
    }
    else
        console.error('AddSymbol component not found.');

});

