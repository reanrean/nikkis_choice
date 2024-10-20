var limitRet = 15; //maximum return when search by keywords
var limitTag = 7; //maximum return when search by tag
var limitTagRet = 5; //maximum return when search by each tag each type
var lanSteps = 5;
var lackClothes = []; //array of longid
var allScores = {};
var suitSet = {};
var wordSet = {};
var tagSet = {};
var lazyKeywords = {};
var lazySetScore = [];
var lanOwn;

function lanStrategy_init(){
	//gen all suitSet that user have
	//note: if apply to seal100x, need to exclude those with "染","套"
	suitSet = {};
	for (var i in clothes) {
		if (!clothes[i].set) continue;
		var setName = clothes[i].set;
		var type = clothes[i].type.type;
		
		if (suitSet[setName] == null){
			suitSet[setName] = {};
			suitSet[setName]['name'] = '套装·'+setName;
			suitSet[setName]['clothes'] = {};
			suitSet[setName]['acc'] = {};
			suitSet[setName]['missing'] = false;
		}
		if (!lanOwnChk(clothes[i],lanOwn)) suitSet[setName]['missing'] = true;
		if (isAcc(clothes[i])) {
			if (!suitSet[setName]['acc'][type]) suitSet[setName]['acc'][type] = {};
			suitSet[setName]['acc'][type]['0'] = clothes[i];
		}else suitSet[setName]['clothes'][type] = clothes[i];
	}
	
	//gen all wordSet
	wordSet = {};
	for (var i in clothes){
		var name = clothes[i].name;
		var type = clothes[i].type.type;
		var matchStr = [];
		for (j=0; j<name.length; j++){ //get name string
			for (k=1; k<=2; k++){
				if (j > name.length-k) continue;
				var str = name.substr(j, k);
				if ($.inArray(str,matchStr)<0) matchStr.push(str);
				else continue;
				if (wordSet[str] == null){
					wordSet[str] = {};
					wordSet[str]['name'] = str;
					wordSet[str]['clothes'] = {};
					wordSet[str]['acc'] = {};
					wordSet[str]['rawScore'] = {};
					wordSet[str]['rawSumScore'] = 0;
					wordSet[str]['count'] = 0;
				}
				wordSet[str]['count'] += 1;
				
				if (!lanOwnChk(clothes[i], lanOwn)) continue;
				if (clothes[i].isF) continue;
				var sumScore = Math.round(clothes[i].sumScore);
				var tmpScore = Math.round(clothes[i].tmpScore);
				var bonus = Math.round(clothes[i].bonusScore).toString();
				if (isAcc_c(type)){
					if (wordSet[str]['acc'][type] == null) 
						wordSet[str]['acc'][type] = {};
					if (wordSet[str]['acc'][type][bonus] == null) 
						wordSet[str]['acc'][type][bonus] = clothes[i];
					else if (tmpScore > wordSet[str]['acc'][type][bonus].tmpScore) 
						wordSet[str]['acc'][type][bonus] = clothes[i];
				}else{
					if (wordSet[str]['clothes'][type] == null) 
						wordSet[str]['clothes'][type] = clothes[i];
					else if (sumScore > wordSet[str]['clothes'][type].sumScore) 
						wordSet[str]['clothes'][type] = clothes[i];
				}
				if (wordSet[str]['rawScore'][type] == null) {
					wordSet[str]['rawScore'][type] = sumScore;
					wordSet[str]['rawSumScore'] += sumScore;
				}else if (sumScore > wordSet[str]['rawScore'][type]) {
					wordSet[str]['rawSumScore'] += (sumScore - wordSet[str]['rawScore'][type]);
					wordSet[str]['rawScore'][type] = sumScore;
				}
			}
		}
	}
	for (var i in wordSet){//remove keywords with too many returns or no scores
		if (i.indexOf("·")>=0 || wordSet[i]['count'] > limitRet || wordSet[i]['rawSumScore']<1) 
			delete wordSet[i];
	}
	
	//gen all tagCate
	tagSet = {};
	for (var i in clothes){
		if (!lanOwnChk(clothes[i], lanOwn)) continue;
		if (clothes[i].isF) continue;
		var mainType = clothes[i].type.mainType;
		var type = clothes[i].type.type;
		var tags = clothes[i].tags;
		for (var j in tags){
			if (!tags[j]) continue;
			if (tags[j].indexOf('+')>=0) continue; //skip 萤光之灵
			tagCate = 'tag:' + tags[j];
			if (tagSet[tagCate] == null){
				tagSet[tagCate] = {};
				tagSet[tagCate]['name'] = tagCate;
				tagSet[tagCate]['clothes'] = {};
				tagSet[tagCate]['acc'] = {};
				tagSet[tagCate]['typeCount'] = {};
				tagSet[tagCate]['count'] = 0;
			}
			var sumScore = Math.round(clothes[i].sumScore);
			var tmpScore = Math.round(clothes[i].tmpScore);
			var bonus = Math.round(clothes[i].bonusScore).toString();
			if (isAcc_c(type)){
				if (tagSet[tagCate]['acc'][type] == null) 
					tagSet[tagCate]['acc'][type] = {};
				if (tagSet[tagCate]['acc'][type][bonus] == null) 
					tagSet[tagCate]['acc'][type][bonus] = clothes[i];
				else if (tmpScore > tagSet[tagCate]['acc'][type][bonus].tmpScore) 
					tagSet[tagCate]['acc'][type][bonus] = clothes[i];
			}else{
				if (tagSet[tagCate]['clothes'][type] == null) 
					tagSet[tagCate]['clothes'][type] = clothes[i];
				else if (sumScore > tagSet[tagCate]['clothes'][type].sumScore) 
					tagSet[tagCate]['clothes'][type] = clothes[i];
			}
			
			if (tagSet[tagCate]['typeCount'][type] == null) tagSet[tagCate]['typeCount'][type] = 0;
			tagSet[tagCate]['typeCount'][type] += 1;
			tagSet[tagCate]['count'] += 1;
		}
	}
	for (var i in tagSet){//remove keywords with too many returns
		for (var j in tagSet[i]['typeCount']){
			if (tagSet[i]['typeCount'][j] > limitTagRet){
				tagSet[tagCate]['count'] -= tagSet[i]['typeCount'][j];
				delete tagSet[i]['clothes'][j];
				delete tagSet[i]['acc'][j];
			}
		}
	}
}

