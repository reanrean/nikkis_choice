 $(document).ready(function () {
	init_top_update();
});

function init_top_update(){
	var ver='';
	for(var v in lastVersion){
		ver+=lastVersion[v];
	}
	$('#textBox').html(ver);
	$('#staffModeOn').hide();
	init_passcode();
	$('#showCnt').val(3);
	$('#limitNote').html('<a href="" onclick="return false;" tooltip="联盟委托和主线关卡使用极限权重，具体请见顶配查询器的说明。">说明</a>');
}

var theme_name;
var storeTop=[];
var storeTop_old=[];
var dp=10;

var lastVersion_id=function() {
	var ret = [];
	for (var i in clothes) {
		for (var v in lastVersion){
			if(clothes[i].version==lastVersion[v]){
				ret.push(i);
			}
		}
	}
	return ret;
}();

function calctopupd(){
	if (isNaN(parseInt($("#showCnt").val())) || $("#showCnt").val()<1) {$("#showCnt").val(1);}
	if (!($('#showJJC').is(":checked")||$('#showAlly').is(":checked")||$('#showNormal').is(":checked"))){
		$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
	}else{
		var date1=new Date();
		storeTopByCate();
		compByTheme();
		addStyles();
		var date2=new Date();
		$('#alert_msg').html('用时'+((date2-date1)/1000).toFixed(2)+'秒_(:з」∠)_');
	}
}

function addStyles(){
	var elts = document.getElementsByTagName('a');
	for (var i = elts.length - 1; i >= 0; --i) {
		if(!elts[i].href) {
			elts[i].href="";
			if(!elts[i].onclick) {elts[i].onclick = function() {return false;};}
		}
		if(elts[i].getAttribute('tooltip')){
			elts[i].setAttribute('tooltip',elts[i].getAttribute('tooltip').replace(/\\n/g,'\n'));
		}
	}
}

function storeTopByCate(){
	var showCnt=parseInt($("#showCnt").val());
	for (var cate in category){
		if ($('#showJJC').is(":checked")){
			for (var b in competitionsRaw){
				theme_name='竞技场: '+b;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([category[cate],getTopCloByCate(criteria,showCnt,category[cate],0)]);
					storeTop_old[theme_name].push([category[cate],getTopCloByCate(criteria,1,category[cate],1)]);
				}
			}
		}
		if ($('#showAlly').is(":checked")){
			for (var c in tasksRaw){
				theme_name=c;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					onChangeCriteria(1);
					storeTop[theme_name].push([category[cate],getTopCloByCate(criteria,showCnt,category[cate],0)]);
					onChangeCriteria(2);
					storeTop_old[theme_name].push([category[cate],getTopCloByCate(criteria,1,category[cate],1)]);
				}
			}
		}
		if ($('#showNormal').is(":checked")){
			for (var d in levelsRaw){
				theme_name='关卡: '+d;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					onChangeCriteria(1);
					storeTop[theme_name].push([category[cate],getTopCloByCate(criteria,showCnt,category[cate],0)]);
					onChangeCriteria(2);
					storeTop_old[theme_name].push([category[cate],getTopCloByCate(criteria,1,category[cate],1)]);
				}
			}
		}
	}
}

function getTopCloByCate(filters,rescnt,type,old){
	var result = [];
	for (var i in clothes) {
		if (clothes[i].type.type!=type){continue;}//skip other categories
		if (old>0&&$.inArray(i,lastVersion_id)>-1) {continue;}
		clothes[i].calc(filters);
		if (clothes[i].isF) {continue;}
		if (clothes[i].type.type.indexOf('饰品')==0) {var sum_score=clothes[i].tmpScore*0.4+clothes[i].bonusScore; sum_score=Math.round(sum_score*dp)/dp;}
		else {var sum_score=clothes[i].sumScore;}
		if (!result[0]) {
			result[0] = [clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore];
		}else {
			if(result[rescnt-1] && sum_score < result[rescnt-1][1]){
				//do nothing
			}else if(result[rescnt-1] && sum_score == result[rescnt-1][1]){
				result.push([clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore]);//push to end
			}else{
				for (j=0;j<rescnt;j++){//compare with [j]
					if(!result[j] || sum_score > result[j][1]){
						if (result[rescnt-1]&&result[rescnt-2]){
							if (result[rescnt-1][1] == result[rescnt-2][1]){//insert into list
								for (k=result.length;k>j;k--){//lower others ranking
									result[k] = result[k-1];
								}
								//put current clothes to [j]
								result[j] = [clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore];
								break;
							}else{//create new list
								var result_orig=result;
								result=[];
								for(r=0;r<j;r++){
									result[r]=result_orig[r];
								}
								for (k=rescnt-1;k>j;k--){//lower others ranking
									result[k] = result_orig[k-1];
								}
								result[j]=[clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore];
								break;
							}
						}else if(rescnt==1){//create new list with only 1 element
							result=[];
							result[j] = [clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore];
						}else{
							for (k=rescnt-1;k>j;k--){//lower others ranking
								if(result[k-1]) {result[k] = result[k-1];}
							}
							//put current clothes to [j]
							result[j] = [clothes[i],sum_score,clothes[i].tmpScore,clothes[i].bonusScore];
							break;
						}
					}
				}
			}
		}
	}
	return result;
}

