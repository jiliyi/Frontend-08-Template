const EOF = Symbol('EOF')//end of file

let currentToken = null;//暂存从状态机中读到的内容
let currentAttribute = null
function emit(token){//输出读到的token
    console.log(token)
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
        return EndTagOpen
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
function EndTagOpen(c){
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
}