 $(document).ready(function () {
	init_top_update();
});

function init_top_update(){
	var tmp='';
	for(var v in lastVersion){
		tmp+=lastVersion[v];
	}
	$('#textBox').val(tmp);
	//alert(wardrobe.length+' '+wardrobe_old.length+' '+lastVersion_id.length);
}

var theme_name; //no need global?
var storeTop=[];
var storeTop_old=[];
var compTop=[];
var limitMode=0;

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

var lastVersion_cate=function() {
	var ret = [];
	for (var i in clothes) {
		if ($.inArray(i,lastVersion_id)>-1){
			ret.push(clothes[i].type.type);
		}
	}
	ret=getDistinct(ret);
	return ret;
}();

function calctopupd(){
	storeTopByCate();
	//compByTheme();
	//alert('end');
	//compByThemeName('竞技场: 奇幻童话园');
	alert(compByThemeName('关卡: 10-6'));
}

function storeTopByCate(){
	for (var cate in lastVersion_cate){
		if ($('#showJJC').is(":checked")){
			for (var b in competitionsRaw){
				theme_name='竞技场: '+b;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],0)]);
					storeTop_old[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],1)]);
				}
			}
		}
		if ($('#showAlly').is(":checked")){
			for (var c in tasksRaw){
				theme_name=c;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],0)]);
					storeTop_old[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],1)]);
				}
			}
		}
		if ($('#showNormal').is(":checked")){
			for (var d in levelsRaw){
				theme_name='关卡: '+d;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[]; storeTop_old[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],0)]);
					storeTop_old[theme_name].push([lastVersion_cate[cate],getTopCloByCate(criteria,lastVersion_cate[cate],1)]);
				}
			}
		}
	}
}

function getTopCloByCate(filters,type,old){
	var result = [];
	for (var i in clothes) {
		if (clothes[i].type.type!=type){continue;}//skip other categories
		if (old>0&&$.inArray(i,lastVersion_id)>-1) {continue;}
		clothes[i].calc(filters);
		if (clothes[i].isF) {continue;}
		if (!result[0]) {
			result[0] = [clothes[i],clothes[i].sumScore,clothes[i].tmpScore,clothes[i].bonusScore];
		}else {
			if(clothes[i].sumScore==result[0][1]){
				result.push([clothes[i],clothes[i].sumScore,clothes[i].tmpScore,clothes[i].bonusScore]);//push to end
			}else if(clothes[i].sumScore > result[0][0].sumScore){
				result=[];//create a new list
				result[0]= [clothes[i],clothes[i].sumScore,clothes[i].tmpScore,clothes[i].bonusScore];
			}
		}
	}
	return result;
	//bonusScore - tag score
}

function compByTheme(){
	if ($('#showJJC').is(":checked")){
		for (var b in competitionsRaw){
			theme_name='竞技场: '+b;
			compByThemeName(theme_name);
		}
	}
}

function compByThemeName(name){
	var sum_score=0;
	for (var c in storeTop[name]){
		//alert(storeTop[name][c]);
		//cate, [[clo,sumScore,tmpScore,bonusScore],[clo,sumScore,tmpScore,bonusScore]]
		if(storeTop[name][c][1].length==0){continue;}
		if(storeTop[name][c][1][0][0]!=storeTop_old[name][c][1][0][0]){
			if(storeTop[name][c][0].indexOf('饰品')==0) {//tmpScore*0.4
				sum_score+=(storeTop[name][c][1][0][2]-storeTop_old[name][c][1][0][2])*0.4+(storeTop[name][c][1][0][3]-storeTop_old[name][c][1][0][3]);
			}else{
				sum_score+=(storeTop[name][c][1][0][1]-storeTop_old[name][c][1][0][1]);
			}
		}
	}
	return sum_score;
}

//below from top.js

function getDistinct(arr){//don't know why the concise method doesn't work...
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

function onChangeCriteria() {
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
		//rean mod
		if(limitMode==1){
			for (var level in tasksAdd){
				if (theme_name==tasksAdd[level][0]){
					if (f==tasksAdd[level][1]) {weight=weight*1.27;}
					if (f==tasksAdd[level][2]) {weight=weight*1.778;}
				}
			}
		}
		if(limitMode==2){
			for (var level in tasksAdd_old){
				if (theme_name==tasksAdd_old[level][0]){
					if (f==tasksAdd_old[level][1]) {weight=weight*1.27;}
					if (f==tasksAdd_old[level][2]) {weight=weight*1.778;}
				}
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
