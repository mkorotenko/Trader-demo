import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table } from './models/table';
import { ComponentFactory } from './models/componentFactory';

document.addEventListener("DOMContentLoaded", () => {
    const compMap = new Map();
    compMap.set('my-table', Table);

    let rows = [
        { id: 'id1', action: 'Action #1'},
        { id: 'id2', action: 'Action #2'},
        { id: 'id3', action: 'Action #3'}
    ];
    const nodes = ComponentFactory.attach(compMap, (<any>document));
    console.info('Root nodes', nodes);
    document.getElementById('onAddSymbol').addEventListener('click', onAddSymbol);
});

function onAddSymbol() {
    console.info('onAddSymbol', arguments);
}
