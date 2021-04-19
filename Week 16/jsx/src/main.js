import { Component, createElement } from "./framework.js";
import { Carousel } from "./Carousel.js";
import { Timeline, Animation } from "./animation.js";







let imgs = [
  {title:"a", url:"https://video.kuaishou.com", img:"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"},
  {title:"b", url:"https://www.douyin.com", img:"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"},
  {title:"c", url:"https://www.weibo.com", img:"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"},
  {title:"d", url:"https://www.qq.com", img:"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"}
  ];

let a = <Carousel src={imgs} 
  onChange={event => console.log(event.detail.position) }
  onClick={event => window.location.href = event.detail.data.url }></Carousel>;

a.mountTo(document.body);