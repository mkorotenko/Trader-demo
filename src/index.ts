import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table } from './models/table';

document.addEventListener("DOMContentLoaded", () => {
    let t = new Table([
        {name:'id'},
        {name: 'action'}
    ]);
    console.info('DOMContentLoaded', t);
});
