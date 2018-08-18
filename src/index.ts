import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table, Button, AddSymbol } from './components/index';
import { ComponentFactory } from './models/componentFactory';

let symTable: Table;
document.addEventListener("DOMContentLoaded", () => {
    const compMap = new Map();
    compMap.set('my-table', Table);
    compMap.set('my-button', Button);
    compMap.set('my-add-symbol', AddSymbol);

    let rows = [
        { id: 'id1', action: '<div class="content-right"><my-button title="Watch"></my-button></div>'},
        { id: 'id2', action: '<div class="content-right"><my-button title="Watch"></my-button></div>'},
        { id: 'id3', action: '<div class="content-right"><my-button title="Watch"></my-button></div>'}
    ];
    const nodes = ComponentFactory.attach(compMap, (<any>document));
    symTable = <Table>nodes.find(n => n.id === 'symbols');
    if (symTable) {
        setTimeout(() => {
            (<Table>symTable).addRows(rows);
        }, 1000);
        setTimeout(() => {
            (<Table>symTable).addRow({ id: 'id4', action: '<div class="content-right"><my-button title="Watch"></my-button></div>'});
        }, 2000);
    }

    console.info('Root nodes', nodes);
    //document.getElementById('onAddSymbol').addEventListener('click', onAddSymbol);
});

function onAddSymbol() {
    console.info('onAddSymbol', arguments);
    if (symTable)
        (<Table>symTable).addRow({ id: `id${symTable.length}`, action: '<div class="content-right"><my-button title="Watch"></my-button></div>'});

}
