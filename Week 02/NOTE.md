学习笔记

## 第一课 地图编辑器实现
- 功能：在100 * 100的地图里，点击鼠标左键可以在地图对应处加障碍，右键可以消除障碍物。并可以保存地图
- 实现 ：
    1用一维数组表示地图( 长度：100 * 100),数组中0表示该处无障碍物，1表示有障碍物。
    2双层for循环，生成地图元素(cell)
    3给cell添加事件监听函数(mousemove)，添加事件之前，给几个全局标识，mousedown(鼠标是否按下,默认false)，clear(是否要清除,默认为false)。取消鼠标右键默认事件，具体js代码如下：
```js
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
```
   4有了上面的代码，再给cell添加事件监听函数，先判断是否在移动，然后判断点的是左键还是右键。左键添加障碍，右键清除障碍。
   5保存地图的逻辑，在localStorage存一份就行了。

## 第二课笔记
- 实现广度优先搜索（以该案例地图为例）
- 概述：给定起点和终点坐标，找到起点到终点的路径。
- 思路：从起点开始，取到起点上下左右的点，_这些点中如果能走通，加入到能走点的集合中，再继续找能走点四周的点，依次类推。_为了防止重复走，走过的点加标识，下次遇到直接跳过。遇到边界的墙就不加入。此时可能想到用递归，但是递归适用于深度优先搜索，因为递归的话就会先找1周围的点，然后在1周围的点中继续找。接着选用数组来表示集合，入栈出栈的操作就用数组提供的api(shift,push),具体代码见小项目。

## 第四课笔记
- 解决路径问题
- 思路：因为每次insert的时候，
