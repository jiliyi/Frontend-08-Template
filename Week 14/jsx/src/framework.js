export function createElement(type,attrs,...children){
    let ele;
    if(typeof type === 'string')
        ele= new ElementWrapper(type);
    else
        ele = new type
    for(let prop in attrs){
        ele.setAttribute(prop,attrs[prop])
    }
    for(let c of children){
        if(typeof c === 'string'){
            c = new TextWrapper(c)
        }
        ele.appendChild(c)
    }
    return ele;
}

export class Component{
    constructor(){  
    }
    setAttribute(name,value){
        this.root.setAttribute(name,value)
    }
    appendChild(child){
        child.mountTo(this.root)
    }
    mountTo(parent){
        parent.appendChild(this.root)
    }
}
export class ElementWrapper extends Component{
    constructor(type){
        this.root = document.createElement(type)
    }

}

export class TextWrapper extends Component{
    constructor(content){
        this.content = document.createTextNode(content)
    }
    mountTo(parent){
        parent.appendChild(this.content)
    }
}