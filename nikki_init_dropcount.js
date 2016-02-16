function init() {
	calcDependencies();
	show_level_drop();
}

var maxc=11;

function show_level_drop(){
	var chooseScope='';
	chooseScope+='<select id="selectScope" onchange=chgScope()>'
	chooseScope+='<option value="1">关卡</option>';
	chooseScope+='<option value="2">衣服</option>';
	chooseScope+='</select>';
	chooseScope+='　-　'
	$("#chooseScope").html(chooseScope);
	chgScope();
}

function chgScope(){
	$("#chooseSub").html('');
	var chooseLevel='';
	if($("#selectScope").val()==1){
		chooseLevel+='<select id="degree_level" onchange=showLevelDropInfo()>';
		chooseLevel+='<option value="1">公主</option>';
		chooseLevel+='<option value="2">少女</option>';
		chooseLevel+='</select>';
		chooseLevel+='　-　'
		chooseLevel+='<select id="level_select" onchange=showLevelDropInfo()>';
		for(var i=0;i<=maxc;i++){
			if(i==0){chooseLevel+='<option value="'+i+'">请选择章节</option>';}
			else{chooseLevel+='<option value="'+i+'">第'+i+'章</option>';}
		}
		chooseLevel+='</select>';
		$("#chooseLevel").html(chooseLevel);
	}
	else{
		chooseLevel+='<select id="chooseCate" onchange=chgScopeSub()>';
		for(var i in category){
			{chooseLevel+='<option value="'+i+'">'+category[i]+'</option>';}
		}
		chooseLevel+='</select>';
		$("#chooseLevel").html(chooseLevel);
		chgScopeSub();
	}
}

function chgScopeSub(){
	var j=$("#chooseCate").val();
	var chooseSub='　-　'
	chooseSub+='<select id="chooseItem" onchange=showFactorInfo()>';
	chooseSub+='<option value="na">请选择衣服</option>';
	for(var i in clothes){
		if (clothes[i].type.type==category[j]){
			if(clothes[i].source.indexOf('设')>-1||clothes[i].source.indexOf('进')>-1)
			{chooseSub+='<option value="'+i+'">'+clothes[i].name+'</option>';}
		}
	}
	chooseSub+='</select>';
	$("#chooseSub").html(chooseSub);
}

function showFactorInfo(){
	var t=$("#chooseItem").val();
	if(t=='na'){$("#levelDropInfo").html('');}
	else{genFactor(t);}
}

function showLevelDropInfo(){
	var highlight=new Array('星之海','韶颜倾城','格莱斯');
	var highlight_style=new Array('xzh','syqc','gls');
	
	var levelDropInfo='';
	var levelDropNote='';
	var j=$("#level_select").val();
	var degree=$("#degree_level").val()==1 ? "公" : "少";
	if (j!=0){//chapter chosen
		levelDropInfo+='<table border="1"><tr><td><b>名称</b></td><td><b>关卡</b></td><td><b>材料需求统计</b></td></tr>';
		for (l=1;l<30;l++){//sort by levels
			if (l>20){var l2="支"+l%10;}
			else{var l2=l+'';}
			
			for (var i in clothes){
				src=clothes[i].source.split("/");
				for (k=0;k<src.length;k++){
					if(src[k].indexOf(j+'-'+l2+degree)==0){//if source matches chapter&level
						var deps1=clothes[i].getDeps('   ', 1);
						var deps=deps1;
						var item='';
						
						for (var h in highlight){
							if(deps1.indexOf(highlight[h])>-1){
								var style=highlight_style[h];
								var ind=deps.lastIndexOf(highlight[h]);
								while(ind>-1){//in case it appears 2 times like 5-10
									var HRow_end=deps.indexOf('\n',ind)>-1 ? deps.indexOf('\n',ind) : deps.length;
									var HRow_start=deps.substr(0,ind).lastIndexOf('\n   [')+1;
									deps=deps.substr(0,HRow_start)+'<span class="'+style+'">'+deps.substr(HRow_start,HRow_end-HRow_start)+'</span>'+deps.substr(HRow_end);
									ind=deps.substr(0,HRow_start).lastIndexOf(highlight[h]);
								}
								item+='<span class="'+style+'">'+clothes[i].name+'</span><br/>';
							}
						}
						
						if(!item){item=clothes[i].name;}
						
						levelDropInfo+='<tr>';
						levelDropInfo+='<td>'+item+'</td>';
						levelDropInfo+='<td>'+src[k]+'</td>';
						levelDropInfo+='<td class="level_drop_cnt">'+deps+'</td>';
						levelDropInfo+='</tr>';
					}
				}
			}
		}
		levelDropInfo+='</table>';
		for (var h in highlight){
			if(h>0){levelDropNote+='&ensp;/&ensp;';}
			levelDropNote+='<span class="'+highlight_style[h]+'">'+highlight[h]+'材料</span>';
		}
	}
	
	$("#levelDropInfo").html(levelDropInfo);
	$("#levelDropNote").html(levelDropNote);
}

