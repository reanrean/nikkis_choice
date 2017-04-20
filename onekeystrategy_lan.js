var limitRet = 20; //maximum return when search by keywords

function showStrategy_lan(){
	//to handle as full wardrobe when no clothes owned
	var ownCnt=loadFromStorage().size>0 ? 1 : 0;
	
	var themeName = $("#theme").val();
	var filters = clone(criteria);
	filters.own = true;
	if (!ownCnt) filters['missing'] = true;
	for (var i in CATEGORY_HIERARCHY) {
		if(i == "袜子"){
			filters[CATEGORY_HIERARCHY[i][0]] = true;	
			filters[CATEGORY_HIERARCHY[i][1]] = true;	
		}
		if(i != "饰品"){
			filters[CATEGORY_HIERARCHY[i]] = true;	
		}
		else{
			for (var j in CATEGORY_HIERARCHY[i]) {
				filters[CATEGORY_HIERARCHY[i][j]] = true;
			}			
		}
	}
	for (var i in skipCategory) {
		filters[skipCategory[i]] = false;
	}
	
	var result = {};
	
	for (var i in clothes) {//calc each clothes, put to result[type], and sort
		if (matches(clothes[i], {}, filters)) {
			clothes[i].calc(filters);
			if (clothes[i].isF) continue;
			if (!result[clothes[i].type.type]) result[clothes[i].type.type] = [];
			result[clothes[i].type.type].push(clothes[i]);
		}
	}
	for (var i in result) result[i].sort(function(a,b){return  isAccSumScore(b) - isAccSumScore(a);});
	
	var lazySet = {}; var lazySetScore = []; var lazyKeywords = {};
	
	var step = 0; //if have a set to build, step+=1;
	
	//get a set list that user have
	//note: if apply to seal100x, need to exclude those with "染","套"
	var allSets = []; var missingSets = []; 
	var suitSet = {}; var suitArray = [];
	for (var i in clothes) {
		if (!clothes[i].set) continue;
		var setName = clothes[i].set;
		if ($.inArray(setName,allSets)<0) allSets.push(setName);
		if (!chkOwn_lan(clothes[i],ownCnt) && $.inArray(setName,missingSets)<0) missingSets.push(setName);
		
		var type = clothes[i].type.type;
		var sumScore = (!chkOwn_lan(clothes[i],ownCnt)) && clothes[i].isF ? 0 : isAccSumScore(clothes[i]);
		
		if (suitSet[setName] == null){
			suitSet[setName] = {};
			suitSet[setName]['name'] = '套装·'+setName;
			suitSet[setName]['clothes'] = {};
			suitSet[setName]['typeScore'] = {};
		}
		suitSet[setName]['clothes'][type] = clothes[i];
		suitSet[setName]['typeScore'][type] = sumScore;
	}
	suitSet = rmRepelsAndCalcScore(suitSet); 
	for (var i in suitSet) if ($.inArray(i,missingSets)<0) suitArray.push(suitSet[i]);
	suitArray.sort(function(a,b){return  b["score"] - a["score"];});
	
	//put suitArray[0] to lazySet
	if (suitArray.length > 0){
		lazyKeywords[suitArray[0]['name']] = {};
		for (var i in suitArray[0]['clothes']){
			var cl = suitArray[0]['clothes'][i];
			lazySet[cl.type.type] = cl;
			lazyKeywords[suitArray[0]['name']][cl.type.type] = cl;
		}
		lazySetScore.push(getLazySetScore(lazySet));
		step += 1;
	}
	
	for (var step=step; step<lanSteps; step++){
		//loop to search keywords with value add, put into lazySet
		var wordArray = [];
		var existScore = {};
		for (var i in lazySet) existScore[i] = isAccSumScore(lazySet[i]);
		
		//keywords
		var wordSet = {};
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
						wordSet[str]['typeScore'] = {};
						wordSet[str]['count'] = 0;
						if (Object.keys(existScore).length) { //if any set selected, initialise typeScore
							for (var t in existScore){
								wordSet[str]['typeScore'][t] = existScore[t];
							}
						}
					}
					wordSet[str]['count'] += 1;
					
					if (!matches(clothes[i], {}, filters)) continue;
					if (clothes[i].isF) continue;
					var sumScore = isAccSumScore(clothes[i]);
					
					if (wordSet[str]['typeScore'][type] == null){
						wordSet[str]['clothes'][type] = clothes[i];
						wordSet[str]['typeScore'][type] = sumScore;
					}else if (sumScore > wordSet[str]['typeScore'][type]){
						var scoreDiff = sumScore - wordSet[str]['typeScore'][type];
						wordSet[str]['clothes'][type] = clothes[i];
						wordSet[str]['typeScore'][type] = sumScore;
					}
					
				}
			}
		}
		for (var i in wordSet){//remove keywords with too many returns
			if (i.indexOf("·")>=0 || wordSet[i]['count'] > limitRet) 
				delete wordSet[i];
		}
		wordSet = rmRepelsAndCalcScore(wordSet);
		for (var i in wordSet) wordArray.push(wordSet[i]);
		
		//tagCate
		var tagSet = {};
		for (var i in clothes){
			if (!matches(clothes[i], {}, filters)) continue;
			if (clothes[i].isF) continue;
			var mainType = clothes[i].type.mainType;
			var type = clothes[i].type.type;
			var tags = clothes[i].tags;
			for (var j in tags){
				if (!tags[j]) continue;
				if (tags[j].indexOf('+')>=0) continue;
				var subtype = mainType=='袜子' ? mainType : type.split('·')[0];
				tagCate = [subtype,tags[j]].join(' + ');
				var sumScore = isAccSumScore(clothes[i]);
				if (tagSet[tagCate] == null){
					tagSet[tagCate] = {};
					tagSet[tagCate]['name'] = tagCate;
					tagSet[tagCate]['clothes'] = {};
					tagSet[tagCate]['typeScore'] = {};
					tagSet[tagCate]['typeCount'] = {};
					if (Object.keys(existScore).length) { //if any set selected, initialise typeScore
						for (var t in existScore){
							tagSet[tagCate]['typeScore'][t] = existScore[t];
						}
					}
				}
				if (tagSet[tagCate]['typeScore'][type] == null){
					tagSet[tagCate]['clothes'][type] = clothes[i];
					tagSet[tagCate]['typeScore'][type] = sumScore;
				}else if (sumScore > tagSet[tagCate]['typeScore'][type]){
					var scoreDiff = sumScore - tagSet[tagCate]['typeScore'][type];
					tagSet[tagCate]['clothes'][type] = clothes[i];
					tagSet[tagCate]['typeScore'][type] = sumScore;
				}
				if (tagSet[tagCate]['typeCount'][type] == null) tagSet[tagCate]['typeCount'][type] = 0;
				tagSet[tagCate]['typeCount'][type] += 1;
			}
		}
		for (var i in tagSet){//remove keywords with too many returns
			for (var j in tagSet[i]['typeCount']){
				if (tagSet[i]['typeCount'][j] > limitRet){
					delete tagSet[i]['clothes'][j];
					delete tagSet[i]['typeScore'][j];
				}
			}
		}
		tagSet = rmRepelsAndCalcScore(tagSet);
		for (var i in tagSet) wordArray.push(tagSet[i]);
		
		wordArray.sort(function(a,b){return  b["score"] - a["score"];});
		
		//put wordArray[0] to lazySet
		if (wordArray.length > 0){
			lazyKeywords[wordArray[0]['name']] = {};
			for (var i in wordArray[0]['clothes']){
				var cl = wordArray[0]['clothes'][i];
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
	
	//check whether missing whitelist category at last
	var whiteType = []; var whiteExtra = {}; var whiteTodo = [];
	if (Flist&&Flist[themeName]&&Flist[themeName]["type"]){
		whiteType = Flist[themeName]["type"];
		for (var i in whiteType){
			if (lazySet[whiteType[i]]&&!lazySet[whiteType[i]].isF) continue; //lazySet already contains
			else if (result[whiteType[i]]) whiteExtra[result[whiteType[i]][0].type.type] = result[whiteType[i]][0]; //own, alert name
			else whiteTodo.push(whiteType[i]); //not own, alert to create
		}
	}
	
	//remove whiteTodo elements if corresponding repelCates already have (not in whiteType)
	for (var i in repelCates){
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
	}
	
	//if other parts in lazySet isF, alert to take down
	var takeDown = [];
	for (var i in lazySet){
		if ($.inArray(i,whiteType)) continue;
		else if (lazySet[i].isF) takeDown.push(listCateName(lazySet[i]));
	}
	
	//write result
	var $strategy = $("<div/>").addClass("strategy_info_div");
	
	var $title = p($("#theme").val() == "custom" ? "....." : $("#theme").val(),"title");
	$strategy.append($title);
	
	var $author = p("偷懒攻略·"+(filters['missing']?'全':'个人')+"衣柜版@小黑配装器", "author");
	$strategy.append($author);
	
	var $criteria_title = p("属性-权重: ", "criteria_title");
	$strategy.append($criteria_title);
	var $criteria = p(getStrCriteria(filters),"criteria");
	$strategy.append($criteria);
	var $tag = p(getstrTag(filters), "tag");
	$strategy.append($tag);
	
	$strategy.append('<p>');
	var $clotheslist_title = pspan("偷懒步骤: ", "clotheslist_title");
	$strategy.append($clotheslist_title);
	$strategy.append(pspan("(搜索"+lanSteps+"次)", "clothes"));
	$strategy.append('<button class="btn btn-xs btn-default" onclick="add_lanSteps()">＋</button><button class="btn btn-xs btn-default" onclick="min_lanSteps()">－</button>');
	$strategy.append('<p>');
	
	var ii = 0; 
	for (var i in lazyKeywords){
		if (i.indexOf('+')>0) var cate = 'tag搜索：【' + i + '】';
		else if (i.indexOf('套装·')<0) var cate = '【' + i + '】';
		else var cate = i;
		var categoryContent = $("<p/>");
		categoryContent.append(pspan((ii+1)+'. '+cate+" ", "clothes_category"));
		if (i.indexOf('套装·')!=0) {
			for (var c in category){ //sort by category
				if (lazyKeywords[i][category[c]]) {
					if (i.indexOf('+')>0) {
						var type = category[c].substr(Math.max(category[c].indexOf('-'),category[c].indexOf('·'))+1);
						categoryContent.append(pspan('['+type+']'+lazyKeywords[i][category[c]].name+' | ',"clothes"));
					}else categoryContent.append(pspan(lazyKeywords[i][category[c]].name+' | ',"clothes"));
				}
			}
		}
		categoryContent.append(pspan('（'+lazySetScore[ii]+'分）',"clothes"));
		$strategy.append(categoryContent);
		ii++;
	}
	
	if (!($.isEmptyObject(whiteExtra))){
		var categoryContent = $("<p/>");
		categoryContent.append(pspan('加【过关必做】', "clothes_category"));
		for (var i in whiteExtra){
			lazySet[i] = whiteExtra[i];
			categoryContent.append(pspan(listCateName(whiteExtra[i])+' | ',"clothes"));
			
		}
		categoryContent.append(pspan('（'+getLazySetScore(lazySet)+'分）',"clothes"));
		$strategy.append(categoryContent);
	}
	
	/*var lazySum = getLazySetScore(lazySet);
	$strategy.append(p(lazySum,"clothes",'总分估算: ','criteria_title'));*/
	
	if (whiteTodo.length > 0)
		$strategy.append(p(whiteTodo.join(' | '),"clothes_category",'需完成【过关必做】: ','hint_tiele'));
	if (takeDown.length > 0)
		$strategy.append(p(takeDown.join(' | '),"clothes",'取消F品: ','hint_tiele'));
	
	$author_sign = $("<div/>").addClass("stgy_author_sign_div");
	var d = new Date();
	$author_sign.append(p("Generated at " + (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes(), "author_sign_name"));
	$strategy.append($author_sign);
	
	$("#StrategyInfo").empty().append($strategy);
}

function getLazySetScore(obj){
	var lazySetAccNum = 0; //see how much accesories it has
	for (var i in obj){
		if (i.indexOf('饰品')==0) lazySetAccNum ++;
	}
	var sumScore = 0; //calc
	for (var i in obj){
		sumScore += i.indexOf('饰品')==0 ? accSumScore(obj[i],lazySetAccNum) : obj[i].sumScore;
	}
	return Math.round(sumScore);
}

function rmRepelsAndCalcScore(resultobj){
	for (var str in resultobj){
		resultobj[str]['score'] = 0;
		for (var j in repelCates){
			var sumFirst=0;
			var sumOthers=0;
			for (var k in repelCates[j]){
				if (resultobj[str]['typeScore'][repelCates[j][k]]){
					var score = resultobj[str]['typeScore'][repelCates[j][k]];
					if (k==0) sumFirst += score;
					else sumOthers += score;
				}
			}
			if (sumFirst==0 || sumOthers==0) continue;
			if (sumFirst < sumOthers) {
				if (resultobj[str]['typeScore'][repelCates[j][0]]){
					delete resultobj[str]['clothes'][repelCates[j][0]];
					delete resultobj[str]['typeScore'][repelCates[j][0]];
				}
			}else for (k=1; k<repelCates[j].length; k++) {
				if (resultobj[str]['typeScore'][repelCates[j][k]]){
					delete resultobj[str]['clothes'][repelCates[j][k]];
					delete resultobj[str]['typeScore'][repelCates[j][k]];
				}
			}
		}
		for (var j in resultobj[str]['typeScore'])
			resultobj[str]['score'] += resultobj[str]['typeScore'][j];
	}
	return resultobj;
}

function listCateName(c){
	return '[' + c.type.type + ']' + c.name;
}

function removeFromArray(e,arr){
	var index = $.inArray(e,arr);
	if (index > -1) arr.splice(index, 1);
	return arr;
}

function isAccSumScore(c){ //use the most conservative scoring
	return c.type.mainType == "饰品" ? Math.round(accSumScore(c,accCateNum)) : c.sumScore;
}

function chkOwn_lan(c,ownCnt){
	if (!ownCnt) return true;
	else return c.own;
}

var lanSteps = 5;
function add_lanSteps(){
	lanSteps+=1;
	showStrategy_lan();
}
function min_lanSteps(){
	lanSteps=Math.max(1,lanSteps-1);
	showStrategy_lan();
}
