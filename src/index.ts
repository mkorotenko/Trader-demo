import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table } from './models/table';
import { ComponentFactory } from './models/componentFactory';

document.addEventListener("DOMContentLoaded", () => {
    const compMap = new Map();
    compMap.set('my-table', Table);

    let rows = [
        { id: 'id1', action: '<button id="id1">Watch</button>'},
        { id: 'id2', action: '<button id="id2">Watch</button>'},
        { id: 'id3', action: '<button id="id3">Watch</button>'}
    ];
    const nodes = ComponentFactory.attach(compMap, (<any>document));
    const symTable = nodes.find(n => n.id === 'symbols');
    if (symTable) {
        (<Table>symTable).addRows(rows);
    }

    console.info('Root nodes', nodes);
    document.getElementById('onAddSymbol').addEventListener('click', onAddSymbol);
});

function onAddSymbol() {
    console.info('onAddSymbol', arguments);
}
