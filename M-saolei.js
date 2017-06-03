var mineArray,  //地雷数组
    lastNum,  //剩余雷数
    countNum,  //未被揭开的方块数
    inGame = 0,  //游戏状态，0为结束，1为进行中，2为初始化完毕但未开始
    startTime;  //开始时间

function init(x,y,mine){
    countNum = x * y;
    inGame = 2;
    lastNum = mine;
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
    for(var i = 1; i <= y; i ++){
    	for(var j = 1; j <= x; j ++){                                                    
    		 block += '<div id="b' + i + '-' + j + '" style="left:' + (j - 1) * 20 + 'px;top:' + (i - 1) * 20 + 'px;" class="hidden"></div>';
    	}
    }
    $('#main').html(block).width(x * 20 ).height(y * 20 );
    $('#lastnum').text(lastNum);
}
