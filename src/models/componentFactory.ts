import { IComponent, IComponentConstructor } from "./component";
import { toArray } from "../utils";

export class ComponentFactory {

    //public static attach(selector: string, component: any, node: Element): IComponent[] { 
    public static attach(map: Map<string, IComponentConstructor>, node: Element, res?: IComponent[]): IComponent[] {
        const result = res || [];

        map.forEach((component, selector) => {
            const elements = node.getElementsByTagName(selector);
            if (!elements || !elements.length)
                return;

            const list = toArray<Element>(elements);

            list.forEach((element: Element) => {

                let obj: IComponent;

                if (!element.attributes.getNamedItem('my-processed')) {

                    let settings: { setting: string, value: string }[] = toArray<Node>(element.attributes).map(e => ({ setting: e.nodeName, value: e.nodeValue }));
                    obj = new component();
                    result.push(obj);

                    settings.forEach(s => obj.applySettings(s));

                    element.attributes.setNamedItem(document.createAttribute('my-processed'));
                    obj.nativeNode = element;
                    obj.id = element.id;
                    obj.name = element.getAttribute("name");

                    obj.change.subscribe((comp: IComponent) => {
                        //console.info(`Component change ${selector}`, obj);
                        let el = comp.nativeNode;
                        el.innerHTML = obj.render();
                        if (el.childNodes.length)
                            obj.childComponents = ComponentFactory.attach(map, el);

                        map.forEach(e => {
                            const list = Array.from(e.instances);
                            let toDelete: IComponent[] = [];
                            list.filter(l => !document.contains(l.nativeNode))
                                .forEach(d=>toDelete.push(d));

                            toDelete.forEach(d => e.instances.delete(d));
                        });

                        obj.rendered.emit(this);
                    });

                    element.innerHTML = obj.render();

                    component.instances.add(obj);

                }
                else
                    component.instances.forEach(i => {
                        if (i.nativeNode === element)
                            obj = i;
                    })

                if (element.childNodes.length)
                    obj.childComponents = ComponentFactory.attach(map, element);
                    
                obj.rendered.emit(this);
            });
        });

        return result;
    }

}