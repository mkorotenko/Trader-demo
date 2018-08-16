import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table } from './models/table';

document.addEventListener("DOMContentLoaded", () => {
    console.info('DOMContentLoaded');

    let t = new Table();
});
