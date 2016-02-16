function init() {
	calcDependencies();
	show_level_drop();
}

var maxc=11;

function show_level_drop(){
	var chooseScope='';
	chooseScope+='<select id="selectScope" onchange=chgScope()>'
	chooseScope+='<option value="1">按关卡</option>';
	chooseScope+='<option value="2">按衣服</option>';
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
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
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
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
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
	var src=new Array('公','少','店','');
	var src_desc=new Array('公主级掉落','少女级掉落','商店购买','其它');
	
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
	
	var header=[];
	var content=['','','',''];
	var output='<table border="1"><tr><td><b>名称</b></td><td><b>来源</b></td><td><b>需求数量</b></td></tr>';
	
	for (var s in src){//sort by source
		header[s]='<tr><td colspan="3"><u>'+src_desc[s]+'</u></td></tr>';
	
		for (l1=1;l1<=maxc;l1++){
			for (l=1;l<=30;l++){//sort by level
				var l2=l;
				if(l>20){l2="支"+l%10;}
				if(l==28){l2='金币';}//s=2, sort by source
				if(l==29){l2='钻石';}
				if(l==30){l2='';}
				
				//minimize calc
				if(s<2&&l>27){break;}
				if(s==2&&(l1>1||l<28)){continue;}
				if(s==3&&(l1>1||l>1)){break;}
		
				for (var i in clothes){
					if((!shownFactor[i])&&reqCnt[i]&&(!parentInd[i])){
						srci=clothes[i].source;
						if( (s==0&&srci.indexOf(l1+'-'+l2+src[s])>-1&&srci.indexOf(src[1])<0) || 
							(s==1&&srci.indexOf(l1+'-'+l2+src[s])>-1) || 
							(s==2&&srci.indexOf(src[s])>-1&&srci.indexOf(l2)>-1) || 
							(s==3) ){
							shownFactor[i]=1;
							content[s]+='<tr>';
							content[s]+='<td>'+clothes[i].name+'</td>';
							content[s]+='<td>'+srci+'</td>';
							content[s]+='<td>'+reqCnt[i]+'</td>';
							content[s]+='</tr>';
						}
					}
				}
			}
		}
		if (content[s]){output+=header[s]+content[s];}
	}
	output+='</table>';
	$("#levelDropInfo").html(output);
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