function compByTheme(){
	$('#topsearch_note').html('');
	var ajglz_out='';
	if ($('#showNormal').is(":checked")){
		var NM_output=[];
		for (var d in levelsRaw){
			theme_name='关卡: '+d;
			NM_output.push(compByThemeName(theme_name));
		}
		var tmp_c=outputByCate(NM_output);
		$('#topsearch_note').append('<p><b>主线关卡</b></p>');
		$('#topsearch_note').append(tmp_c+'<hr>');
		ajglz_out+='<a id="1"></a><p class="title2">主线关卡</p>\n'+tmp_c+'\n';
	}
	if ($('#showAlly').is(":checked")){
		var LM_output=[];
		for (var c in tasksRaw){
			theme_name=c;
			LM_output.push(compByThemeName(theme_name));
		}
		var tmp_b=outputByCate(LM_output);
		$('#topsearch_note').append('<p><b>联盟委托</b></p>');
		$('#topsearch_note').append(tmp_b+'<hr>');
		ajglz_out+='<a id="2"></a><p class="title2">联盟委托</p>\n'+tmp_b+'\n';
	}
	if ($('#showJJC').is(":checked")){
		var JJC_output=[];
		for (var b in competitionsRaw){
			theme_name='竞技场: '+b;
			JJC_output.push(compByThemeName(theme_name));
		}
		var tmp_a=outputByCate(JJC_output);
		$('#topsearch_note').append('<p><b>竞技场</b></p>');
		$('#topsearch_note').append(tmp_a+'<hr>');
		ajglz_out+='<a id="3"></a><p class="title2">竞技场</p>\n'+tmp_a+'\n';
	}
	$('#topsearch_note').css("margin-bottom",(parseInt($("#showCnt").val())+5)+"em");
	$('#ajglz_out').val(header()+ajglz_out+footer());
}

function compByThemeName(name){
	var sum_score=0;
	var sum_array=[]; //cate, diff, [new],[old]
	var rest=0;
	var new_tmp_array=[];
	var old_tmp_array=[];
	for (var c in storeTop[name]){
		//cate, [[clo,sumScore,tmpScore,bonusScore],[clo,sumScore,tmpScore,bonusScore]]
		if($.inArray(storeTop[name][c][0],['连衣裙','上装','下装'])>=0){ //handle them at last
			new_tmp_array[storeTop[name][c][0]]=(storeTop[name][c][1].length==0? [0,[]] : [storeTop[name][c][1][0][1],storeTop[name][c][1]]); //score, [result]
			old_tmp_array[storeTop[name][c][0]]=(storeTop_old[name][c][1].length==0? [0,[]] : [storeTop_old[name][c][1][0][1],storeTop_old[name][c][1]]);
			continue;
		}
		if(storeTop[name][c][1].length==0){continue;}
		if(storeTop_old[name][c][1].length==0){//dun have old score
			var diff=storeTop[name][c][1][0][1];
			sum_score+=diff; 
			sum_array.push([storeTop[name][c][0],diff,storeTop[name][c][1],[]]);
		}
		else if(storeTop[name][c][1][0][0]!=storeTop_old[name][c][1][0][0]){
			var diff=(storeTop[name][c][1][0][1]-storeTop_old[name][c][1][0][1]);
			diff=Math.round(diff*dp)/dp;
			sum_score+=diff;
			sum_array.push([storeTop[name][c][0],diff,storeTop[name][c][1],storeTop_old[name][c][1]]);
		}
		else if(storeTop[name][c][1][1]!=storeTop_old[name][c][1][1]){//score diff but same clothes
			var diff=(storeTop[name][c][1][0][1]-storeTop_old[name][c][1][0][1]);
			diff=Math.round(diff*dp)/dp;
			sum_score+=diff;
			rest+=diff;
		}
	}
	
	//handle dress vs top/bottom
	if(new_tmp_array['连衣裙'][0]>=new_tmp_array['上装'][0]+new_tmp_array['下装'][0]){
		var new_dress_score=new_tmp_array['连衣裙'][0];
		var new_dress_array=new_tmp_array['连衣裙'][1];
		var new_cate='连衣裙';
	}else{
		var new_dress_score=new_tmp_array['上装'][0]+new_tmp_array['下装'][0];
		var new_dress_array=new_tmp_array['上装'][1].concat(new_tmp_array['下装'][1]);
		var new_cate='上下装';
	}
	if(old_tmp_array['连衣裙'][0]>=old_tmp_array['上装'][0]+old_tmp_array['下装'][0]){
		var old_dress_score=old_tmp_array['连衣裙'][0];
		var old_dress_array=old_tmp_array['连衣裙'][1];
	}else{
		var old_dress_score=old_tmp_array['上装'][0]+old_tmp_array['下装'][0];
		var old_dress_array=old_tmp_array['上装'][1].concat(old_tmp_array['下装'][1]);
	}
	var diff=new_dress_score-old_dress_score;
	diff=Math.round(diff*dp)/dp;
	sum_score+=diff;
	if(new_dress_array[0][0]!=old_dress_array[0][0]) {sum_array.unshift([new_cate,diff,new_dress_array,old_dress_array]);}
	
	sum_score=Math.round(sum_score*dp)/dp;
	rest=Math.round(rest*dp)/dp;
	return [name,sum_score,sum_array,rest];
}

