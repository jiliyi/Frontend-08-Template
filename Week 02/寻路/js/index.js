let container = document.querySelector('.mapContainer')
let btn  = document.getElementById('btn')
//利用一维数组来映射地图，约定0没有路障，1有路障
let mapArr = localStorage['mapArr'] ? JSON.parse(localStorage['mapArr']) : new Array(100 * 100).fill(0);
//根据数组渲染页面,i表示纵向，j表示横向
function render(){
    for(let i = 0 ; i < 100;i++){
        for(let j = 0 ; j < 100;j++){
             let cellClass = 
              mapArr[i * 100 + j] == 1 ? "cell block" :'cell' 
            let cell = document.createElement('div');
            cell.className = cellClass;
            cell.addEventListener('mousemove',function(){
                if(mousedown){
                    if(clear){
                        //右键
                        cell.className = 'cell';
                        mapArr[i * 100 + j] = 0
                    }else{
                        cell.className = 'cell block'
                        mapArr[i * 100 + j] = 1
                    }
                }
            })
            container.appendChild(cell)  
        }
    }
}
render()

class Sorted{
    constructor(arr,compare){
        this.arr = arr.slice();
        this.compare = compare || ((a,b)=> a-b);
    }

    //每次都取这里面最小的数值
    take(){
        if(this.arr.length === 0){//数组为空
            return
        }
        //默认最小值第一项
        let min = this.arr[0];
        //最小值索引
        let minIndex = 0;
        for(let i = 0 ; i < this.arr.length;i++){//找到最小值及其索引
            if(this.compare(min,this.arr[i]) > 0){
                min = this.arr[i];
                minIndex = i;
            }
        }
        this.arr[minIndex] = this.arr[this.arr.length - 1];//将数组最后一位换位置
        this.arr.pop()
        return min;
    }
    give(item){
        this.arr.push(item)
    }
}

//设置标识
let mousedown = false;
let clear = false
document.addEventListener('mousedown',()=>mousedown = true)

//阻止鼠标右键默认事件
document.addEventListener('contextmenu',e=>e.preventDefault())
document.addEventListener('mousemove',(e)=>{
    //e.which 左1  右3
    clear = e.which === 3
})

document.addEventListener('mouseup',()=>mousedown = false)
btn.addEventListener('click',()=>localStorage['mapArr'] = JSON.stringify(mapArr))

//一个延时的函数
function delay(durtion){
    return new Promise(resolve=>{
        setTimeout(resolve,durtion)
    })
}

//实现广度优先搜索,给定起点，终点，找到路径
async function findPath(arr,start,end){
    // debugger;
    function distance(point){
        return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
    }
    let queue = new Sorted([start],(a,b)=>distance(a) - distance(b));
    let table = Object.create(arr) //创建一个地图坐标的副本，记录找到该路径的上一个点的坐标
    async function insert(x,y,prev){
        if(x <0 || x >= 100 || y < 0 || y >= 100){//边界直接终止
            return
        }
        if(table[y * 100 + x]){//遇到障碍直接跳过，已加入过队列的，不再重复加入。
            return;
        }
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen'
        queue.give([x,y])
        table[y * 100 + x] =  prev;
        arr[y * 100 + x] = 2;
    }
        while(queue.arr.length){
        let [x,y] = queue.take()
        container.children[y * 100 + x].style.backgroundColor = 'lightblue'
        if(x === end[0] && y === end[1]){//到达目标点
            let path = []//保存路径
            while(x !== start[0] || y !== start[1]){
                path.push(table[y * 100 + x])
                await delay(30);
             [x,y] = table[y * 100 + x];
 
            container.children[y * 100 + x].style.backgroundColor = 'purple'
            }
            return path;
        }
        //四周
        
       await insert(x-1,y,[x,y])
       await insert(x + 1,y,[x,y])
       await insert(x,y-1,[x,y])
       await insert(x,y+1,[x,y])

       //斜向
       await insert(x-1,y-1,[x,y])
       await insert(x+1,y+1,[x,y])
       await insert(x-1,y+1,[x,y])
       await insert(x+1,y-1,[x,y])
    }  
    return null  
}