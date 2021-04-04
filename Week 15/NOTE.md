学习笔记
## 组件
- 组件的基本特征
1概述：跟UI强相关的东西（可以理解为特殊的对象或特殊的模块）。特点：以树形结构来进行组合(children)。模板化的配置能力(config)。
2为了理解组件，我们可以看一下普通对象的组成：
 Properties（属性）
 Methods（方法）    属性和方法可以归为一类。
 Inherit（继承关系）
2组件的组成：
Config:使用组件的人传递的参数
State:组件的状态。用户的操作，或者方法的调用，组件的状态会发生改变。
Properties:属性
Event:事件相关
LifeCycle:组件的生命周期
Attribute:特性
Children ：组件一般来讲都是树形结构，而Children是树形结构必备的。

3图解组件![组件图解](./组件图解.png)

4重点区分下property和attribute.
 - 这两者是否相同取决于组件的设计者。
 -  