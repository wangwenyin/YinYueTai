(function(w){
	w.transformCss = function (node,name,value){
			//存放名值对　　
			if(!node.aaa){
				node.aaa = {};
			};
			
			
			var result = '';
			//arguments  实参
			if(arguments.length > 2){
				//写
				//把名值对放在空对象中
				node.aaa[name] = value;
				//{translateX: 200, scale: 0.5}
				
				//对象中的属性名 for in --- 枚举
				for(var i in node.aaa){
					
					switch (i){
						case 'translate':
						case 'translateX':
						case 'translateY':
						case 'translateZ':
							result += i + '('+ node.aaa[i] +'px) '; ///'translateX(200px)'
							break;
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							result += i + '('+ node.aaa[i] +') ';//'scale(0.5)'
							break;
						case 'rotate':
						case 'skew':
						case 'skewX':
						case 'skewY':
							result += i + '('+ node.aaa[i] +'deg) ';
							break;
					};
					
				};
				
				
				node.style.transform = result; //'translateX(200px) scale(0.5)'
				
				
			}else{
				//读
				//如果之前没有写的操作，需要读取我们指定的默认值
				if(typeof node.aaa[name] == 'undefined'){
					if(name =='scale' || name == 'scaleX'|| name == 'scaleY'){
						value = 1;
					}else{
						//translate rotate skew
						value = 0;
					};
					
				}else{
					//正常，有写的操作
					value = node.aaa[name];
				};
				
				return value;
			};
			
		};
		
	
})(window);
//1.(function(){
//	
//})()  自调用函数
//2.window是实参
//3.w是形参
//4.就是一个对象里添加名值对，即设置属性
//5.其属性名的属性值是一个函数，属性名（）就是调用函数
//6.如果不需要传参，则直接可属性名（）这样调用，这样的函数里面没有形参，显然扩展性不好
//7.需要传参，则传入具体的实参，可针对同一种情况反复调用
//8.需深刻理解函数和对象

