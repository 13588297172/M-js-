var mineArray,  //地雷数组
    leftMineNum,//lastNum,  //剩余雷数
    unopenedBlockNum,//countNum,  //未被揭开的方块数
    inGame = 0,  //游戏状态，0为结束，1为进行中，2为初始化完毕但未开始
    startTime;  //开始时间

function init(x,y,mine){
    unopenedBlockNum = x * y;
    inGame = 2;
    leftMineNum = mine;
    //构建地雷数组
    mineArray = new Array(y + 1);//
    $.each(mineArray,function(key){
    	mineArray[key] = new Array(x + 1);//
    });
    //通过遍历地雷数组，将地雷数组中的各个值初始化为0
    for(var i = 1; i <= y; i ++){
    	for(var j = 1; j <= x; j ++){
    		mineArray[i][j]=0;
    	}
    }
    //在地雷数组中随机布雷，-1为有雷
    while(mine > 0){
    	var i = Math.ceil(Math.random() * y);
        var j = Math.ceil(Math.random() * x);
        if(mineArray[i][j] != -1){
        	mineArray[i][j] = -1;
        	mine--;
        }
    }
    //通过遍历地雷数组，统计每个格子四周地雷的数量，并将此数量设为该格子的值
    for(var i = 1; i <= y; i ++){
    	for(var j = 1; j <= x; j ++){
    		if(mineArray[i][j] != -1){
    			                     //↓左上
                if(i > 1 && j > 1 && mineArray[i - 1][j - 1] == -1) mineArray[i][j] ++;
                            //↓中上
                if(i > 1 && mineArray[i - 1][j] == -1) mineArray[i][j] ++;
                                     //↓右上
                if(i > 1 && j < x && mineArray[i - 1][j + 1] == -1) mineArray[i][j] ++;
                            //↓正右
                if(j < x && mineArray[i][j + 1] == -1) mineArray[i][j] ++;
                                     //↓右下
                if(i < y && j < x && mineArray[i + 1][j + 1] == -1) mineArray[i][j] ++;
                            //↓正下
                if(i < y && mineArray[i + 1][j] == -1) mineArray[i][j] ++;
                                     //↓坐下
                if(i < y && j > 1 && mineArray[i + 1][j - 1] == -1) mineArray[i][j] ++;
                            //↓正左
                if(j > 1 && mineArray[i][j - 1] == -1) mineArray[i][j] ++;
    		}
    	}
    }
    //将地雷数组绘制到相应html元素上
    var block = '';
    for(var i = 1; i <= y; i ++){//
    	for(var j = 1; j <= x; j ++){                                                    
    		 block += '<div id="b' + i + '-' + j + '" style="left:' + (j - 1) * 20 + 'px;top:' + (i - 1) * 20 + 'px;" class="hidden"></div>';
    	}
    }
    $('#main').html(block).width(x * 20 ).height(y * 20 );
    $('#lastnum').text(leftMineNum);
}

$(function(){
	//处理鼠标松开事件
	$('#main').mouseup(function(e){
		//获取所点击方块的坐标
		var clicked = $(e.target);
		var id = clicked.attr('id');
		var cX = parseInt(substring(1,id.indexOf('-')));
		var cY = parseInt(substring(id.indexOf('-') + 1));
        //左击松开或右击松开两种情况
		if(inGame == 1){
			if(e.which == 1){
				if (clicked.hasClass('hidden') && !clicked.hasClass('flag') ) {
					//openBlock(cX,cY);
				}else if( !clicked.hasClass('hidden') ){//!hidden即null和num(点null的openNearBlock无意义)
					//openNearBlock(cX,cY);
				} 
			}else if(e.which == 3 && clicked.hasClass('hidden') ){
				if(clicked.hasClass('flag')) {
					clicked.removeClass('flag');
                    leftMineNum ++;
                    unopenedBlockNum ++;  
                    if( $('#check').attr('checked') ) {
                    	clicked.addClass('check');
                    }
				} else if(clicked.hasClass('check')) {
					clicked.removeClass('check');
				} else {
					clicked.addClass('flag');
                    leftMineNum --;
                    unopenedBlockNum --;
				}
				$('#lastnum').text(leftMineNum);  
			}
			if(leftMineNum == unopenedBlockNum) {
				//endGame(1);
			}
		}else if(inGame == 2){
			if(e.which == 1){
				//openBlock(cX,cY);
				inGame = 1;
			  /*var now = new Date();
				startTime = now.getTime();
				timer();*/
			}
		}
	});
	//阻止默认右击事件
	$('#main').bind('contextmenu', function(){ return false; }); 
});

