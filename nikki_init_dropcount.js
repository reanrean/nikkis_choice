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
	var levelDropInfo='<table border="1">';
	var j=$("#level_select").val();
	var degree=$("#degree_level").val()==1 ? "公" : "少";
	if (j!=0){
		levelDropInfo+='<tr><td><b>名称</b></td><td><b>关卡</b></td><td><b>材料需求统计</b></td></tr>'
		for (l=1;l<30;l++){//sort by levels
			if (l>20){var l_2="支"+l%10;}
			else{var l_2=l+'';}
			
			for (var i in clothes){
				src=clothes[i].source.split("/");
				for (k=0;k<src.length;k++){
					if(src[k].indexOf(j+'-'+l_2+degree)==0){
						var tmp=clothes[i].getDeps('   ', 1).split("\n").join("<br/>");
						
						if(tmp.indexOf('韶颜倾城')>-1){var style='syqc';}
						else if(tmp.indexOf('星之海')>-1){var style='xzh';}
						else if(tmp.indexOf('格莱斯')>-1){var style='gls';}
						else{var style='';}
						
						levelDropInfo+='<tr>';
						levelDropInfo+='<td class="'+style+'">'+clothes[i].name+'</span></td>';
						levelDropInfo+='<td>'+src[k]+'</td>';
						levelDropInfo+='<td class="level_drop_cnt">'+tmp+'</td>';
						levelDropInfo+='</tr>';
					}
				}
			}
		}
	}
	levelDropInfo+='</table>';
	
	var levelDropNote='';
	levelDropNote+='<span class="syqc">粉字</span>：韶颜倾城<br/>';
	levelDropNote+='<span class="xzh">蓝字</span>：星之海<br/>';
	levelDropNote+='<span class="gls">红字</span>：格莱斯<br/>';
	
	$("#levelDropInfo").html(levelDropInfo);
	$("#levelDropNote").html(levelDropNote);
}
