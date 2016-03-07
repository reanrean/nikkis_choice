$(document).ready(function () {
	enterKey();
	$("#showCnt").val(5);
});

var top_id='';
var showCnt;
var inTop=[];
var inSec=[];
var inOth=[];

function searchById(){
	top_id='';
	var searchById=$("#textBox").val();
	if(searchById.indexOf(': ')>-1) {
		searchById=searchById.substr(searchById.indexOf(': ')+2);
		$("#textBox").val(searchById);
	}	
	var searchById_match=0;
	if(searchById){
		var out='<table border="1">';
		out+=tr(td('名称')+td('分类')+td('编号')+td('来源'),'style="font-weight:bold;"');
		for (var c in category){//sort by category
			for (var i in clothes){
				if( (clothes[i].name.indexOf(searchById)>-1||parseInt(clothes[i].id)==parseInt(searchById)) 
					&& clothes[i].type.type==category[c]){
					var line=td(ahref(clothes[i].name,'choose_topid('+i+')'));
						line+=td(clothes[i].type.type);
						line+=td(clothes[i].id);
						line+=td(clothes[i].source);
					out+=tr(line);
					searchById_match=1;
				}
			}
		}
	out+='</table>';
	}
	if(searchById_match) {$('#topsearch_info').html(out);}
	else {$("#topsearch_info").html('没有找到相关资料');}
}

function choose_topid(id){
	top_id=id;
	$('#textBox').val(clothes[id].type.mainType+': '+clothes[id].name);
}

function calctop(){
	if (!top_id) {
		$('#alert_msg').html('请选择一件衣服！');
	}else{
		$('#alert_msg').html('');
		showCnt=$("#showCnt").val();
		calctop_byid(top_id);
	}
}

function calctop_byid(id){
	inTop=[];inSec=[];inOth=[];
	$('#topsearch_info').html('');
	
	for (var b in competitionsRaw){
		var theme_name='竞技场: '+b;
		if (allThemes[theme_name]) {
			setFilters(allThemes[theme_name]);
			calctop_bytheme(id,theme_name);
		}
	}
	
	for (var c in tasksRaw){
		var theme_name=c;
		if (allThemes[theme_name]) {
			setFilters(allThemes[theme_name]);
			calctop_bytheme(id,theme_name);
		}
	}
	if ($('#showNormal').is(":checked")){
		for (var d in levelsRaw){
			var theme_name='关卡: '+d;
			if (allThemes[theme_name]) {
				setFilters(allThemes[theme_name]);
				calctop_bytheme(id,theme_name);
			}
		}
	}
	
	var output='<b>'+clothes[id].name+'</b><br>';
	var cell='';
		if(clothes[id].simple[0]) cell+='简约'+clothes[id].simple[0];
		if(clothes[id].simple[1]) cell+='华丽'+clothes[id].simple[1];
		if(clothes[id].active[0]) cell+='&ensp;活泼'+clothes[id].active[0];
		if(clothes[id].active[1]) cell+='&ensp;优雅'+clothes[id].active[1];
		if(clothes[id].cute[0]) cell+='&ensp;可爱'+clothes[id].cute[0];
		if(clothes[id].cute[1]) cell+='&ensp;成熟'+clothes[id].cute[1];
		if(clothes[id].pure[0]) cell+='&ensp;清纯'+clothes[id].pure[0];
		if(clothes[id].pure[1]) cell+='&ensp;性感'+clothes[id].pure[1];
		if(clothes[id].cool[0]) cell+='&ensp;清凉'+clothes[id].cool[0];
		if(clothes[id].cool[1]) cell+='&ensp;保暖'+clothes[id].cool[1];
		if(clothes[id].tags[0]) {
			for (var tg in clothes[id].tags){
				cell+=clothes[id].tags[tg];
			}
		}
	output+=cell+'<br><br>';
	if(inTop.length>0){
		output+='顶配：<br>';
		for (var s in inTop){
			output+='&emsp;'+inTop[s]+'<br>';
		}
	}
	if(inSec.length>0){
		output+='次配：<br>';
		for (var t in inSec){
			output+='&emsp;'+inSec[t]+'<br>';
		}
	}
	if(inOth.length>0){
		output+='高配：<br>';
		for (var u in inOth){
			output+='&emsp;'+inOth[u][0]+'(第'+inOth[u][1]+')<br>';
		}
	}
	if(inTop.length==0 && inSec.length==0 && inOth.length==0){
		output+='沒有顶配/高配信息';
	}
	$('#topsearch_info').html(output);
}

function calctop_bytheme(id,them){
	onChangeCriteria();
	
	var resultList = getTopCloByCate(criteria, showCnt, clothes[id].type.type, id);
	if(jQuery.inArray(clothes[id], resultList)>-1){
		if(clothes[id]==resultList[0]) {
			inTop.push(them);
		}else if(clothes[id]==resultList[1]) {
			inSec.push(them);
		}else{
			for (r=2;r<resultList.length;r++){
				if(clothes[id]==resultList[r]){
					inOth.push([them,r+1]);
					break;
				}
			}
		}
	}
}

function getTopCloByCate(filters,rescnt,type,id){
	var result = [];
	for (var i in clothes) {
		if (clothes[i].type.type!=type){continue;}//skip other categories
		clothes[i].calc(filters);
		if (!result[0]) {
			result[0] = clothes[i];
		} else {
			for (j=0;j<rescnt;j++){//compare with [j]
				if(!result[j] || clothes[i].sumScore > result[j].sumScore
					|| (clothes[i].sumScore >= result[j].sumScore && i==id)){
					//lower others ranking
					for (k=rescnt-1;k>j;k--){
						result[k] = result[k-1];
					}
					//put current clothes to [j]
					result[j] = clothes[i];
					break;
				}
			}
		}
	}
	return result;
}

function test_sortlist(clothes,filters,rescnt,type){
	var result = {};
	for (var i in clothes) {
		if (clothes[i].type.type!=type){continue;}
		clothes[i].calc(filters);
			if (!result[clothes[i].type.type]) {
				result[clothes[i].type.type] = new Object()
				result[clothes[i].type.type][0] = clothes[i];
			} else {
				for (j=0;j<rescnt;j++){
					//compare with [j]
					if(!result[clothes[i].type.type][j] || clothes[i].sumScore > result[clothes[i].type.type][j].sumScore
						|| (clothes[i].sumScore >= result[clothes[i].type.type][j].sumScore && i==id)
						){
						//lower others ranking
						for (k=rescnt-1;k>j;k--){
							result[clothes[i].type.type][k] = result[clothes[i].type.type][k-1];
						}
						//put current clothes to [j]
						result[clothes[i].type.type][j] = clothes[i];
						break;
					}
				}
		}
	}
	return result;
}

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}

function enterKey() {
	$('#textBox').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			searchById();
		}
	});
}

//below is modified from nikki.js
function onChangeCriteria() {
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
		if (uiFilter["highscore"]) {
			var highscore1 = $('#' + f + "1d778.active").length ? 1.778 : 1;
			var highscore2 = $('#' + f + "1d27.active").length ? 1.27 : 1;
			weight = accMul(accMul(weight, highscore1), highscore2);
		}
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
}

//below is duplicated from nikki.js
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
		if (uiFilter["balance"]) {
			if (weight > 0) {
				weight = 1;
			} else if (weight < 0) {
				weight = -1;
			}
		}
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