function outputByCate(total){
	var output='<table border="1">';
	output+=tr(td('关卡')+td('理论分差')+td('部位')+td('理论分差')+td('顶配'));
	total.sort(function(a,b){return b[1] - a[1]});
	for(var i in total){
		var name=total[i][0];
		var sum_score=total[i][1];
		var rowspan=total[i][2].length;
		var rest=total[i][3];
		if (rest!=0) {rowspan++;}
		if(rowspan){
			var outLine=td(name+'<br>'+tasksAddFt(name),'rowspan="'+rowspan+'"')+td(sum_score,'rowspan="'+rowspan+'"');
			for(var j in total[i][2]){
				var cate=total[i][2][j][0];
				var diff_score=total[i][2][j][1]; 
				if(cate=='上下装') {
					var new_res='';
					for(var k in total[i][2][j][2]){
						if(total[i][2][j][2][k][0].type.type=='上装') {new_res+=total[i][2][j][2][k][0].name;break;}
					}
					new_res+='<br>';
					for(var k in total[i][2][j][2]){
						if(total[i][2][j][2][k][0].type.type=='下装') {new_res+=total[i][2][j][2][k][0].name;break;}
					}
				}else {var new_res=total[i][2][j][2][0][0].name;}
				var tooltip='';
				for (var k in total[i][2][j][2]){
					tooltip+=total[i][2][j][2][k][1]+total[i][2][j][2][k][0].name+'\\n';
				}
				if(total[i][2][j][3]){ 
					tooltip+='==上一版本==\\n'
					for (var k in total[i][2][j][3]){//old result
						tooltip+=total[i][2][j][3][k][1]+total[i][2][j][3][k][0].name+'\\n';
					}
				}
				outLine+=td(cate)+td(diff_score)+td(addTooltip(new_res,tooltip));
				output+=tr(outLine, sum_score>0? '' : 'style="display:none;"');
				outLine='';
			}
			if (rest!=0) {output+=tr(td('极限权重变化')+td(rest)+td(''));}
		}
	}
	output+='</table>';
	return output;
}

function tasksAddFt(theme){
	if(tasksAdd[theme]) {return '(笑:'+mapFt(tasksAdd[theme][0],theme)+'/吻:'+mapFt(tasksAdd[theme][1],theme)+')';}
	return '';
}

