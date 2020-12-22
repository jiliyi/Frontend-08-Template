//利用二维数组映射棋盘
let chessboardArr = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

//交替落子的一个变量
let number = 1;

let isGameOver = false;

//渲染页面，每次落子之后重新渲染
function render(){
    let container = document.getElementsByClassName('gameContainer')[0];
    container.innerHTML = '';//每次render之前将container内容置为空；
    for(let i = 0 ; i < chessboardArr.length;i++){
        for(let j = 0 ; j < chessboardArr[i].length;j++){
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerText = 
                chessboardArr[i][j] == 1 ? '×' :
                chessboardArr[i][j] == 2 ? '○' :
                '';//根据棋盘数字来决定是哪一种类型的棋子；

                //点击棋格，落子
            cell.addEventListener('click',function(){
                userMove(j,i)
            })
            container.appendChild(cell)
        }
    }
}

//实现落子的逻辑
function userMove(x,y){
    //每次移动之前检查是否结束游戏
    if(isGameOver){
        return;
    }

    //检查该处是否可以落子
    if(chessboardArr[y][x] !== 0){
        return;//如果该处已经有棋子，就不能下了。
    }
    chessboardArr[y][x] = number;
    if(check(chessboardArr,number,x,y)){
        console.log(number + 'is win')
        isGameOver = true;//如果分出胜负，则结束游戏
        alert(`${number == 1 ? '×': '○'}   win!!!`)
        return;
    }
    number = 3 - chessboardArr[y][x];//让number这个数值在2和1之间轮循。

    console.log( bestChoise(chessboardArr,number))

    render()//重新渲染页面

    if(willWin(chessboardArr,number)){
        console.log('xxx will win')
    }

    computerMove()

  
}

//实现电脑移动的逻辑
function computerMove(){
    let choice = bestChoise(chessboardArr,number);
    if(choice.p){
        chessboardArr[choice.p[0]][choice.p[1]] = number;
        if(check(chessboardArr,number,choice.p[1],choice.p[0])){
            alert('win')
        }
    }
    number = 3 - number
    render()
}

//实现检查胜负的逻辑
function check(chessboardArr,number,x,y){
//每次只有下完的那个才有可能获胜

    //横向,快级作用域，防止变量名冲突
    {
        let isWin = true;
        for(let i = 0 ; i < 3;i++){
            if(chessboardArr[y][i] !== number){
                isWin = false;
            }
        }
         if(isWin){
             return isWin;//如果横向检测成功，就结束判断
         }
    }

    //纵向
    {
        let isWin = true;
        for(let i = 0 ; i < 3;i++){
            if(chessboardArr[i][x] !== number){
                isWin = false
            }
        }
        if(isWin){
            return isWin
        }
    }

    //左斜 
    {
        let isWin = true;
        for(let i = 0 ; i < 3;i++){
            if( chessboardArr[2-i][i] !== number){
               isWin = false;
            }
        }
        if(isWin){
            return true;
        }
    }

    //右斜
    {
        let isWin = true;
        for(let i = 0 ; i < 3;i++){
            if(chessboardArr[i][i] !== number){
                isWin = false
            }
        }
        return isWin;
    }
}

//给游戏加一个ai，判断是否有赢家
function willWin(arr,number){
    for(let i = 0 ; i < 3;i++){
        for(let j = 0 ; j < 3;j++){
            if(arr[i][j]){
                continue ;//如果当前值不为空，直接进入下次循环
            }
            let temp = clone(arr);
            temp[i][j] = number;//尝试在空白处落子
            if(check(temp,number,j,i)){
                return [i,j];
            }
        }
    }
    return false;
}

//辅助函数，深克隆克隆一个数组（当前环境下）
function clone(arr){
    return JSON.parse( JSON.stringify(arr))
}

//递归函数，找到最优解，返回值结构形如{
// p : [x,y],
//result :1   
//}p表示赢得那一个点，result表示输赢标识，约定1：胜利；-1：失败；0：和棋
function bestChoise(chessboardArr,number){
    //特殊情况，将要赢了
    let p;
    if(p = willWin(chessboardArr,number)){
        return {
            p,
            result : 1
        }
    }
    let result = -2;
    p = null
    //循环棋盘，找最优解
    for(let i = 0 ; i < 3;i++){
        for(let j = 0 ; j < 3;j++){
            if(chessboardArr[i][j]){
                continue;//该处已经落子，跳过
            }
            let temp = clone(chessboardArr);
            temp[i][j] = number;//随机落子

            let r = bestChoise(temp,3-number).result//查找对方最优解

            if(-r > result){
                result = -r;
                p = [i,j]  //找到留给对方局面最差的点
            }
        }
    }
    return {
        p,
        result : p ? result : 0
    }
}

render()