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

## 关于异步编程
前端中实现异步场景有以下情况：
- 1回调（传统模式）
- 2 Promise（es6中提出的异步解决方案，目前得到广泛的应用）
- 3 async/await（Promise的语法糖，形式上类似同步代码，但其实是异步）

- 思考：Promise出现的原因：
说起Promise出现的原因，不得不说说回调存在的问题。
下面是一段简写的代码。看一个红绿灯问题：假设我们要实现以下功能，
绿灯亮10s，黄灯2s，红灯5s，依次循环。
```js
//红灯亮的代码
function red(){
    //.....伪代码
}

//绿灯亮
function green(){
    //...伪代码
}

//黄灯亮
function yellow(){
    //...伪代码
}

function loop(){
    green()
    setTimeout(function(){
        yellow()
        setTimeout(function(){
            red()
            setTimeout(function(){
                loop()
            },5000)
        },2000)
    },10000)
}
loop()
```
上述代码嵌套层级太多，形成了回调地狱，既不利于阅读，也不利于维护，后续想修改功能，就会改动较大。