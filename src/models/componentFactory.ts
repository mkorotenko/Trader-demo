import { IComponent, IComponentConstructor } from "./component";
import { toArray } from "../utils";

 export class ComponentFactory {
    
    //public static attach(selector: string, component: any, node: Element): IComponent[] { 
    public static attach(map: Map<string, any>, node: Element, res?: IComponent[]): IComponent[] { 
        const result = res || [];

        map.forEach((component, selector) => {
            const elements = node.getElementsByTagName(selector);
            if (!elements || !elements.length)
                return;
    
            const list = toArray<Element>(elements);
    
            list.forEach((element: Element) => {
                
                if (element.attributes.getNamedItem('my-processed'))
                    return; 

                let settings: { setting: string, value: string }[] = toArray<Node>(element.attributes).map(e => ({ setting: e.nodeName, value: e.nodeValue }));
                let obj = new component();

                settings.forEach(s => obj.applySettings(s));

                element.innerHTML = obj.render();
                element.attributes.setNamedItem(document.createAttribute('my-processed'));
                obj.nativeNode = element;
                obj.id = element.id;
                result.push(obj);
                if (element.childNodes.length)
                    ComponentFactory.attach(map, element, result);
            });
        });

        return result;
    }

 }