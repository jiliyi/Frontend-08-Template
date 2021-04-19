import { Component, STATE, ATTRIBUTE } from "./framework.js";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    // console.log("window.innerWidth:",window.innerWidth)
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let item of this[ATTRIBUTE].src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url('${item.img}')`;
      this.root.appendChild(child);
    }
    enableGesture(this.root);
    let timeline = new Timeline;
    timeline.start();

    let handler = null;

    let children = this.root.children;

    // let position = 0;
    this[STATE].position = 0;

    let t = 0;
    let ax = 0;

    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(handler);

      if (Date.now() - t < 300) {
        let progress = (Date.now() - t) / 300;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener("tap", (event) => {
      this.triggerEvent("click", { data: this[ATTRIBUTE].src[this[STATE].position], position: this[STATE].position });
    });

    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - (x - (x % 500)) / 500;
      let evw = 500;//event.path[0].clientWidth;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        // console.log(pos);
        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -evw * pos + offset * evw + x % evw
        }px)`;
      }
    });

    this.root.addEventListener("end", (event) => {
      timeline.reset();
      timeline.start();
      handler = setInterval(nexpic, 3000);

      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - ((x - x % 500) / 500);
      let evw = 500;//event.path[0].clientWidth;

      let direction = Math.round(((x % 500)) / 500);

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
        console.log("event.velocity:", event.velocity);
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;
        children[pos].style.transition = "none";
        // console.log("none?",pos)
        // children[pos].style.transform = `translateX(${ - evw * pos + offset * evw + x }px)`;
        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            300,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this[STATE].position =
        this[STATE].position - (x - (x % 500)) / 500 - direction;
      this[STATE].position =
        ((this[STATE].position % children.length) + children.length) %
        children.length;

      this.triggerEvent("change", { position: this[STATE].position });
    });
    // this.root.addEventListener("pan end", event => {
    //   console.log("pan end:",event)
    //     let x = event.clientX - event.startX - ax;
    //     let evw = event.path[0].clientWidth;
    //     position = position - Math.round(x / evw);
    //     for(let offset of [0, - Math.sign(Math.round(x / evw) - x + evw / 2 * Math.sign(x))]) {
    //       let pos = position + offset;
    //       pos = (pos % children.length + children.length) % children.length;
    //       children[pos].style.transition = "";
    //       children[pos].style.transform = `translateX(${ - evw * pos + offset * evw }px)`;
    //     }
    // })

    let nexpic = () => {
      let children = this.root.children;
      let nextPosition = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextPosition];

      t = Date.now();
      // next.style.transition = 'none'
      // next.style.transform = `translateX(${500 - nextPosition * 500}%)`

      timeline.add(
        new Animation(
          current.style,
          "transform",
          -this[STATE].position * 500,
          -500 - this[STATE].position * 500,
          300,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextPosition * 500,
          -nextPosition * 500,
          300,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      this[STATE].position = nextPosition;
      this.triggerEvent("Change", { position: this[STATE].position });
    };

    handler = setInterval(nexpic, 3000);

    // 手动切换轮播
    // this.root.addEventListener("mousedown", (event) => {
    //   console.log(event)
    //   let startX = event.clientX;
    //   let children = this.root.children;
    //   let evw = event.view.innerWidth;

    //   let move = (event) => {
    //     let x = event.clientX - startX;

    //     let current = position - Math.round((x - x % evw) / evw)
    //     for(let offset of [-1,0,1]) {
    //       let pos = current + offset;
    //       pos = (pos + children.length) % children.length
    //       children[pos].style.transition = "none";
    //       children[pos].style.transform = `translateX(${ - evw * pos + offset * evw + x }px)`;
    //     }
    //   };
    //   let up = (event) => {
    //     let x = event.clientX - startX;
    //     position = position - Math.round(x / evw);

    //     for(let offset of [0, - Math.sign(Math.round(x / evw) - x + evw / 2 * Math.sign(x))]) {
    //       let pos = position + offset;
    //       pos = (pos + children.length) % children.length
    //       children[pos].style.transition = "";
    //       children[pos].style.transform = `translateX(${ - evw * pos + offset * evw }px)`;
    //     }
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   };

    //   document.addEventListener("mousemove", move);
    //   document.addEventListener("mouseup", up);
    // });

    // 自动定时轮播
    // let currentIndex = 0;
    // setInterval(()=> {
    //   let children  = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;

    //   let current = children[currentIndex]
    //   let next = children[nextIndex]

    //   next.style.transition = 'none'
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`

    //   setTimeout(()=>{
    //     next.style.transition = ''
    //     current.style.transform = `translateX(${-100 - nextIndex * 100}%)`
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`
    //     currentIndex = nextIndex;
    //   },10)
    // },3000)
    return this.root;
  }
  // mountTo(parent) {
  //   parent.appendChild(this.render());
  // }
}