function mapFt(ft,theme){
	switch(ft){
		case 'simple':
			if(theme.indexOf('联盟委托')==0) {var ftNm=tasksRaw[theme][0];}
			else if(theme.indexOf('关卡')==0) {var ftNm=levelsRaw[theme.replace('关卡: ','')][0];}
			else {return '-';}
			if(ftNm>0){return '简';}
			else{return '华';}
		case 'cute':
			if(theme.indexOf('联盟委托')==0) {var ftNm=tasksRaw[theme][1];}
			else if(theme.indexOf('关卡')==0) {var ftNm=levelsRaw[theme.replace('关卡: ','')][1];}
			else {return '-';}
			if(ftNm>0){return '可';}
			else{return '成';}
		case 'active':
			if(theme.indexOf('联盟委托')==0) {var ftNm=tasksRaw[theme][2];}
			else if(theme.indexOf('关卡')==0) {var ftNm=levelsRaw[theme.replace('关卡: ','')][2];}
			else {return '-';}
			if(ftNm>0){return '活';}
			else{return '雅';}
		case 'pure':
			if(theme.indexOf('联盟委托')==0) {var ftNm=tasksRaw[theme][3];}
			else if(theme.indexOf('关卡')==0) {var ftNm=levelsRaw[theme.replace('关卡: ','')][3];}
			else {return '-';}
			if(ftNm>0){return '纯';}
			else{return '性';}
		case 'cool':
			if(theme.indexOf('联盟委托')==0) {var ftNm=tasksRaw[theme][4];}
			else if(theme.indexOf('关卡')==0) {var ftNm=levelsRaw[theme.replace('关卡: ','')][4];}
			else {return '-';}
			if(ftNm>0){return '凉';}
			else{return '暖';}
		default:
			return '-';
	}
}

function chgStaffMode(){
	if ($('#staffMode').is(":checked")){
		$('#staffModeOn').show();
		$('#topsearch_note').hide();
	}else{
		$('#staffModeOn').hide();
		$('#topsearch_note').show();
	}
}

function verify(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		$("#p_passcode").hide();
		$("#p_content").show();
	}
}

function init_passcode(){
	$('#passcode').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			verify();
		}
	});
}

function header(){
 var h='<!DOCTYPE html>\n';
	h+='<head>\n';
	h+='<meta name="viewport" content="width=device-width, initial-scale=1"/>\n';
	h+='<meta http-equiv="Content-Type" content="text/html"; charset=utf-8" />\n';
	h+='<link rel="stylesheet" type="text/css" href="../../css/style.css" />\n';
	h+='<link rel="stylesheet" type="text/css" href="dp-style.css" />\n';
	h+='<script type="text/javascript" src="dp.js"></script>\n';
	h+='<style> td{padding-left:0.5em;padding-right:0.5em;} table{width:100%} </style>\n';
	h+='</head>\n';
	h+='<body>\n';
	h+='<div class="myframe">\n';
	h+='<p class="title1">顶配分析-关卡极限分数更新</p>\n';
	h+='<hr class="mhr"/>\n';
	h+='<p class="normal">\n';
	h+='<span class="title3">更新时间：</span>';
	var d=new Date();
	h+=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	h+='<br>\n';
	h+='<span class="title3">更新人员：</span>Rean翎<br>\n';
	h+='<span class="title3">包含版本：</span>'+$('#textBox').html()+'<br>\n';
	h+='<span class="title3">使用说明：</span>分差根据上一版本和此版本的极限顶配分数计算（使用小黑配装器，饰品分数已按带满衰减），方便查看哪些关卡分数更新最多，仅作为参考用。<br>\n';
	h+='</p>\n';
	h+='<hr class="mhr"/>\n';
	h+='<p class="normal">本页内容：';
	if($('#showNormal').is(":checked")) {h+='&emsp;<a href="#1">主线关卡</a>'};
	if($('#showAlly').is(":checked")) {h+='&emsp;<a href="#2">联盟委托</a>'};
	if($('#showJJC').is(":checked")) {h+='&emsp;<a href="#3">竞技场</a>'};
	h+='</p>\n';
	return h;
}

function footer(){
	return '</div></body></html>';
}

//below from top.js

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function addTooltip(text,tooltip){
	return '<a class="cTip" tooltip="'+tooltip+'">'+text+'</a>';
}

function getDistinct(arr){
	var newArr=[];
	for (var i in arr){
		var ind=0;
		for (var j in newArr){
			if (arr[i]==newArr[j]) {ind=1;}
		}
		if(ind==0) {newArr.push(arr[i])};
	}
	return newArr;
}

//below modified from nikki.js

