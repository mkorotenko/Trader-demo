import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table } from './models/table';
import { ComponentFactory } from './models/componentFactory';

function toDom(str: string) {
    var tmp = document.createElement("div");
    tmp.innerHTML = str;
    return tmp.childNodes;
  };

document.addEventListener("DOMContentLoaded", () => {
    // let table = new Table([
    //     {name:'id'},
    //     {name: 'action'}
    // ]);
    // console.info('DOMContentLoaded', table);
    // table.addRow({ id: 'id1', action: 'Action #1'})
    // table.addRow({ id: 'id2', action: 'Action #2'})
    // table.addRow({ id: 'id3', action: 'Action #3'})
    // let tabs = document.getElementsByTagName('my-table');
    // let list = Array.prototype.slice.call(tabs);
    // list.forEach((e: Element) => e.innerHTML = table.render());
    ComponentFactory.attach('my-table', Table)
});