var reqCnt=[];
var parentInd=[];
var extraInd=[];
var shownFactor=[];

function genFactor(id){
	for (var i in clothes){//clear count in previous run
		reqCnt[i]=0;
		parentInd[i]=0;
		extraInd[i]=0;
		shownFactor[i]=0;
	}
	
	genFactor2(clothes[id],1);
	for (var i in clothes){//add extra count after factorize
		if(extraInd[i]) {reqCnt[i]+=1; genFactor2(clothes[i],1);}
	}
	
	var src=['少','公','店',''];
	
	var factor='';
	factor+='<table border="1"><tr><td><b>名称</b></td><td><b>来源</b></td><td><b>需求数量</b></td></tr>';
	
	for (var s in src){//sort by source
	
	if(s<3){
	factor+='<tr><td colspan="3">'+src[s]+'</td></tr>';
	}else{
	factor+='<tr><td colspan="3">其他</td></tr>';
	}
	
	for (l1=1;l1<=maxc;l1++){
		for (l=1;l<30;l++){//sort by levels
			if (l>20){var l2="支"+l%10;}
			else{var l2=l+'';}
	
		for (var i in clothes){
		if(!shownFactor[i]){
			if(reqCnt[i]&&(!parentInd[i])) {
			
			
			if((clothes[i].source.indexOf(l1+'-'+l2+src[s])>-1&&s<2)||(clothes[i].source.indexOf(src[s])>-1&&s>=2)){
				shownFactor[i]=1;
				factor+='<tr>';
				factor+='<td>'+clothes[i].name+'</td>';
				factor+='<td>'+clothes[i].source+'</td>';
				factor+='<td>'+reqCnt[i]+'</td>';
				factor+='</tr>';
				
				}
				
				
			}
		}}
		
		
		
		}
	}
	
	
	
	}
	factor+='</table>';
	$("#levelDropInfo").html(factor+'***UNDER CONSTRUCTION***');
	$("#levelDropNote").html('');
}

function genFactor2(cloth,num){
	for (var i in pattern) {
		if (clothesSet[pattern[i][0]][pattern[i][1]]==cloth){//found factor
			for (var j in clothes){//mark it as parent
				if(clothes[j]==cloth){parentInd[j]=1;}
			}
			if(pattern[i][4]>1){//if num required>1
				for (var j in clothes){//mark sub as extra count needed
					if(clothes[j]==clothesSet[pattern[i][2]][pattern[i][3]]){extraInd[j]=1;}
				}
				addreqCnt(clothesSet[pattern[i][2]][pattern[i][3]],(pattern[i][4]-1)*num);
				genFactor2(clothesSet[pattern[i][2]][pattern[i][3]],(pattern[i][4]-1)*num);
			}else{
				addreqCnt(clothesSet[pattern[i][2]][pattern[i][3]],pattern[i][4]*num);
				genFactor2(clothesSet[pattern[i][2]][pattern[i][3]],pattern[i][4]*num);
			}
			
		}
	}
}

function addreqCnt(cloth,num){//add num in reqCnt[]
	for (var i in clothes){
		if (clothes[i]==cloth){
			if(reqCnt[i]){reqCnt[i]+=num;}
			else{reqCnt[i]=num;}
		}
	}
}
