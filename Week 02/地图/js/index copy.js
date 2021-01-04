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

//二叉堆，保证每次取都取堆顶最小的
class BinaryHeap{//
    constructor(arr,compare){
        this.arr = arr;
        this.compare = compare || ((a,b)=>a-b)
    }
    get length(){
        return this.arr.length;
    }
    take(){//每次都拿最小的
        if(this.length === 0){
            return null
        }
        if(this.length === 1){
            return this.arr[0]
        }
        let min = this.arr[0]
        this.swap(0,this.length-1)
        this.arr.pop()
        this.heapify(0)
        return min;
    }
    give(item){
        this.arr.push(item);
        this.up(this.length - 1);
    }
    heapify (i){//下滤
        let leftIndex = this.getLeft(i)
        let rightIndex = this.getRight(i)
        let minIndex = i
        if(leftIndex <= this.length - 1 && this.compare(this.arr[minIndex],this.arr[leftIndex]) >0 ){
            minIndex = leftIndex 
        }
        if(rightIndex <= this.length - 1 && this.compare(this.arr[minIndex],this.arr[rightIndex])>0){
            minIndex = rightIndex
        }
        if(minIndex !== i){//递归出口
            this.swap(i,minIndex)
            this.heapify(minIndex);
        }
    }
    up(i){//上滤
        if(i === 0){
            return;//递归出口
        }
        // let now = this.arr[i];
        let fathertIndex = this.getFather(i)
        // let father = this.arr[fathertIndex];
        if(this.compare(this.arr[fathertIndex],this.arr[i]) > 0){
            this.swap(i,fathertIndex)
            this.up(fathertIndex)
        }
    }
    swap(i,j){//交换
        let temp = this.arr[i]
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    }
    getLeft(i){
        return 2 * i + 1;
    }
    getRight(i){
        return 2 * i + 2
    }
    getFather(i){
        return Math.floor((i - 1) / 2)
    }
}

//常规数组结构
// class Sorted{
//     constructor(arr,compare){
//         this.arr = arr.slice();
//         this.compare = compare || ((a,b)=> a-b);
//     }

//     //每次都取这里面最小的数值
//     take(){
//         if(this.arr.length === 0){//数组为空
//             return
//         }
//         //默认最小值第一项
//         let min = this.arr[0];
//         //最小值索引
//         let minIndex = 0;
//         for(let i = 0 ; i < this.arr.length;i++){//找到最小值及其索引
//             if(this.compare(min,this.arr[i]) > 0){
//                 min = this.arr[i];
//                 minIndex = i;
//             }
//         }
//         this.arr[minIndex] = this.arr[this.arr.length - 1];//将数组最后一位换位置
//         this.arr.pop()
//         return min;
//     }
//     give(item){
//         this.arr.push(item)
//     }
// }

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
    function distance(point){
        return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
    }
    let queue = new BinaryHeap([start],(a,b)=>distance(a) - distance(b));
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
lookfor.addEventListener('click',()=>{
    findPath(mapArr,[0,0],[50,50])
}) 