function init() {
	calcDependencies();
	show_level_drop();
}

var highlight=['星之海','韶颜倾城','格莱斯'];
var highlight_style=['xzh','syqc','gls'];
var src=['公','少','店',''];
var src_desc=['公主级掉落','少女级掉落','商店购买','其它'];
var maxc=11;//max chapter
var reqCnt=[];
var parentInd=[];
var extraInd=[];
var extraAdded=[];
var shownFactor=[];
var setArr=[];

function show_level_drop(){
	var chooseScope='';
	chooseScope+='<select id="selectScope" onchange=chgScope()>'
	chooseScope+='<option value="1">按关卡</option>';
	chooseScope+='<option value="2">按部件</option>';
	chooseScope+='</select>';
	chooseScope+='　-　'
	$("#chooseScope").html(chooseScope);
	chgScope();
}

function chgScope(){
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
		chooseLevel+='<a href="#" class="search" onclick=showLevelDropInfo() >&#x1f50d;</a>';
		$("#chooseLevel").html(chooseLevel);
		$("#chooseSub").html('');
		$("#chooseSub2").html('');
	}else{
		chooseLevel+='<select id="degree_level" onchange=chgScopeSub()>';
		chooseLevel+='<option value="1">设计图</option>';
		chooseLevel+='<option value="2">进化</option>';
		chooseLevel+='<option value="3">套装</option>';
		chooseLevel+='<option value="4">自定义</option>';
		chooseLevel+='</select>';
		$("#chooseLevel").html(chooseLevel);
		chgScopeSub();
	}
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
}

function chgScopeSub(){
	var j=$("#degree_level").val();
	var chooseSub='　-　';
	if(j==4){
		chooseSub+='<input type="text" id="searchById" placeholder="输入名字或编号搜索" />';
		chooseSub+='<a href="#" class="search" onclick=searchById() >&#x1f50d;</a>';
		$("#chooseSub").html(chooseSub);
		$("#chooseSub2").html('');
	}
	else{
		chooseSub+='<select id="chooseCate" onchange=chgScopeSub2()>';
		if (j==1){
			for(var i in category){
				var hvcnt=0;
				for(var c in clothes){
					if(clothes[c].type.type==category[i]&&clothes[c].source.indexOf('设')>-1) {hvcnt+=1;}
				}
				if(hvcnt>0) {chooseSub+='<option value="'+i+'">'+category[i]+'</option>';}
			}
		}else if (j==2){
			for(var i in category){
				var hvcnt=0;
				for(var c in clothes){
					if(clothes[c].type.type==category[i]&&clothes[c].source.indexOf('进')>-1) {hvcnt+=1;}
				}
				if(hvcnt>0) {chooseSub+='<option value="'+i+'">'+category[i]+'</option>';}
			}
		}else if(j==3){
			for(var c in clothes){
				if( (clothes[c].source.indexOf('进')>-1||clothes[c].source.indexOf('设')>-1) && 
					clothes[c].set){
					setArr[c]=clothes[c].set;
				}
			}
			setArr=jQuery.unique(setArr);
			for (var s in setArr){
				if(setArr[s]) {chooseSub+='<option value="'+s+'">'+setArr[s]+'</option>';}
			}
		}
		chooseSub+='</select>';
		$("#chooseSub").html(chooseSub);
		chgScopeSub2();
	}
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
}

function chgScopeSub2(){
	var j=$("#degree_level").val();
	var k=$("#chooseCate").val();

	var chooseSub2='　-　';
	chooseSub2+='<select id="chooseItem" onchange=showFactorInfo()>';
	chooseSub2+='<option value="na">请选择衣服</option>';
	if (j==1){
		for(var i in clothes){
			if(clothes[i].type.type==category[k]&&clothes[i].source.indexOf('设')>-1)
			{chooseSub2+='<option value="'+i+'">'+clothes[i].name+'</option>';}
		}
	}else if(j==2){
		for(var i in clothes){
			if(clothes[i].type.type==category[k]&&clothes[i].source.indexOf('进')>-1)
			{chooseSub2+='<option value="'+i+'">'+clothes[i].name+'</option>';}
		}
	}else if(j==3){
		for(var i in clothes){
			if (clothes[i].set==setArr[k]){
				//if(clothes[i].source.indexOf('设')>-1||clothes[i].source.indexOf('进')>-1)
				{chooseSub2+='<option value="'+i+'">'+clothes[i].name+'</option>';}
			}
		}
	}
	chooseSub2+='</select>';
	chooseSub2+='<a href="#" class="search" onclick=showFactorInfo() >&#x1f50d;</a>';
	$("#chooseSub2").html(chooseSub2);
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
}

