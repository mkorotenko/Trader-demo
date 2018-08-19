import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table, Button, AddSymbol } from './components/index';
import { ComponentFactory } from './models/componentFactory';

document.addEventListener("DOMContentLoaded", () => {
    const compMap = new Map();
    compMap.set('my-table', Table);
    compMap.set('my-button', Button);
    compMap.set('my-add-symbol', AddSymbol);

    ComponentFactory.attach(compMap, (<any>document));

    let symTable = Array.from(Table.instances).find(a => a.id === 'symbols');
    if (!symTable)
        console.error('SymTable not found');

    symTable.rendered.subscribe(() => {
        console.info('symTable renderd', symTable);
        symTable.childComponents.forEach(c => {
            if (c instanceof Button) {
                c.click.subscribe(()=>{
                    console.info('Watch', c.value);
                });
            }
        });
    });

    let addSym = Array.from(AddSymbol.instances).find(a => a.id === 'addSym');
    if (addSym) {
        console.info('AddSym', addSym);
        addSym.addSymbol.subscribe((sym: string) => {
            console.info('add sym', sym);
            symTable.addRow({ id: sym, action: `<div class="content-right"><my-button title="Watch" value="${sym}"></my-button></div>`});
        })
    }
    else
        console.error('AddSymbol component not found.');

});

