import { Animation,TimeLine } from './animation.js';
import { ease,easeIn,easeInOut,easeOut } from './ease.js'
let tl = new TimeLine()
let animation =  new Animation(document.getElementById("el").style,"transform",0,1000,5000,0,easeIn,v=>`translateX(${v}px)`)

tl.add(animation)
tl.start()
document.querySelector("#pause-btn").addEventListener("click",()=>{
    tl.pause()
})
document.querySelector("#resume-btn").addEventListener("click",()=>{
    tl.resume()
})