function showFactorInfo(){
	var t=$("#chooseItem").val();
	if(t=='na'){
		$("#levelDropInfo").html('');
		$("#levelDropNote").html('');
	}
	else{genFactor(t);}
}

function showLevelDropInfo(){
	var j=$("#level_select").val();
	var degree=$("#degree_level").val()==1 ? "公" : "少";
	if (j!=0){//chapter chosen
		levelDropInfo='<table border="1"><tr><td><b>名称</b></td><td><b>关卡</b></td><td><b>材料需求统计</b></td></tr>';
		for (l=1;l<30;l++){//sort by levels
			if (l>20){var l2="支"+l%10;}
			else{var l2=l+'';}
			
			for (var i in clothes){
				var src_sp=clothes[i].source.split("/");
				for (k=0;k<src_sp.length;k++){
					if(src_sp[k].indexOf(j+'-'+l2+degree)==0){//if source matches chapter&level
						var deps1=clothes[i].getDeps('   ', 1);
						var deps=add_genFac(deps1,1);
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
						levelDropInfo+='<td><a href="#" class="inherit" onclick="genFactor('+i+')" >'+item+'</a></td>';
						levelDropInfo+='<td>'+src_sp[k]+'</td>';
						levelDropInfo+='<td class="level_drop_cnt">'+deps+'</td>';
						levelDropInfo+='</tr>';
					}
				}
			}
		}
		levelDropInfo+='</table>';
		var levelDropNote='';
		for (var h in highlight){
			if(h>0){levelDropNote+='&ensp;/&ensp;';}
			levelDropNote+='<span class="'+highlight_style[h]+'">'+highlight[h]+'材料</span>';
		}
	}
	$("#levelDropInfo").html(levelDropInfo);
	$("#levelDropNote").html(levelDropNote);
}

