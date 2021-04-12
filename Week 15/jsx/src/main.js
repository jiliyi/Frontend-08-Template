import { createElement,Component } from './framework.js';
import {TimeLine,Animation} from './animation.js'
class Carousel extends Component{
    constructor(){
        super()
        this.attributes = Object.create(null)
    }
    render(){
        this.root = document.createElement('div');
        this.root.className = 'carousel'
        for(let record of this.attributes.src){
            let child = document.createElement('div');
            child.style.backgroundImage = `url(${record})`;
            this.root.appendChild(child)
        }
        let curIndex = 0;
        let children = this.root.children
        let length = this.attributes.src.length;
        let position = 0;
        this.root.addEventListener("mousedown",event=>{
             let startX = event.clientX;
             let move=event=>{
                 let x = event.clientX - startX
                 let current = position - ((x - x % 500) / 500)
                 for (let offset of [-1, 0, 1]) {
                   let pos = current + offset
                   pos = (pos + children.length) % children.length
                   children[pos].style.transition = 'none'
                   children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
                 }
             }
             let up = event=>{
                 let x = event.clientX - startX
                 position = position - Math.round(x / 500)
                 for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                   let pos = position + offset
                   pos = (pos + children.length) % children.length
                   children[pos].style.transition = ''
                   children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
                 }
               document.removeEventListener("mousemove",move)
                 document.removeEventListener("mouseup",up)
             }
             document.addEventListener("mousemove",move)
             document.addEventListener("mouseup",up)
        })
        // setInterval(()=>{
        //     let nextIndex = ( curIndex + 1 ) % length;
        //     let current = children[curIndex];
        //     let next = children[nextIndex];
        //     next.style.transition = "none"
        //     next.style.transform = `translateX(${100 -nextIndex * 100}%)`;

        //     setTimeout(()=>{
        //         next.style.transition = "";
        //         current.style.transform = `translateX(${-100 -curIndex * 100}%)`;
        //         next.style.transform = `translateX(${0 - nextIndex * 100}%)`;
        //         curIndex = nextIndex
        //     },16)
           
        // },3000)
        return this.root;
    }
    setAttribute(name,value){
        this.attributes[name] = value
    }
    mountTo(parent){
        parent.appendChild(this.render())
    }
}

let d = ["https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"]
let c = <Carousel src={d}></Carousel>
c.mountTo(document.body)
let tl = new TimeLine()
window.animation = new Animation({a : 1},'a',0,100,2000)
window.tl =  tl