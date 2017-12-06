(function(w){
	w.verticalDrag = function(navsWrap,callback){
//			var navsWrap = document.getElementById('navsWrap');
//			var navsList = document.getElementById('navsList');
			var navsList = navsWrap.children[0];
			transformCss(navsList,'translateZ',0.1);
			
			//定义元素初始位置，手指初始位置
			var eleY = 0;
			var startY = 0;
			
			//加速
			var beginTime = 0;
			var beginValue = 0;
			var endTime = 0;
			var endValue = 0;
			//距离差时间差
			var disTime = 1;
			var disValue = 0;
			
			//tween
			var Tween = {
				//正常：匀速
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//回弹
				easeOut: function(t,b,c,d,s){
			        if (s == undefined) s = 1.70158;
			        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			    }
						
			};
			//定时器
			var timer = 0;
			
			//防抖动
			var startX = 0;
			var isFirst = true;//用户第一次
			var isY = true;
			
			navsWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//清除定时器    ---- 即点即停
				clearInterval(timer);
				
				//清除过渡
				navsList.style.transition = 'none';
				
				eleY = transformCss(navsList,'translateY');
				startY = touch.clientY;
				startX = touch.clientX;
				
				beginTime = new Date().getTime();   //毫秒
				beginValue = eleY;
				
				//清除速度
				disValue = 0;
				
				//状态  滚动条显示
				if(callback && callback['start']){
					callback['start']();
				}
				
				isFirst = true;
				isY = true;
			});
			navsWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				//看门
				if(!isY){
					return;
				}
				//手指结束位置
				var endY = touch.clientY;
				var endX = touch.clientX;
				//手指距离差
				var disY = endY - startY;
				var disX = endX - startX;
				
				//防抖动
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX)>Math.abs(disY)){
						isY = false;
						disY = 0;
					}
				}
				
				//范围限定
				//橡皮筋拖的效果     越来越难拖
				var translateY = disY+eleY;
				var scale = 0;
				var minY = document.documentElement.clientHeight-navsList.offsetHeight;
				if(translateY > 0){
					//比例：越来越小
					//    留白/屏幕宽度 （保证不同机型，实现相同效果）
					//留白 逐渐增大 ，scale逐渐减小，   1-留白/屏幕宽度 
					scale = 1 - translateY/document.documentElement.clientHeight;
					
					translateY = 0 + translateY * scale;
				}else if(translateY <  minY){
					//    留白/屏幕宽度 （保证不同机型，实现相同效果）
					var over = minY - translateY ;
//					var over = Math.abs(translateY) - Math.abs(minY);
					scale = 1 - over/document.documentElement.clientHeight;

				    translateY = minY - over* scale;
				};
				
				transformCss(navsList,'translateY',translateY);
				
				
				endTime = new Date().getTime();
				endValue = translateY;
				disValue = endValue - beginValue;
				disTime = endTime - beginTime;
				
				if(callback && callback['move']){
					callback['move']();
				}
				
			});
			//快速滑屏（加速）
			navsWrap.addEventListener('touchend',function(event){
				var touch = event.changedTouches[0];
				//速度
				var speed = disValue / disTime;
				
				//目标位移距离  = touchmove产生的距离 + 速度计算出的结果
				var target = transformCss(navsList,'translateY') + speed * 100;
				
				var minY = document.documentElement.clientHeight-navsList.offsetHeight;
				
				var type = 'Linear';
				//橡皮筋回弹效果
				if(target > 0){
					target = 0;
					type = 'easeOut';
				}else if(target < minY){
					target = minY;
					type = 'easeOut';
				};
				
				//运动总时间
				var time = '1';
				
				//tween函数
				moveTween(type,target,time);
			});
			
			function moveTween(type,target,time){
				var t = 0; //当前次数
				var b = transformCss(navsList,'translateY'); //初始位置
				var c = target - b ;//初始位置与结束位置之间的距离差
				var d = time/0.02; //总次数
				
				clearInterval(timer);
				timer = setInterval(function(){
					t++;
					if(t>d){
						clearInterval(timer);
						if(callback && callback['end']){
							callback['end']();
						}
					}else{
						var point = Tween[type](t,b,c,d);
//						console.log(point);
						transformCss(navsList,'translateY',point);
						
						if(callback && callback['move']){
							callback['move']();
						}
					}
					
				},20);
				
			}
			
			
		};
})(window)
