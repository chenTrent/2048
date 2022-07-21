var board = new Array();
var score = 0;
var hasConflicted=new Array();
var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

//上面的简写
// $(function(){
//     newgame();
// });

// 准备移动
function prepareForMobile(){
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSideLength=100;
        cellSpace=20;
    }
    
    $("#grid-container").css("width",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("height",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02*gridContainerWidth);

    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    //gridcell的固定位置
    for(var i = 0;i < 4;i++)
        for(var j = 0;j < 4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("left",getPosLeft(i,j));
            gridCell.css("top",getPosTop(i,j));
        }
    //初始化数据，使board成为二维数组，且初始值为0
    for(var i = 0;i < 4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }

    score=0; //初始化分数
    updateScore(score);
    //当board数据发生改变，就调用此函数，此函数使前端界面发生相应的变化
    updateBoardView();
}

function updateBoardView(){
    $(".number-cell").remove();             //移除已有的number-cell
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');  //添加新的number-cell
            var theNumberCell=$("#number-cell-"+i+"-"+j);
            if(board[i][j]==0){                             //为不同的数字设置相应的CSS
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                //下面两句可注释,但会导致动画改变
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }

    $(".number-cell").css("line-height",cellSideLength+"px");
    $(".number-cell").css("font-size",0.6*cellSideLength+"px");
    $(".number-cell").css("border-radius",0.02*cellSideLength);
}

function generateOneNumber(){
    if(nospace(board))
        return false;

    //随机一个位置
    var times=0;
    do{
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));
        times++;
    }while(board[randx][randy]!=0&&times<50);  //判断当前位置是否为空

    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }        
    }
    //随机一个数字
    var randNumber=Math.random()>0.5?2:4;
    
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    switch(event.which){
        case 37://左键
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
            break;
        case 38://上键
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
            break;
        case 39://右键
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
            break;
        case 40://下键
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
            break;
    }
});

document.addEventListener("touchstart",function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});



document.addEventListener("touchend",function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(deltax)<0.05*documentWidth&&Math.abs(deltay)<0.05*documentWidth)
        return;

    if(Math.abs(deltax)>=Math.abs(deltay)){   //X轴方向移动
        if(deltax>0){ //X轴右方向移动
            if(moveRight()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
        }else{  //X轴左方向移动
            if(moveLeft()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
        }
    }else{   //Y轴方向移动
        if(deltay>0){     //Y轴下方向移动
            if(moveDown()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
        }else{          //Y轴上方向移动
            if(moveUp()){
                setTimeout("generateOneNumber()",500);
                setTimeout("isgameover()",500);
            }
        }
    } 
});

function isgameover(){
    if(nospace(board)&&nomove(board))
        gameover();
}

function gameover(){
    window.alert("Game Over!");
    // $("#grid-container").text("Game Over!");
}

function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    
    //移动
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;    //写与不写的区别？？？？？
                    }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;    //写与不写的区别？？？？？
                    }
                }
            }
        }
    
    setTimeout("updateBoardView()",500);
    
    return true;
}

function moveUp(){
    if(!canMoveUp(board))
        return false;

    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",500);
    return true;
}

function moveRight(){
    if(!canMoveRight(board))
        return false;

    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--)
            if(board[i][j]!=0)
                for(var k=3;k>j;k--){
                    if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }

    setTimeout("updateBoardView();",500);
    return true;
}

function moveDown(){
    if(!canMoveDown(board))
        return false;

    for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--)
            if(board[i][j]!=0)
                for(var k=3;k>i;k--){
                    if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }

    setTimeout("updateBoardView()",500);

    return true;    
}