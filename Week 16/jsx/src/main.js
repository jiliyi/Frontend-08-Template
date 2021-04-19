  
import { createElement } from "./framework.js"
import { Carousel } from "./Carousel.js";
import { List } from "./List.js";

let d = [
    {
        img: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        url:"http://www.baidu.com",
        title:"猫咪"
    },
    {
        img: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
        url:"http://www.baidu.com",
        title:"猫咪2"
    },
    {
        img:  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
        url:"http://www.baidu.com",
        title:"猫咪3"
    },
    {
        img:  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
        url:"http://www.baidu.com",
        title:"猫咪4"
    }
   
]


// let a = <Carousel src={d} 
// onChange={event => console.log(event.detail.position)} 
// onClick={event => window.location.href = event.detail.data.url} 
// />

let a = <List data={d}>
  {(record) =>
        <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
  }
</List>

// document.body.appendChild(a)
a.mountTo(document.body)