function lanStrategy(){
	//handle as full wardrobe when no clothes owned
	lanOwn = loadFromStorage().size>0 ? 1 : 0; 
	
	//calculate all clothes
	allScores = {};
	for (var i in clothes) {//calc each clothes, put to allScores[type], and sort
		//if (lanOwnChk(clothes[i], lanOwn)) {
			clothes[i].calc(criteria);
			if (clothes[i].isF) continue;
			if (!allScores[clothes[i].type.type]) allScores[clothes[i].type.type] = [];
			allScores[clothes[i].type.type].push(clothes[i]);
		//}
	}
	for (var i in allScores) allScores[i].sort(function(a,b){return isAccSumScore(b) - isAccSumScore(a);});
	
	lanStrategy_init();
	lanStrategy_recalc(1);
}

function lanStrategy_recalc(n){
	var step = n - 1;
	var lazySet = {}; 
	lazySetScore.splice(step,9999);
	var ii = 0;
	for (var i in lazyKeywords){
		if (ii>=step) delete lazyKeywords[i];
		else for (var type in lazyKeywords[i]) lazySet[type] = lazyKeywords[i][type];
		ii++;
	}
	if (step==0){
		var evalSuitSet = evalSets(suitSet); 
		var suitArray = [];
		for (var i in evalSuitSet) if (!evalSuitSet[i]['missing']&&$.inArray(i,lackClothes)<0) suitArray.push(evalSuitSet[i]);
		suitArray.sort(function(a,b){return  b["score"] - a["score"];});
		if (suitArray.length){//put suitArray[0] to lazySet
			lazyKeywords[suitArray[0]['name']] = {};
			for (var i in suitArray[0]['result']){
				var cl = suitArray[0]['result'][i];
				var type = cl.type.type;
				lazyKeywords[suitArray[0]['name']][type] = cl;
				lazySet[type] = cl;
			}
			lazySetScore.push(getLazySetScore(lazySet));
			step += 1;
		}
	}
	for (var step=step; step<lanSteps; step++){
		//loop to search keywords with value add, put into lazySet
		var wordArray = [];
		var evalWordSet = evalSets(wordSet,lazySet);
		for (var i in evalWordSet) wordArray.push(evalWordSet[i]);
		var evalTagSet = evalSets(tagSet,lazySet);
		for (var i in evalTagSet) wordArray.push(evalTagSet[i]);
		wordArray.sort(function(a,b){return  b["score"]==a["score"] ? a["count"]-b["count"] : b["score"]-a["score"];});
		if (wordArray.length){//put wordArray[0] to lazySet
			lazyKeywords[wordArray[0]['name']] = {};
			for (var i in wordArray[0]['result']){
				var cl = wordArray[0]['result'][i];
				var type = cl.type.type;
				lazyKeywords[wordArray[0]['name']][type] = cl;
				for (var j in repelCates){ //check repelCates before push into lazySet
					if (type==repelCates[j][0]) {
						for (k=1; k<repelCates[j].length; k++) if (lazySet[repelCates[j][k]]) delete lazySet[repelCates[j][k]];
					}else if ($.inArray(type,repelCates[j])>0) {
						if (lazySet[repelCates[j][0]]) delete lazySet[repelCates[j][0]];
					}
				}
				lazySet[type] = cl;
			}
			lazySetScore.push(getLazySetScore(lazySet));
		}
	}
	lanStrategy_print(lazySet);
}

