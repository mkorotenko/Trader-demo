import 'normalize.css/normalize.css';
import './styles/index.scss';

import { Table, Button, AddSymbol, Refresh, Price } from './components/index';
import { ComponentFactory } from './models/componentFactory';
import { IComponent } from './models/component';
import { DataManager } from './models/dataManager';

interface SymbolCell {
    id: string;
    action: string;
}

interface RateCell {
    symbol: string;
    price: string;
    action: string;
}

const compMap = new Map();
compMap.set('my-table', Table);
compMap.set('my-button', Button);
compMap.set('my-add-symbol', AddSymbol);
compMap.set('my-refresh', Refresh);
compMap.set('my-price', Price);

document.addEventListener("DOMContentLoaded", () => {

    ComponentFactory.attach(compMap, (<any>document));

    const dataManager = new DataManager();

    const refresh = getComponent('refresh');
    refresh.change.subscribe(()=>{
        const rate = refresh.rate || 1;
        dataManager.refreshRate = rate;
    });
    initRefreshRate(refresh);

    let ratesTable: Table = getComponent('rates');
    ratesTable.change.subscribe(()=>{
        const symRates = ratesTable.rows.map(r => r.data.symbol.toLowerCase());
        dataManager.symbols = symRates;
        const rates: { 
            [sym: string]: Price
        } = {};
        Price.instances.forEach(p => rates[p.symbol.toLowerCase()] = p);
        dataManager.dataChange.unsubscribe();
        dataManager.dataChange.subscribe((data: { pair:string, price?: number, message?: string }[]) => {
            data.forEach(p => {
                let view = rates[p.pair];
                if (view)
                    if (p.message)
                        view.price = `<red>${p.message}</red>`;
                    else
                        view.price = p.price.toFixed(2);
                });
            })
    });
    initRatesTable(ratesTable);

    let symTable: Table = getComponent('symbols');
    initSymTable(symTable, ratesTable);

    let addSym: AddSymbol = getComponent('addSym');
    addSym.addSymbol.subscribe((sym: string) => {
        if (!symTable.rows.find(r => r.data.id === sym))
            symTable.addRow(<SymbolCell>{ id: sym, action: `<div class="content-right"><my-button name="watch" title="Watch" value="${sym}"></my-button></div>` });
    })

});

//Procedure from interview:
function replaceAll(string: string, from: string, to: string) {
    return string.split(new RegExp(`${from}`, 'i')).join(to);
}

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

    function updateWatchState() {
        const symRates = ratesTable.rows.map(r => r.data.symbol.toLowerCase());
        const btns = Array.from(Button.instances);
        btns.filter(b => b.name === 'watch').forEach(b => {
            b.active = symRates.indexOf(b.value.toLowerCase()) > -1;
        });
    }

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
        updateWatchState();
    });

    ratesTable.change.subscribe(()=> updateWatchState());

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