学习笔记

## Types:
Undefined
Null
Boolean
String
Number
Symbol
Object

- Number:
有精度限制.
JavaScript 有 18437736874454810627( 2^64-2^53+3) 个值。
但是 NaN占用了 9007199254740990，
特殊值：Infinity，无穷大；-Infinity，负无穷大。

- String
String 表示文本数据,


<MultiplicativeExpression>::=
 <Number>|
 <MultiplicativeExpression>"*"<Number>|
 <MultiplicativeExpression>"/"<Number>

 
<AdditiveExpression>::=
 <AdditiveExpression>"+"<MultiplicativeExpression>|
 <AddtiveExpression>"-"<MultiplicativeExpression>|
 <MultiplicativeExpression>|
 "("<AddtiveExpression>")"