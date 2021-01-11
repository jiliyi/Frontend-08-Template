//这一章整体来说应该是比较模糊，目前只能跟着老师敲了一遍，后续先弄懂ll算法再来回看。

//四则运算正则表达式
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
// 与正则一一对应
let dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];

// 
function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    // 这个地方不是很理解
    lastIndex = regexp.lastIndex;

    result = regexp.exec(source);
    if (!result) break;

    // 与上面的逻辑对应，不理解
    if (regexp.lastIndex - lastIndex > result[0].length) break;
    let token = {
      type: null,
      value: null,
    };
    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) token.type = dictionary[i - 1];
    }
    token.value = result[0];
    yield token;
  }

  yield {//最后加终结符
    type: 'EOF',
  };
}

let source = [];

for (let token of tokenize('7 * 92 + 10')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') source.push(token);
}

function Expression(tokens) {
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()],
    };
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression(source) {
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: [source[0]],
    };
    source[0] = node;
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
    let node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
    let node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (source[0].type === 'AdditiveExpression') {
    return source[0];
  }

  MultiplicativeExpression(source);
  return AdditiveExpression(source);
}
function MultiplicativeExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]],
    };
    source[0] = node;
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }

  if (source[0].type === 'MultiplicativeExpression') {
    return source[0];
  }
  return MultiplicativeExpression(source);
}
console.log(Expression(source));