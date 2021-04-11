export  function createElement(type,attrs,...children){
    let ele;
    if(type instanceof Function){
        ele = new type
    }else{
        ele = new ElementWrapper(type);
    }
    
    //设置属性
    for(let prop in attrs){
        ele.setAttribute(prop,attrs[prop])
    }

    for(let child of children){
        if(typeof child === 'string'){
            child = new TextElementWrapper(child)
        }
        ele.appendChild(child)
    }
    return ele;
}
export class Component{
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
class ElementWrapper extends Component{
    constructor(type){
        super()
        this.root = document.createElement(type)
    }
}
class TextElementWrapper extends Component{
    constructor(content){
        super()
        this.root = document.createTextNode(content)
    }
}