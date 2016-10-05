$(function () {
    $(document).on("mousedown",false);
        var canvas=$('.canvas').get(0);
        var ctx=canvas.getContext("2d");
        var width=canvas.width;
        var ROW=14;
        var off=canvas.width/ROW;
        var flag=true;
        var bloks={};
        var app=false;
        var AI=$(".AI");
        var people=$('.people');
        var action=$('.action');
        var actionone=$('.action-one');
        var explain=$('.explain');
        var explainlist=$('.explain-list');
        var reset=$('.reset')
        var operaction=$('.operation');
        var can=$('.canvas');
        var centerlist=$('.center-listbox');
        var ex=$('.explains');


    function p2k(x,y){
        return x+"_"+y;
    }
    function vk(position){
        return position.x+"_"+position.y;
    }
    var blank={};
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    };

    function ai(){
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for(var i in blank){
         //blank所有空白位置
         var score1=check(k2o(i),'black');
         var score2=check(k2o(i),'white');
            if(score1>max1){
                max1 = score1;
                pos1 = k2o(i);
            };
            if(score2>max2){
                max2 = score2;
                pos2 = k2o(i);
            }
        }
        if(max1>=max2){
            return pos1;
        }else{
            return pos2;
        }
    }

    function draw(){
    function qipan(){
        for(var i=0;i<ROW;i++){
            ctx.beginPath();
            ctx.moveTo(off/2+0.5,off/2+0.5+i*off);
            ctx.lineTo((ROW-0.5)*off+0.5,off/2+0.5+i*off);
            ctx.moveTo(off/2+0.5+i*off,off/2+0.5);
            ctx.lineTo(off/2+0.5+i*off,(ROW-0.5)*off+0.5);
            ctx.stroke();
            ctx.closePath();
        };
    };
    qipan();
    function circle(x,y){
        ctx.beginPath();
        ctx.arc((x+0.5)*off,(y+0.5)*off,3,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    circle(3,3);
    circle(11,3);
    circle(7,7);
    circle(3,11);
    circle(11,11);
}
    draw();
    function drawchess(position,color){
        yinxiao();
         ctx.save();
          ctx.beginPath();
          ctx.translate(
              (position.x+0.5)*off+0.5,
              (position.y+0.5)*off+0.5
          );

         if(color==="black"){
             var r=ctx.createRadialGradient(-4,-4,1,0,0,15);
             r.addColorStop(0,"#fff");
             r.addColorStop(0.8,"#000");
             r.addColorStop(1,"black");
             ctx.fillStyle=r;
         }else{
             ctx.fillStyle="#fff";
             ctx.shadowOffsetX = 2;
             ctx.shadowOffsetY = 2;
             ctx.shadowBlur = 2;
             ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
         }
          ctx.arc(0,0,13,0,2*Math.PI);
          ctx.fill();
          ctx.closePath();
          ctx.restore();
         bloks[position.x+'_'+position.y]=color;
         delete blank[vk(position)];
      }

    function check(position,color){
     var num=1;
     var shu=1;
     var zuo=1;
     var you=1;
     var table={};
     for(var i in bloks){
         if(bloks[i]===color){
             table[i]=true;
         }
     }
        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx+1,ty)]){
            num++;
            tx++
        }
        var tx=position.x;
        while(table[p2k(tx-1,ty)]){
            num++;
            tx--
        }

        var ty=position.y;
         while(table[p2k(tx,ty+1)]){
            shu++;
            ty++;
        }
        var ty=position.y;
         while(table[p2k(tx,ty-1)]){
            shu++;
            ty--;
        }

        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx+1,ty-1)]){
            you++;
            tx++;
            ty--;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx-1,ty+1)]){
            you++;
            tx--;
            ty++;
        }

        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx+1,ty+1)]){
            //上边没有所有 写的是相反的方向；
            you++;
            tx++;
            ty--;
        }
        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx-1,ty-1)]){
            you++;
            tx--;
            ty++;
        }
 return Math.max(num,shu,zuo,you);

 }

    function drawtext(position,text,color){
        ctx.save();
        ctx.font="10px 微软雅黑";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
          if(color==="black"){
          ctx.fillStyle="red";
        }
        if(color==="white"){
          ctx.fillStyle="green";
        }
        ctx.fillText(text,(position.x+0.5)*off,(position.y+0.5)*off);
        ctx.restore();
        };
    function k2o(key){
    var arr=key.split("_");
    return {x:(parseInt(arr[0])),
            y:(parseInt(arr[1]))
    };
};

    function review(){
        var i=0;
        for(var position in bloks){
            drawtext(k2o(position),i,bloks[position]);
             i++;
        };
    };
    var fid=false;
    function handlclick(e){
        if(!fid){

        }else{
            var position={
                x:Math.round((e.offsetX-off/2)/off),
                y:Math.round((e.offsetY-off/2)/off)
            };
            if(bloks[vk(position)]){
                return;
            }
            if(app){
                drawchess(position,'black');
                drawchess(ai(),'white');
                if(check(position,"black")>=5){
                    alert("黑棋赢");
                    $(canvas).off('click');
                    if(confirm("是否生成棋谱")){
                        review();
                    }
                    return;
                }
                if(check(ai(),"white")>=6){
                    alert("白棋赢");
                    $(canvas).off('click');
                    if(confirm("是否生成棋谱.....")){
                        review();
                    }
                    return;
                }
                return;
            }
            if(flag){
                drawchess(position,'black');
                if(check(position,"black")>=5){
                    alert("黑棋赢");
                    if(confirm("是否生成棋谱")){
                        review();
                    }
                    return;

                };
                flag=false;
            }else{
                drawchess(position,'white');
                if(check(position,"white")>=5){
                    alert("白棋赢");
                    $(canvas).off('click');
                    if(confirm("是否生成棋谱")){
                        review();
                    }
                    return;
                };
                flag=true;
            }
        }


    }



    
    $(".canvas").on("click",handlclick);

     AI.on("mousedown",false);

     AI.on("mousedown",function(){
     AI.toggleClass("active");
         if(app==true){
             app=false;
         }else if(app==false){
             app=true;
         }
 });

    function restart(){
         ctx.clearRect(0,0,width,width);
         flag=true;
         bloks={};
         $(".canvas").off('click').on('click',handlclick);
         draw();
    };
    var audio=$('audio').get(0);
    function yinxiao(){
    audio.play();
}
    var music=$('audio').get(1);
    function background(){
        music.play();
    }

    $('.action-one .people input').on("click",function () {
        $('.action-one .people input:checkbox').prop('checked',true);
        $('.action-one .AI input:checkbox').prop('checked',false);
    });
    $('.action-one .AI input').on("click",function () {
        $('.action-one .people input:checkbox').prop('checked',false);
        $('.action-one .AI input:checkbox').prop('checked',true);
    });

    action.on("mousedown",function () {
        action.toggleClass("active");
        actionone.toggleClass("xiala");
    })
    AI.on("mousedown",function () {
        restart();
        fid=true;
        actionone.removeClass("xiala");
    })
    people.on("mousedown",function () {
        restart();
        fid=true;
        actionone.removeClass("xiala");
    })
    explain.on("click",function () {
      explainlist.toggleClass("xialas");
    })

    reset.on("click",function () {
        ctx.clearRect(0,0,width,width);
        bloks={};
         draw();
         restart();
    })

   centerlist.on("mousedown",function () {
       centerlist.addClass("topkk")
        operaction.addClass("left");
        explain.addClass("right");
        ex.addClass("right");
        can.addClass("opacity");
       background();
    })
    ex.on("mousedown",function () {
        window.close();
    })
});