function lanStrategy_print(lazySet){
	var themeName = $("#theme").val();
	
	//check whether missing whitelist category at last
	var whiteType = []; var whiteExtra = {}; var whiteTodo = [];
	if (Flist&&Flist[themeName]&&Flist[themeName]["type"]){
		whiteType = Flist[themeName]["type"];
		for (var i in whiteType){
			var type = whiteType[i];
			if (lazySet[type]&&!lazySet[type].isF) continue; //lazySet already contains
			else if (allScores[type]) {//own, alert name
				var ownType = false;
				for (var j in allScores[type]){
					if (lanOwnChk(allScores[type][j], lanOwn)){
						whiteExtra[allScores[type][j].type.type] = allScores[type][j]; 
						ownType = true;
						break;
					}
				}
				if (!ownType) whiteTodo.push(type); //not own, alert to create
			}
			//else whiteTodo.push(type); //not own, alert to create
			//upd170830: disable this as whiteType without available clothes will not be displayed
		}
	}
	
	//check spRange items
	if(Flist && Flist[themeName] && Flist[themeName]["range"]){
		
		//if lazySet already contains, do nothing
		var containing = 0;
		for (var type in lazySet){
			if (lazySet[type].spRange) {
				containing = 1;
				break;
			}
		}
		
		//get most diffScore for own and not own respectively
		if (!containing){
			var ownType = false; 
			var diffScore_own = getLazySetScore(lazySet) * (-1); var extra_own = new Object();
			var diffScore_oth = diffScore_own; var extra_oth = new Object();
			for (var type in allScores){
				for (var j in allScores[type]){
					if (allScores[type][j].spRange) {
						var diff = diffScore_lan(allScores[type][j], lazySet);
						if (lanOwnChk(allScores[type][j], lanOwn)){
							if (diff > diffScore_own){
								var diffScore_own = diff;
								extra_own = allScores[type][j];
							}
						}else {
							if (diff > diffScore_oth){
								var diffScore_oth = diff;
								extra_oth = allScores[type][j];
							}
						}
						break;
					}
				}
			}
			if (!($.isEmptyObject(extra_own))) whiteExtra[extra_own.type.type] = extra_own; 
			else whiteTodo.push('必带(如:'+extra_oth.name+')');
		}
	}
	
	//remove whiteTodo elements if corresponding repelCates already have (not in whiteType)
	//upd170830: disable this as whiteType without available clothes will not be displayed
	/*for (var i in repelCates){
		if ($.inArray(repelCates[i][0],whiteTodo)>=0) {//check others, if no others, remove [0]
			var rm = true;
			for (var k in repelCates[i]){
				if (k==0) continue;
				if ($.inArray(repelCates[i][k],whiteTodo)>=0) rm = false;
			}
			if (rm) removeFromArray(repelCates[i][0],whiteTodo);
		}
		for (var j in repelCates[i]) {//check [0], if no [0] can remove it
			if (j==0) continue;
			if ($.inArray(repelCates[i][0],whiteTodo)<0) removeFromArray(repelCates[i][j],whiteTodo);
		}
		var whiteTodoTmp = [];//group repelCates tgt
		for (var l in repelCates[i]){
			if ($.inArray(repelCates[i][l],whiteTodo)>=0) {
				whiteTodoTmp.push(repelCates[i][l]);
				removeFromArray(repelCates[i][l],whiteTodo);
			}
		}
		if (whiteTodoTmp.length) whiteTodo.push(whiteTodoTmp.join('/'));
	}*/
	
	//if other parts in lazySet isF, alert to take down
	var takeDown = [];
	for (var i in lazySet){
		if ($.inArray(i,whiteType)>=0) continue;
		else if (lazySet[i].isF) takeDown.push(listCateName(lazySet[i]));
	}
	
	//write result
	var $strategy = $("<div/>").addClass("strategy_info_div");
	
	var $title = p($("#theme").val() == "custom" ? "....." : $("#theme").val(),"title");
	$strategy.append($title);
	
	var $author = p("偷懒攻略·"+(lanOwn||lackClothes.length?'个人':'全')+"衣柜版@Rean测试版", "author");
	$strategy.append($author);
	
	var $criteria_title = p("属性-权重: ", "criteria_title");
	$strategy.append($criteria_title);
	var $criteria = p(getStrCriteria(criteria),"criteria");
	$strategy.append($criteria);
	var $tag = p(getstrTag(criteria), "tag");
	$strategy.append($tag);
	
	var $option = p("选项: ", "criteria_title");
	$strategy.append($option);
	
	var $optionContent1 = $("<p/>");
	$optionContent1.append("展示<span id='lanSteps'>"+lanSteps+"</span>个步骤");
	$optionContent1.append('<button class="btn btn-xs btn-default" onclick="add_lanSteps()">＋</button>');
	$optionContent1.append('<button class="btn btn-xs btn-default" onclick="min_lanSteps()">－</button>');
	$strategy.append($optionContent1);
	var $optionContent2 = $("<p/>");
	$optionContent2.append("每关键字≤<span id='limitRet'>"+limitRet+"</span>件衣服");
	$optionContent2.append('<button class="btn btn-xs btn-default" onclick="add_limitRet()">＋</button>');
	$optionContent2.append('<button class="btn btn-xs btn-default" onclick="min_limitRet()">－</button>');
	$strategy.append($optionContent2);
	var $optionContent3 = $("<p/>");
	$optionContent3.append("每tag≤<span id='limitTag'>"+limitTag+"</span>个部位");
	$optionContent3.append('<button class="btn btn-xs btn-default" onclick="add_limitTag()">＋</button>');
	$optionContent3.append('<button class="btn btn-xs btn-default" onclick="min_limitTag()">－</button>');
	$strategy.append($optionContent3);
	var $optionContent4 = $("<p/>");
	$optionContent4.append("每tag每部位≤<span id='limitTagRet'>"+limitTagRet+"</span>件衣服");
	$optionContent4.append('<button class="btn btn-xs btn-default" onclick="add_limitTagRet()">＋</button>');
	$optionContent4.append('<button class="btn btn-xs btn-default" onclick="min_limitTagRet()">－</button>');
	$strategy.append($optionContent4);
	
	var clotheslist_title = $("<p/>");
	clotheslist_title.append(pspan("偷懒步骤: ", "clotheslist_title"));
	if (!lanOwn) clotheslist_title.append('<span id="stgy_save_lackClothes"><a id="stgy_add_lackClothes" data-tmp="点击尚缺衣服以删除" href="#" onclick="return false;">没有这些衣服?</a> <a id="stgy_reset_lackClothes" href="#" onclick="return false;" style="display:none;">还原</a></span>');
	$strategy.append(clotheslist_title);
	
	var ii = 1; 
	for (var i in lazyKeywords){
		var categoryContent = $("<p/>");
		categoryContent.attr('id','step-'+ii);
		
		if (i.indexOf('套装·')>=0) categoryContent.append(pspan_id(ii+'. '+i+" ", "clothes_category stgy_clothes",i.replace('套装·','')));
		else categoryContent.append(pspan(ii+'. 【' + i + '】'+" ", "clothes_category"));
		
		if (i.indexOf('套装·')!=0) {
			for (var c in category){ //sort by category
				if (lazyKeywords[i][category[c]]) {
					if (i.indexOf('tag:')>=0) {
						var type = category[c].substr(Math.max(category[c].indexOf('-'),category[c].indexOf('·'))+1);
						categoryContent.append(pspan_id('('+type+')'+lazyKeywords[i][category[c]].name,"clothes",lazyKeywords[i][category[c]].longid));
					}else categoryContent.append(pspan_id(lazyKeywords[i][category[c]].name,"clothes",lazyKeywords[i][category[c]].longid));
					categoryContent.append(pspan(' | ',"nm"));
				}
			}
		}
		categoryContent.append(pspan('（'+lazySetScore[ii-1]+'分）',"nm"));
		$strategy.append(categoryContent);
		ii++;
	}
	
	if (!($.isEmptyObject(whiteExtra))){
		var categoryContentExtra = $("<p/>");
		categoryContentExtra.append(pspan('加【过关必带】', "clothes_category"));
		for (var i in whiteExtra){
			lazySet[i] = whiteExtra[i];
			categoryContentExtra.append(pspan_id(listCateName(whiteExtra[i]),"clothes",whiteExtra[i].longid));
			categoryContent.append(pspan(' | ',"nm"));
			
		}
		categoryContentExtra.append(pspan('（'+getLazySetScore(lazySet)+'分）',"nm"));
		$strategy.append(categoryContentExtra);
	}
	
	if (whiteTodo.length)
		$strategy.append(p(whiteTodo.join(' | '),"clothes_category",'需制作【过关必带】: ','hint_tiele'));
	if (takeDown.length)
		$strategy.append(p(takeDown.join(' | '),"nm",'取消F品: ','hint_tiele'));
	
	$author_sign = $("<div/>").addClass("stgy_author_sign_div");
	var d = new Date();
	$author_sign.append(p("Generated at " + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes(), "author_sign_name"));
	$strategy.append($author_sign);
	
	$("#StrategyInfo").empty().append($strategy);
	if (!lanOwn) initOnekey_lan();
}