function genFactor(id){
	for (var i in clothes){//clear count in previous run
		reqCnt[i]=0;
		parentInd[i]=0;
		extraInd[i]=0;
		extraAdded[i]=0;
		shownFactor[i]=0;
	}
	
	genFactor2(clothes[id],1);
	do{
		var total=0;
		for (var i in clothes){//add extra count once only
			if(extraInd[i]&&(!extraAdded[i])) 
			{reqCnt[i]+=1; genFactor2(clothes[i],1); extraAdded[i]=1; total+=1;}
		}
	}while(total>0);
	
	var header=[];
	var content=['','','',''];
	var output='<table border="1">';
	output+='<tr><td colspan="3"><b>'+clothes[id].name+'</b>&ensp;'+clothes[id].type.type+'&ensp;'+clothes[id].id+'</td></tr>';
	output+='<tr><td colspan="3">';
	if(clothes[id].simple[0]) output+='简约'+clothes[id].simple[0];
	if(clothes[id].simple[1]) output+='华丽'+clothes[id].simple[1];
	if(clothes[id].cute[0]) output+='&ensp;可爱'+clothes[id].cute[0];
	if(clothes[id].cute[1]) output+='&ensp;成熟'+clothes[id].cute[1];
	if(clothes[id].active[0]) output+='&ensp;活泼'+clothes[id].active[0];
	if(clothes[id].active[1]) output+='&ensp;优雅'+clothes[id].active[1];
	if(clothes[id].pure[0]) output+='&ensp;清纯'+clothes[id].pure[0];
	if(clothes[id].pure[1]) output+='&ensp;性感'+clothes[id].pure[1];
	if(clothes[id].cool[0]) output+='&ensp;清凉'+clothes[id].cool[0];
	if(clothes[id].cool[1]) output+='&ensp;保暖'+clothes[id].cool[1];
	if(clothes[id].tags[0]) output+='&ensp;'+clothes[id].tags.join(',');
	if(clothes[id].set) output+='&ensp;套装:'+clothes[id].set;
	output+='</td></tr>';
	output+='<tr><td colspan="3">来源:'+clothes[id].source;
	
	if(parentInd[id]) {
		//if parent show formula
		output+=' = ';
		for (var p in pattern) {
			if (clothesSet[pattern[p][0]][pattern[p][1]]==clothes[id]){
				//show link
				//output+=clothesSet[pattern[p][2]][pattern[p][3]].name+'x'+pattern[p][4]+' ';
				for (var c in clothes){
					if(clothes[c]==clothesSet[pattern[p][2]][pattern[p][3]]){
						output+='<a href="#" onclick="genFactor('+c+')" >'+clothes[c].name+'</a>x'+pattern[p][4]+' ';
						break;
					}
				}
			}
		}
		output+='</tr></td>';
		output+='<tr><td><b>基础材料</b></td><td><b>来源</b></td><td><b>需求数量</b></td></tr>';
		
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
							var srci=clothes[i].source;
							var src_sp=clothes[i].source.split("/");
							for (var ss in src_sp){
								if( (s==0&&src_sp[ss].indexOf(l1+'-'+l2+src[s])==0&&srci.indexOf(src[1])<0) || 
								(s==1&&src_sp[ss].indexOf(l1+'-'+l2+src[s])==0) || 
								(s==2&&srci.indexOf(src[s])>-1&&srci.indexOf(l2)>-1) || 
								(s==3) ){
									shownFactor[i]=1;
									content[s]+='<tr>';
									content[s]+='<td><a href="#" onclick="genFactor('+i+')" >'+clothes[i].name+'</a></td>';
									content[s]+='<td>'+srci+'</td>';
									content[s]+='<td>'+reqCnt[i]+'</td>';
									content[s]+='</tr>';
									break;
								}
							}
						}
					}
				}
			}
			if (content[s]){output+=header[s]+content[s];}
		}
	}
	
	var deps1=clothes[id].getDeps('   ', 1);
	if (deps1){
		var pos1=deps1.indexOf('总计需');
		var pos2=deps1.indexOf('件',pos1);
		var strip=deps1.substr(pos1+3,pos2-pos1-3);
		output+='<tr><td colspan="3"></td></tr>';
		output+='<tr><td colspan="2"><b>此部件共需数量</b></td>';
		output+='<td>'+strip+'</td></tr>';
		output+='<tr><td class="level_drop_cnt" colspan="3">'+add_genFac(deps1);+'</td></tr>';
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
			}else if(pattern[i][5]=='设'){//do not consume
				for (var j in clothes){
					if(clothes[j]==clothesSet[pattern[i][2]][pattern[i][3]]){extraInd[j]=1;}
				}
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

function searchById(){
	var searchById=$("#searchById").val();
	var searchById_match=0;
	if(searchById){
		var levelDropInfo='查找：'+searchById;
		levelDropNote='<table border="1"><tr><td><b>名称</b></td><td><b>分类</b></td><td><b>编号</b></td></tr>';
		for (var i in clothes){
			if(clothes[i].name.indexOf(searchById)>-1||parseInt(clothes[i].id)==parseInt(searchById)){
				levelDropNote+='<tr><td>';
				levelDropNote+='<a href="#" onclick="genFactor('+i+')" >'+clothes[i].name+'</a>';
				levelDropNote+='</td><td>'+clothes[i].type.type+'</td><td>'+clothes[i].id+'</td></tr>';
				searchById_match=1;
			}
		}
		levelDropNote+='</table>';
		$("#levelDropInfo").html(levelDropInfo);
		if(searchById_match){$("#levelDropNote").html(levelDropNote);}
		else{$("#levelDropNote").html('没有找到相关资料');}
	}
}

function add_genFac(text,inherit){
	var textArr=text.split('\n'); //[0] to [length-2];
	var parents=[];
	for (var i=1;i<textArr.length-1;i++){//discard [0] for its own name
		var pos_end=(textArr[i].indexOf('[需')>-1 ? textArr[i].indexOf('[需') : textArr[i].length);
		var pos_start=textArr[i].substr(0,pos_end).lastIndexOf(']')+1;
		var pos_start_1=textArr[i].substr(0,pos_start).lastIndexOf('[')+1;
		var clo_name=textArr[i].substr(pos_start,pos_end-pos_start);
		var clo_type=textArr[i].substr(pos_start_1,pos_start-pos_start_1-1);
		for (var c in clothes){
			if (clothes[c].type.mainType==clo_type&&clothes[c].name==clo_name){
				clo_name='<a href="#" onclick="genFactor('+c+')"'+(inherit? 'class="inherit"' : '')+' >'+clo_name+'</a>';
				break;
			}
		}
		parents[i-1]=textArr[i].substr(0,pos_start)+clo_name+textArr[i].substr(pos_end);
		if(!inherit){parents[i-1]=parents[i-1].substr(3);}
	}
	var out=(inherit? textArr[0]+'\n':'')+parents.join('\n');
	return out;
}
