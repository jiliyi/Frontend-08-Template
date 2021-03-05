const css = require('css')

const EOF = Symbol('EOF')//end of file

let currentToken = null;//暂存从状态机中读到的内容

let currentAttribute = null;

let currentTextNode = null;//暂存文本节点

let stack = [{//如果写的是配对良好的html代码，整个栈应该是空的，初始根节点，方便把树拿出来
    type : 'document',
    children:[]
}]

//加入新的函数，将css暂存在数组里
let rules = []
function  addCSSRules(text){
    let ast =  css.parse(text)
    // console.log('这是 css ast', JSON.stringify(ast))
    rules.push(...ast.stylesheet.rules)
}

function specificity(selector){
    let p = [0,0,0,0]
    let selectorParts = selector.split(' ')
    for(let part of selectorParts){
        if(part.charAt(0) === "#"){
            p[1] +=1
        }else if(part.charAt(0) === '.'){
            p[2] +=1
        }else{
            p[3]+=1
        }
    }
    return p
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
  }

function match(element,selector){
    if(!selector ||!element.attributes){
        return false
    }
    if(selector.charAt(0) === '#'){
        let attr = element.attributes.filter(attr=>attr.name === 'id')[0]
        if(attr && attr.value === selector.replace('#','')){
            return true
        }
    }else if(selector.charAt(0) === '.'){
        let attr = element.attributes.filter(attr=>attr.name === 'class')[0]
        if(attr && attr.value === selector.replace('.','')){
            return true
        }
    }else{
        if(element.tagName === selector){
            return true
        }
    }
    return false
}

function computCSS(element){
    let elements =  stack.slice().reverse()
    if(!element.computedStyle){
        element.computedStyle = {
        }
    }

    for(let rule of rules){
        let selectorParts = rule.selectors[0].split(' ').reverse()
        if(!match(element,selectorParts[0])){
            continue
        }
        let matched = false;
        let j = 1;
        for(let  i = 0 ; i <elements.length;i++){
            if(match(elements[i],selectorParts[j])){
                j++
            }
        }
        if(j>=selectorParts.length){
            matched = true
        }
        if(matched){
            let sp = specificity(rule.selectors[0])
            let computedStyle = element.computedStyle;
            for(let declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {}
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }else if(compare(computedStyle[declaration.property].specificity,sp)<0){
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
            }
            console.log(computedStyle)
        }
    }

}

function emit(token){//输出读到的token

    let top = stack[stack.length-1]//取出栈顶元素
    if(token.type === 'startTag'){//来的是开始标签，入栈操作
        let element = {
            type : 'element',
            children : [],
            attributes:[]
        }
        element.tagName = token.tagName;
        for(let prop in token){
            if(prop !== 'type' && prop != 'tagName'){
                element.attributes.push(
                    {     
                        name : prop,
                        value : token[prop]
                    } )
                
            }
        }
          //假设在startTag已经收集好所有css代码，其他情况暂不考虑
          computCSS(element)
            top.children.push(element)
        element.parent = top;

      

        if(!token.isSelfClosing){//不是自封闭标签，入栈
            stack.push(element)
        }
        currentTextNode = null;
    }else if(token.type === 'endTag'){//结束标签
        if(top.tagName !== token.tagName){
            throw new Error('tag start end doesn\'t match')
        }else {
            stack.pop()
        }
        if(token.tagName === 'style'){//将style里面描述css文本内容收集起来
            addCSSRules(top.children[0].content)
        }
        currentTextNode = null;
    }else if(token.type === 'text'){//文本节点处理
        if(currentTextNode === null){
            currentTextNode = {
                type : 'text',
                content : ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content+=token.content
    }
}

function data(c){//状态机入口，
    if(c === '<'){//进入开始状态
        return tagOpen
    }else if(c === EOF){
        emit({
            type : 'EOF',
            content : EOF
        })
        return
    }else{//文本节点待会儿再处理
        emit({
            type : 'text',
            content : c
        })
        return data
    }
}
function  tagOpen(c){
    if(c === '/'){//进入末尾标签状态
        return endTagOpen
    }else if(c.match(/^[a-zA-Z]$/)){//进入tagName状态

        currentToken = {
            type : 'startTag',
            tagName : ''
        }
        return tagName(c)
    }else{
        return
    }
}
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type : 'endTag',
            tagName : ''
        }
        return tagName(c)
    }else if(c === ">"){

    }else if(c === EOF){

    }else{

    }
}
function tagName(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c;
        return tagName
    }else if(c.match(/^[\n\t\f ]$/)){
        return beforeAttributeName
    }else if(c === '/'){
        return selfClosingStartTag
    }else if(c === '>'){//开始下一个标签的解析
        emit(currentToken)
        return data
    }else{//容错处理
        return tagName
    }
}
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
    }else if(c === EOF || c ===  '>' || c === '/'){
        return afterAttreibuteName(c)
    }else if(c === '='){//出现错误
        
    }else{
        currentAttribute = {
            name : '',
            value : ''
        }
        return attributeName(c) 
    }
}
function afterAttreibuteName(c){
    if(c.match(/^[\n\t\f ]$/)){
        return afterAttreibuteName
    }else if(c === "/"){
        return selfClosingStartTag
    }else if(c === '='){
        return beforeAttributeValue
    }else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }else if(c === EOF){

    }else{
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name:'',
            value:''
        }
        return attributeName
    }
}
function attributeName(c){
    if(c.match(/^[\n\t\f ]$/) || c === '/' || c === EOF){
        return afterAttreibuteName(c)
    }else if(c === '='){
        return beforeAttributeValue
    }else if(c === '\u0000'){

    }else if(c === "/" || c === "'" || c === "<"){

    }else{
        currentAttribute.name+=c;
        return attributeName
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\n\f\t ]$/) || c === '/' || c === '>' || c === EOF){
        return beforeAttributeValue
    }else if(c === "\""){//双引号开头
        return doubleQuotedAttributeValue
    }else if(c === "\'"){//单引号开头
        return singleQuotedAttributeValue
    }else{
        return unQuotedAttributeValue(c)
    }
}


function doubleQuotedAttributeValue(c){//双引号
    if(c === "\""){//只找双引号结束
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }else if(c === '\u0000'){

    }else if(c === EOF){

    }else{
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
    }else if(c === '/'){
        return selfClosingStartTag
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }else if(c === EOF){

    }else{
        currentAttribute.value+=c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c){
    if(c === "\'"){//找单引号结束
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }else if(c === '\u0000'){

    }else if(c === EOF){

    }else{
        currentAttribute.value+=c
        return singleQuotedAttributeValue
    }
}

function unQuotedAttributeValue(c){
    if(c.match(/^[\n\t\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    }else if(c === '/'){
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }else if(c === '\u0000'){

    }else if(c === '\"' || c === '\'' || c === "<" || c === '=' || c === '`'){

    }else if(c === EOF){

    }else{
        currentAttribute.value+=c
        return unQuotedAttributeValue
    }
}

function selfClosingStartTag(c){
    if(c === '>'){
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    }else if(c === EOF){

    }else{

    }
}
module.exports.parseHTML = function(html){
    let state = data;
    for(let c of html){//将字符串交给状态机解析
        state = state(c)
    }
    state = EOF
    return (stack[0])
}