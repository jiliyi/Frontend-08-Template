学习笔记
- CSS语法的研究
 CSS总体结构：
@charset (指代规定使用的字符编码)
@import (指定导入的外部样式表或媒体)
rule{
    @media(指定样式表规则用于指定的媒体类型和查询条件)
    @page(设置页面容器的版式，方向，边空等。)
    rule
 } (指代一系列可重复的css规则，我们写css主要写这部分)

初步的脑图结构如下
![css整体结构](./css.png)

- CSS@规则的研究
CSS规则分为@规则和普通规则，大部分时候写的是普通规则，@规则写的较为少。但在语法结构上@规则较多，所以有必要研究一下。
开始研究，首先css标准较多，有100多份，从100份标准里面找@相关规则
At-rules
•@charset（规定css字符集） ：https://www.w3.org/TR/css-syntax-3/
•@import ：https://www.w3.org/TR/css-cascade-4/
•@media ：https://www.w3.org/TR/css3-conditional/
•@page ：https://www.w3.org/TR/css-page-3/
•@counter-style ：https://www.w3.org/TR/css-counter-styles-3
•@keyframes ：https://www.w3.org/TR/css-animations-1/
•@fontface：https://www.w3.org/TR/css-fonts-3/
•@supports ：https://www.w3.org/TR/css3-conditional/
•@namespace ：https://www.w3.org/TR/css-namespaces-3/

第四课 css总论 收集标准
第一步在https://www.w3.org/TR/?tag=css此网址控制台将css相关标准抠出来
具体操作如下：
```js
Array.prototype.slice.call( document.querySelector("#container").children).filter(e=>e.getAttribute("data-tag").match(/css/)).map(e=>{return {name:e.innerText,href:e.children[1].children[0].getAttribute('href')}})
```
这样就得到了一份css标准的数组。
数组每一条是标题和链接href组成的对象。
接下来就是将代码放到css.js里面去执行就行了。

- css选择器优先级
总体规则：!important > 内联 > id > class,属性([id=xx]) , 伪类(:hover) > tag(例如h1) , 伪元素(::before) 
通配选择符（universal selector）（*）关系选择符（combinators）（+, >, ~, ' ', ||）和 否定伪类（negation pseudo-class）（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。

简单选择器计数：
简单选择器计数
#id div.a#id {
//......
}
[0, 2, 1, 1]
S = 0 * N³+ 2 * N²+ 1 * N¹+ 1
取N = 1000000
S = 2000001000001
N可以看做是一个进制，N一般取足够大，IE老版本为了节省内存，取255，后果是255个class选择器相当于一个id选择器，造成bug。

