function init() {
	calcDependencies();
	show_level_drop();
}

function show_level_drop(){
	var chooseLevel='<select id="degree_level" onchange=showLevelDropInfo()>';
	chooseLevel+='<option value="1">公主</option>';
	chooseLevel+='<option value="2">少女</option>';
	chooseLevel+='</select>';
	chooseLevel+='　-　'
	chooseLevel+='<select id="level_select" onchange=showLevelDropInfo()>';
	for(var i=0;i<=11;i++){
		if(i==0){chooseLevel+='<option value="'+i+'">请选择章节</option>';}
		else{chooseLevel+='<option value="'+i+'">第'+i+'章</option>';}
	}
	chooseLevel+='</select>';

	$("#chooseLevel").html(chooseLevel);
}

function showLevelDropInfo(){
	var highlight=new Array('星之海','韶颜倾城','格莱斯');
	var highlight_style=new Array('xzh','syqc','gls');

	var levelDropInfo='';
	var levelDropNote='';
	var j=$("#level_select").val();
	var degree=$("#degree_level").val()==1 ? "公" : "少";
	if (j!=0){//chapter chosen
		levelDropInfo+='<table border="1"><tr><td><b>名称</b></td><td><b>关卡</b></td><td><b>材料需求统计</b></td></tr>'
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
