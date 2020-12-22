学习笔记
# 实现井字棋的要点技巧：
- 1找到合适的数据结构来表示棋盘（二维数组）
- 2满足交换率的运算实现轮询两个数字（121212.....）

# 基础知识储备：
- 1 深克隆一个对象的方法：
```js
let obj = {
    name : 'deng',
    age : 34,
    childs : ['a','b','c'],
    wife : {
        name : 'liu'
    }
}
let newObj = JSON.parse(JSON.stringify(obj));
``` 
- 2 块级作用域的妙用，避免重复申明多个意义相近的变量。利于阅读