function getLazySetScore(obj){
	var lazySetAccNum = 0; //see how much accesories it has
	for (var i in obj){
		if (isAcc_c(i)) lazySetAccNum ++;
	}
	var sumScore = 0; //calc
	for (var i in obj){
		sumScore += isAccSumScore(obj[i], lazySetAccNum);
	}
	return Math.round(sumScore);
}

function evalSets(resultObj,existObj){
	if (existObj) {
		for (var i in existObj){
			if (!low) var low = existObj[i].sumScore;
			else if (low>existObj[i].sumScore) low  = existObj[i].sumScore;
		}
	}
	
	for (var str in resultObj){
        if ($.inArray(str, Object.keys(lazyKeywords)) > 0) continue;
        
		//delete those with low scores
		if (resultObj[str]['rawSumScore']&&low&&resultObj[str]['rawSumScore']<=low){
			delete resultObj[str];
			continue;
		}
		
		//get accCount
		var accCount = 0;
        var newAcc = 0;
		resultObj[str]['typeScore'] = {}; //init typeScore base on obj types
		resultObj[str]['typeAddedScore'] = {}; //delete result remain in last run
		resultObj[str]['result'] = {}; //delete result remain in last run
		if (existObj) for (var i in existObj) {
			resultObj[str]['typeScore'][i] = 0;
			if (isAcc_c(i)) accCount++;
		}
		for (var i in resultObj[str]['acc']){
			if (resultObj[str]['typeScore'][i]==null) {
				resultObj[str]['typeScore'][i] = 0;
				resultObj[str]['typeAddedScore'][i] = 0;
				if (newAcc < limitTag) {
                    accCount++;
                    newAcc++;
                }
			}
		}
		
		//put clothes in each type to 'result'
		for (var i in resultObj[str]['clothes']){
			if (resultObj[str]['typeScore'][i]==null) resultObj[str]['typeScore'][i] = 0;
			resultObj[str]['result'][i] = resultObj[str]['clothes'][i]; 
		}
		
		//calc highest acc scores in each acc type and put to 'result'
		if(resultObj[str]['acc']) {
			for (var type in resultObj[str]['acc']){
				var maxScore = 0;
				for (var bonus in resultObj[str]['acc'][type]){
					var cl = resultObj[str]['acc'][type][bonus];
					var score = isAccSumScore(cl,accCount);
					if (score > maxScore) resultObj[str]['result'][type] = cl;
					maxScore = score;
				}
			}
		}
		
		//compare with existObj, get typeScore and typeAddedScore
		for (var type in resultObj[str]['typeScore']){
			if (existObj&&existObj[type]) resultObj[str]['typeScore'][type] = isAccSumScore(existObj[type],accCount);
			if (!resultObj[str]['result'][type]) continue;
			var score = isAccSumScore(resultObj[str]['result'][type],accCount);
			if (score<=resultObj[str]['typeScore'][type]) delete resultObj[str]['result'][type];
            else {
                resultObj[str]['typeAddedScore'][type] = score - resultObj[str]['typeScore'][type];
                resultObj[str]['typeScore'][type] = score;
            }
		}
        
        //remove tagCate category more than limitTag
        if (str.indexOf("tag:")==0 && Object.keys(resultObj[str]['typeAddedScore']).length > limitTag){
            var entries = Object.entries(resultObj[str]['typeAddedScore']);
            entries.sort(function(a,b){return b[1] - a[1];});
            entries = entries.slice(0, limitTag);
            var keys = [];
            for (var i in entries) {
                keys.push(entries[i][0]);
            }
            for (var type in resultObj[str]['result']) {
                if ($.inArray(type, keys)<0) {
                    delete resultObj[str]['result'][type];
                    if (existObj&&existObj[type]) resultObj[str]['typeScore'][type] = isAccSumScore(existObj[type],accCount);
                    else delete resultObj[str]['typeScore'][type];
                }
            }
        }
		
		//remove repelCates and calc score
		resultObj[str]['score'] = 0;
		for (var j in repelCates){
			var sumFirst = [0,0]; //count, score
			var sumOthers = [0,0];
			for (var k in repelCates[j]){
				if (resultObj[str]['typeScore'][repelCates[j][k]]){
					var score = resultObj[str]['typeScore'][repelCates[j][k]];
					if (k==0) { sumFirst[0]++; sumFirst[1] += score;}
					else { sumOthers[0]++; sumOthers[1] += score; }
				}
			}
			if (sumFirst[0]==0 || sumOthers[0]==0) continue;
			if (sumFirst[1] < sumOthers[1]) {
				if (resultObj[str]['typeScore'][repelCates[j][0]]){
					delete resultObj[str]['result'][repelCates[j][0]];
					delete resultObj[str]['typeScore'][repelCates[j][0]];
				}
			}else for (k=1; k<repelCates[j].length; k++) {
				if (resultObj[str]['typeScore'][repelCates[j][k]]){
					delete resultObj[str]['result'][repelCates[j][k]];
					delete resultObj[str]['typeScore'][repelCates[j][k]];
				}
			}
		}
		for (var j in resultObj[str]['typeScore'])
			resultObj[str]['score'] += resultObj[str]['typeScore'][j];
	}
	return resultObj;
}

