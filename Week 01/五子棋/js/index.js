//15

//映射棋盘，我们约定1为黑旗旗，2为白旗，0没有棋子
let chessArr = [];
let number = 1 //开始是黑旗
let isGameOver = false;
function initChessArr(){
    for(let i = 0 ; i < 15;i++){
        chessArr[i] = []
        for(let j = 0 ; j < 15;j++){
            chessArr[i][j] = 0
        }
    }
}
initChessArr()
let container = document.querySelector('.container');
function render(){
    for(let i = 0 ; i < 15;i++){
        for(let j = 0 ; j < 15;j++){
            let chessClass = 
            chessArr[i][j] === 1 ? 'chess white' :
            chessArr[i][j] === 2 ? 'chess black' : 
            'chess';
            let chess = document.createElement('div');
                chess.className = chessClass;
                chess.style.left = j * 50 + 7 + 'px';
                chess.style.top = i * 50 + 7 + 'px'
                chess.addEventListener('click',function(){
                    move(j,i)
                })
                container.appendChild(chess)
            
        }
    }
}
render()


//点击事件
function move(x,y){
    if(isGameOver){
        return;
    }
    if(chessArr[y][x]){
        return ;
    }
    chessArr[y][x] = number;
    console.log(checkWin(chessArr,x,y,number))
    if(checkWin(chessArr,x,y,number)){
        isGameOver = true
        let winer = number === 1 ? '黑旗' : '白旗'
        document.querySelector('.info').innerText =  `游戏结束${winer}胜利`
    }
    number = 3 - number;
    render()
   
}

//胜负判断逻辑
function checkWin(chessArr,x,y,number){
    //横向
    {
        //y相等
        let win = true;
        let start = x;
        let end = x
        //向左
        for(let i = x ; i>= 0;i--){
            if(chessArr[y][i] === number){
                start = i;
            }else{
                break;
            }
        }

        //向右
        for(let j = x ; j<= 14;j++){
            if(chessArr[y][j] === number){
                end = j;
            }else{
                break;
            }
        }     
        if(end - start + 1 < 5){
            win = false;
        }  else{
            return true
        } 
        
    }

    //纵向
    {
        //x相等
        let win = true;
        let start = y;
        let end = y
        //向上
        for(let i = y ; i>= 0;i--){
            if(chessArr[i][x] === number){
                start = i;
            }else{
                break;
            }
        }

        //向下
        for(let j = y ; j<= 14;j++){
            if(chessArr[j][x] === number){
                end = j;
            }else{
                break;
            }
        }     
        if(end - start + 1 < 5){
            win = false;
        }  else{
            return true
        }  
    
    }

    //反斜
    {
        let win = true;
        let start = x;
        let end = x;
        let leftY = y;
        for(let i = x ; i >=0;i-- ){
            if(chessArr[leftY--][i] === number){
                start = i
            }else{
                break;
            }
        }
        let rightY = y
        for(let j = x ; j <= 14;j++ ){
            if(chessArr[rightY++][j] === number){
                end = j
            }else{
                break;
            }
        }
        if(end - start + 1 < 5){
            win = false;
        }else{
            return true
        } 
        
    }

    //正斜
    {
        let win = true;
        let start = x;
        let end = x;
        let leftY = y;
        for(let i = x ; i >=0;i-- ){
            if(chessArr[leftY++][i] === number){
                start = i
            }else{
                break;
            }
        }
        let rightY = y
        for(let j = x ; j <= 14;j++ ){
            if(chessArr[rightY--][j] === number){
                end = j
            }else{
                break;
            }
        }
        if(end - start + 1 < 5){
            win = false;
        }else{
            return true
        } 
        return win
    }
    
}
