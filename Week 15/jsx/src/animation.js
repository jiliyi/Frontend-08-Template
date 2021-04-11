//js实现动画
const TICK = Symbol("TICK");
const ANIMATION = Symbol('animation');
const START_TIME = Symbol("start-time");
const TICK_HANDLER = Symbol("tick-handler")
const PAUSE_TIME = Symbol("pause-time");
const PAUSE_START = Symbol("pause-start")
export class TimeLine{
    constructor(){
        this[ANIMATION] = new Set()
        this[START_TIME] = new Map()
        this.state = "Inited" //时间线的状态
    }
    start(){
        if(this.state !== "Inited"){
            return;
        }
        this.state = "started";
        this[PAUSE_TIME] = 0
        let startTime = Date.now()
        this[TICK] = ()=>{
            let t ;
            for(let animation of this[ANIMATION]){
                if(this[START_TIME].get(animation) < startTime){
                    t = Date.now() -this[PAUSE_TIME] - startTime -animation.delay
                }else{
                    t =  Date.now() - this[PAUSE_TIME] - this[START_TIME].get(animation) - animation.delay
                }
                if(t > animation.durtion){
                    this[ANIMATION].delete(animation)
                    t = animation.durtion
                }
                if(t > 0)
                    animation.reveive(t)
                
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    pause(){//暂停
        if(this.state !== "started"){
            return;
        }
        this.state = "paused";
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLER])
    }
    resume(){//重启
        if(this.state !== "paused"){
            return;
        }
        this.state = "started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    }
    reset(){//重置
        this[ANIMATION] = new Set()
        this[START_TIME] = new Map()
        this[PAUSE_TIME] = 0;
        this.state = "Inited";
        this[TICK_HANDLER] = null;
    }
    add(animation,startTime){
      
        if(arguments.length < 2){
            startTime = Date.now()
        }
        this[ANIMATION].add(animation)
        
        this[START_TIME].set(animation,startTime)
    }
}

export class Animation{
    constructor(object,propery,startValue,endValue,durtion,delay,timingFunction,template){
        this.object = object;
        this.propery = propery;
        this.startValue = startValue;
        this.endValue = endValue;
        this.durtion = durtion;
        this.delay = delay;
        this.timingFunction = timingFunction || (v=>v);
        this.template = template || (v=>v);
    }
    reveive(time){
        let range = this.endValue - this.startValue;
        let t = this.timingFunction(time / this.durtion)
        this.object[this.propery] = this.template(this.startValue + range * t)
        // console.log(this.object[this.propery])
    }
}