function diffScore_lan(obj, set){
	var lazySetAccNum = 0; //see how much accesories it has
	for (var i in set){
		if (isAcc_c(i)) lazySetAccNum ++;
	}
	
	var c = obj.type.type;
	var thisScore = isAccSumScore(obj, lazySetAccNum);
	
	for (var i in repelCates){
		var sumFirst=0;
		var sumOthers=0;
		if($.inArray(c, repelCates[i])>=0){
			for (var j in repelCates[i]){
				if (j>0) {
					if (set[repelCates[i][j]]) sumOthers+=isAccSumScore(set[repelCates[i][j]], lazySetAccNum);
				}else {
					if (set[repelCates[i][j]]) sumFirst+=isAccSumScore(set[repelCates[i][j]], lazySetAccNum);
				}
			}
			if($.inArray(c, repelCates[i])==0){
				if (sumFirst<sumOthers) return thisScore - sumOthers;
			}else if($.inArray(c, repelCates[i])>0){
				if (sumOthers<sumFirst) return thisScore - sumFirst;
			}
		}
	}
	var setScore = set[c] ? isAccSumScore(set[c], lazySetAccNum) : 0;
	return thisScore - setScore;
}

function listCateName(c){
	return '[' + c.type.type + ']' + c.name;
}

function removeFromArray(e,arr){
	var index = $.inArray(e,arr);
	if (index > -1) arr.splice(index, 1);
	return arr;
}

