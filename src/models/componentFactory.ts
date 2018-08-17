import { IComponent, IComponentConstructor } from "./component";
import { toArray } from "../utils";

 export class ComponentFactory {
    
    public static attach(selector: string, component: any, data?: any): IComponent[] { 
        const result: IComponent[] = [];
        const elements = document.getElementsByTagName(selector);
        if (!elements || !elements.length)
            return result;

        const list = toArray<Element>(elements);

        list.forEach((e: Element) => {
            console.info('ComponentFactory', selector, e);

            let settings: { setting: string, value: string }[] = toArray<Node>(e.attributes).map(e => ({ setting: e.nodeName, value: e.nodeValue }));
            let obj = new component();
            settings.forEach(s => obj.applySettings(s));
            
            e.innerHTML = obj.render();
        });

        return result;
    }

 }