function onChangeCriteria(limitMode) {
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
		//rean mod
		if(limitMode&&limitMode==1){
			if(tasksAdd[theme_name]){
				if (f==tasksAdd[theme_name][0]) {weight=weight*1.27;}
				if (f==tasksAdd[theme_name][1]) {weight=weight*1.778;}
			}
		}
		if(limitMode&&limitMode==2){
			if(tasksAdd_old[theme_name]){
				if (f==tasksAdd_old[theme_name][0]) {weight=weight*1.27;}
				if (f==tasksAdd_old[theme_name][1]) {weight=weight*1.778;}
			}
		}
		/*if (uiFilter["highscore"]) {
			var highscore1 = $('#' + f + "1d778.active").length ? 1.778 : 1;
			var highscore2 = $('#' + f + "1d27.active").length ? 1.27 : 1;
			weight = accMul(accMul(weight, highscore1), highscore2);
		}*/
		var checked = $('input[name=' + f + ']:radio:checked');
		if (checked.length) {
			criteria[f] = parseInt(checked.val()) * weight;
		}
	}
	tagToBonus(criteria, 'tag1');
	tagToBonus(criteria, 'tag2');
	if (global.additionalBonus && global.additionalBonus.length > 0) {
		criteria.bonus = global.additionalBonus;
	}
	criteria.levelName = theme_name;
}

//below duplicated from nikki.js

var criteria = {};

function accMul(arg1, arg2) {
	var m = 0,
	s1 = arg1.toString(),
	s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function tagToBonus(criteria, id) {
	var tag = $('#' + id).val();
	var bonus = null;
	if (tag.length > 0) {
		var base = $('#' + id + 'base :selected').text();
		var weight = parseFloat($('#' + id + 'weight').val());
		if ($('input[name=' + id + 'method]:radio:checked').val() == 'replace') {
			bonus = replaceScoreBonusFactory(base, weight, tag)(criteria);
		} else {
			bonus = addScoreBonusFactory(base, weight, tag)(criteria);
		}
		if (!criteria.bonus) {
			criteria.bonus = [];
		}
		criteria.bonus.push(bonus);
	}
}

function clearTag(id) {
	$('#' + id).val('');
	$('#' + id + 'base').val('SS');
	$('#' + id + 'weight').val('1');
	$($('input[name=' + id + 'method]:radio').get(0)).prop("checked", true);
	$($('input[name=' + id + 'method]:radio').get(0)).parent().addClass("active");
	$($('input[name=' + id + 'method]:radio').get(1)).parent().removeClass("active");
}

function bonusToTag(idx, info) {
	$('#tag' + idx).val(info.tag);
	if (info.replace) {
		$($('input[name=tag' + idx + 'method]:radio').get(1)).prop("checked", true);
		$($('input[name=tag' + idx + 'method]:radio').get(1)).parent().addClass("active");
		$($('input[name=tag' + idx + 'method]:radio').get(0)).parent().removeClass("active");
	} else {
		$($('input[name=tag' + idx + 'method]:radio').get(0)).prop("checked", true);
		$($('input[name=tag' + idx + 'method]:radio').get(0)).parent().addClass("active");
	}
	$('#tag' + idx + 'base').val(info.base);
	$('#tag' + idx + 'weight').val(info.weight);
}

var uiFilter = {};
function onChangeUiFilter() {
	uiFilter = {};
	$('.fliter:checked').each(function () {
		uiFilter[$(this).val()] = true;
	});

	if (currentCategory) {
		if (CATEGORY_HIERARCHY[currentCategory].length > 1) {
			$('input[name=category-' + currentCategory + ']:checked').each(function () {
				uiFilter[$(this).val()] = true;
			});
		} else {
			uiFilter[currentCategory] = true;
		}
	}
	refreshTable();
}

function setFilters(level) {
	currentLevel = level;
	global.additionalBonus = currentLevel.additionalBonus;
	var weights = level.weight;
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = weights[f];
		/*if (uiFilter["balance"]) {
			if (weight > 0) {
				weight = 1;
			} else if (weight < 0) {
				weight = -1;
			}
		}*/
		$('#' + f + 'Weight').val(Math.abs(weight));
		var radios = $('input[name=' + f + ']:radio');
		for (var j = 0; j < radios.length; j++) {
			var element = $(radios[j]);
			if (parseInt(element.attr("value")) * weight > 0) {
				element.prop("checked", true);
				element.parent().addClass("active");
			} else if (element.parent()) {
				element.parent().removeClass("active");
			}
		}
	}
	clearTag('tag1');
	clearTag('tag2');
	if (level.bonus) {
		for (var i in level.bonus) {
			bonusToTag(parseInt(i) + 1, level.bonus[i]);
		}
	}
}