function isAcc(c){
	return c.type.mainType == "饰品";
}

function isAcc_c(type){
	return type.indexOf("饰品")==0;
}

function isAccSumScore(c,num){
	return c.isF ? 0 : realSumScore(c, num?num:accCateNum);
}

function lanOwnChk(c, lanOwn) {
	if (lanOwn) return c.own;
	else if ($.inArray(c.longid, lackClothes)>=0) return false;
	else return true;
}

function add_lanSteps(){
	lanSteps++;
	lanStrategy_recalc(lanSteps);
}
function min_lanSteps(){
	lanSteps=Math.max(1,lanSteps-1);
	lanStrategy_recalc(lanSteps+1);
}
function add_limitRet(){
	limitRet++;
	lanStrategy();
}
function min_limitRet(){
	limitRet = Math.max(1, limitRet-1);
	var recalc = false;
	for (var i in lazyKeywords){
		if (cntKeywordsReturns(i) > limitRet) recalc = true;
	}
	if (recalc) lanStrategy();
	else $('#limitRet').text(limitRet);
}
function add_limitTag(){
	limitTag++;
	lanStrategy();
}
function min_limitTag(){
	limitTag = Math.max(0, limitTag-1);
	var recalc = false;
	for (var i in lazyKeywords){
		if (cntKeywordsReturns(i) > limitTag) recalc = true;
	}
	if (recalc) lanStrategy();
	else $('#limitTag').text(limitTag);
}
function add_limitTagRet(){
	limitTagRet++;
	lanStrategy();
}
function min_limitTagRet(){
	limitTagRet = Math.max(1, limitTagRet-1);
	var recalc = false;
	for (var i in lazyKeywords){
		if (cntKeywordsReturns(i) > limitTagRet) recalc = true;
	}
	if (recalc) lanStrategy();
	else $('#limitTagRet').text(limitTagRet);
}