function openNearBlock(x, y){
	var flagNum = 0;
	for(i = x - 1; i < x + 2; i ++) {
        for(j = y - 1; j < y + 2; j ++) {
            if(mineArray[i][j] != undefined) {
                if($('#b' + i + '-' + j).hasClass('flag')) flagNum ++;  
            }
        }
    }
    //当周围的雷都标记完时，打开剩下的方块
    if(flagNum == mineArray[x][y] ) {  
        for(i = x - 1; i < x + 2; i ++) {
            for(j = y - 1; j < y + 2; j ++) {
                if( !$('#b' + i + '-' + j).hasClass('flag') && $('#b' + i + '-' + j).hasClass('hidden')) //openBlock(i, j);
            }
        }
    }
}

function endGame(isWin){
	inGame = 0;                                  //
	for(var i = 1, row = mineArray.length - 1; i <= row; i ++) {
        for(var j = 1, col = mineArray[0].length - 1; j <= col; j ++) {
            if(isWin) {
                if($('#b' + i + '-' + j).hasClass('hidden') && !$('#b' + i + '-' + j).hasClass('flag')) $('#b' + i + '-' + j).addClass('flag');
                lastNum = 0;
                $('#lastnum').text(lastNum);
            } else {
                openBlock(i, j);
            }
        }
    }
    $('#warning').text(isWin ? 'You Win!' : 'You Lose!');
}

function timer(){
	if(inGame == 1) {  
        var now = new Date(),
            ms = now.getTime();
        $('#time').text(Math.ceil((ms - startTime) / 1000));          
        
        setTimeout(function() { timer(); }, 500);
                                             
    } else if(inGame == 2) {
        $('#time').text('0');
    }
}
/*
function openBlock(x,y){
    //获取当前格子
	var current = $('#b' + x + '-' + y);
    //点到雷、点到数字、点到空的三种情况
    if(mineArray[x][y] == -1) {
        if(inGame == 1) {  
            current.addClass('cbomb');
            //endGame();
        } else if(inGame == 2) {      //init(列、行、雷数)
            init(mineArray[0].length - 1, mineArray.length - 1, lastNum);
            openBlock(x, y);
        } //
    }else if(mineArray[x][y] > 0) { //
        current.html(mineArray[x][y]).addClass('num' + mineArray[x][y]).removeClass('hidden'); 
        if(current.hasClass('check')) current.removeClass('check');
        unopenedBlockNum --;  //
    }else if(mineArray[x][y] == 0) { //
        current.removeClass('hidden');
        if(current.hasClass('check')) current.removeClass('check');
        unopenedBlockNum --;
        //点击到周边无雷的方块时，自动揭开周围方块
        var row = mineArray.length - 1, col = mineArray[0].length - 1;                //......
        if(x > 1   && y > 1   && $('#b' + (x - 1) + '-' + (y - 1)).hasClass('hidden') && mineArray[x - 1][y -1 ] != -1 )    openBlock(x - 1, y - 1);
        if(x > 1   &&                  $('#b' + (x - 1) + '-' + y).hasClass('hidden') &&     mineArray[x - 1][y] != -1 )    openBlock(x - 1, y);
        if(x > 1   && y < col && $('#b' + (x - 1) + '-' + (y + 1)).hasClass('hidden') && mineArray[x - 1][y + 1] != -1 )    openBlock(x - 1, y + 1);
        if(y < col &&                  $('#b' + x + '-' + (y + 1)).hasClass('hidden') &&     mineArray[x][y + 1] != -1 )    openBlock(x, y + 1);
        if(x < row && y < col && $('#b' + (x + 1) + '-' + (y + 1)).hasClass('hidden') && mineArray[x + 1][y + 1] != -1 )    openBlock(x + 1, y + 1);
        if(x < row &&                  $('#b' + (x + 1) + '-' + y).hasClass('hidden') &&     mineArray[x + 1][y] != -1 )    openBlock(x + 1, y);
        if(x < row && y > 1   && $('#b' + (x + 1) + '-' + (y - 1)).hasClass('hidden') && mineArray[x +1 ][y - 1] != -1 )    openBlock(x + 1, y - 1);
        if(y > 1   &&                  $('#b' + x + '-' + (y - 1)).hasClass('hidden') &&     mineArray[x][y - 1] != -1 )    openBlock(x, y - 1);
    }
}
*/