function cntKeywordsReturns(kw){
	if (kw.indexOf('套装·')>=0) return 0;
	else if (kw.indexOf('tag:')>=0) {
		var max = 0;
		for (var type in tagSet[kw]['typeCount']){
			if (tagSet[kw]['typeCount'][type]>max) max = tagSet[kw]['typeCount'][type];
		}
		return max;
	}
	else return wordSet[kw]['count'];
}

function pspan_id(text, cls, id){
	var $p = $("<span/>").text(text).addClass("stgy_" + cls).attr('id',id);
	return $p;
}

function initOnekey_lan(){
	$("#stgy_add_lackClothes").click(function() {
		var tmp = $("#stgy_add_lackClothes").attr('data-tmp');
		$("#stgy_add_lackClothes").attr('data-tmp',$("#stgy_add_lackClothes").text());
		$("#stgy_add_lackClothes").text(tmp);
		$("#stgy_add_lackClothes").toggleClass("stgy_greyBackGround");
		$("#stgy_reset_lackClothes").toggle();
		$(".stgy_clothes").toggleClass("stgy_clothes_hover");
	});
	$("#stgy_reset_lackClothes").click(function() {
		lackClothes = [];
		lanStrategy();
	});
	$(".stgy_clothes").click(function() {
		if (!$(".stgy_clothes").hasClass("stgy_clothes_hover")) return;
		lackClothes.push($(this).attr('id'));
		var stgy_save_lackClothes = $("#stgy_save_lackClothes").html();
		var step = parseInt($(this).closest('p').attr('id') ? $(this).closest('p').attr('id').replace('step-','') : 1);
		lanStrategy_init();
		lanStrategy_recalc(step);
		$("#stgy_save_lackClothes").html(stgy_save_lackClothes);
		$(".stgy_clothes").addClass("stgy_clothes_hover");
		initOnekey_lan();
	});
}