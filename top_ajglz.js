function init_top(){
	enterKey();
	gen_setList();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	addCartNum();
	init_passcode();
	searchMode();
	init_searchModule();
}

function init_passcode(){
	$('#passcode').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			verify();
		}
	});
}

var cartNum=0;
var currentCart=0;
var storeTop_Normal=[];
var storeTop_Limit=[];

function verify(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		$("#p_passcode").hide();
		$(".p_content").show();
	}
}

function addCartNum(){
	cartNum++;
	var line='<hr><p>';
	line+='<input type="text" id="cartName'+cartNum+'" placeholder="分类'+cartNum+'" onkeyup="chooseCurCart('+cartNum+')" /> ';
	line+='<span id="cart'+cartNum+'"></span>';
	line+='<button class="btn btn-xs btn-default" onclick="addCart_All('+cartNum+')">添加整个列表</button> ';
	line+='<button class="btn btn-xs btn-default" onclick="clearCart('+cartNum+')">清空</button> ';
	line+='<button class="btn btn-xs btn-default" onclick="chooseCurCart('+cartNum+')">添加单品到此</button>';
	line+='</p>';
	$('#cartContent').append(line);
	currentCart=cartNum-1;
	$('#currentCart').html($('#cartName'+(currentCart+1)).val() ? $('#cartName'+(currentCart+1)).val() : $('#cartName'+(currentCart+1)).attr('placeholder'));
	cartList[cartNum-1]=[];
	$('#cartNum').html(cartNum);
	
	$('#cartName'+cartNum).keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			searchById($(this).val());
		}
	});
}

function delCartNum(){
	if(cartNum>1){
		cartNum--;
		$('#cartContent p:last').remove();
		$('#cartContent hr:last').remove();
		currentCart=cartNum-1;
		$('#currentCart').html($('#cartName'+(currentCart+1)).val() ? $('#cartName'+(currentCart+1)).val() : $('#cartName'+(currentCart+1)).attr('placeholder'));
		$('#cartNum').html(cartNum);
	}
}

function chooseCurCart(n){
	currentCart=n-1;
	$('#currentCart').html($('#cartName'+(currentCart+1)).val() ? $('#cartName'+(currentCart+1)).val() : $('#cartName'+(currentCart+1)).attr('placeholder'));
}

function searchMode(){
	if($('#searchMode').html()=='名称'){
		$('#searchMode').html('来源');
		$('#searchMode').removeClass('btn-success');
		$('#searchMode').addClass('btn-info');
		$('#textBox').attr('placeholder','来源/类别');
	}else{
		$('#searchMode').html('名称');
		$('#searchMode').removeClass('btn-info');
		$('#searchMode').addClass('btn-success');
		$('#textBox').attr('placeholder','套装/名称/类别');
	}
}

function searchById(txt,mode){
	if(txt) var searchById=txt;
	else var searchById=$.trim($("#textBox").val());
	if(mode) var searchMode=mode;
	else var searchMode=$('#searchMode').html();
	currentList=[];
	currentSetList=[];
	if(searchById){
		var out='<table border="1">';
		out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
		
		//按编号查找
		if(searchById.indexOf(',')>0){
			var searchArr=searchById.replace(/[^0-9a-z,]/gi,'').split(',');
			for (var i in clothes) 
				if (jQuery.inArray(clothes[i].longid, searchArr)>=0) currentList.push(i);
		}
		else
		
		if(searchMode=='来源'){
			for (var i in clothes){
				if (searchById=='*'){
					currentList.push(i);
				}else if(searchById.indexOf('!')==0){
					if(clothes[i].source==searchById.substr(1)) currentList.push(i);
				}else if(searchById.indexOf('*')>-1){
					var searchArr=searchById.split('*');
					for (m=0;m<searchArr.length;m++){
						if (searchArr[m]=='套装'){
							if(!clothes[i].set) break;
						}else if (searchArr[m]=='非套装'){
							if(clothes[i].set) break;
							if(isBasicSet(i)) break;
						}else if(searchArr[m].indexOf('?')>-1){//currently only check once, match head&tail for each source
							var srcArr=clothes[i].source.split('/');
							srcArr.push(clothes[i].type.type);
							var searchArr_mhead=searchArr[m].substr(0,searchArr[m].indexOf('?'));
							var searchArr_mtail=searchArr[m].substr(searchArr[m].indexOf('?')+1);
							var searchArr_match=0;
							for(var arr in srcArr){
								if(srcArr[arr].indexOf(searchArr_mhead)==0&&srcArr[arr].indexOf(searchArr_mtail)==srcArr[arr].length-searchArr_mtail.length){searchArr_match=1;break;}
							}
							if(!searchArr_match) break;
						}else if (searchArr[m]!=''){
							if(clothes[i].source.indexOf(searchArr[m])<0&&clothes[i].type.type.indexOf(searchArr[m])<0) break;
						}
						if (m==searchArr.length-1) currentList.push(i);
					}
				}else if(clothes[i].type.type.indexOf(searchById)>-1||clothes[i].source.indexOf(searchById)>-1){
					currentList.push(i);
				}
			}
		}else{
			for (var i in setList){
				if (setList[i].indexOf(searchById)>-1){
					out+=tr(td(ahref(setList[i],"searchSet('"+setList[i]+"')"))+td('套装')+td('-')+td('-')+td(''));
					currentSetList.push(setList[i]);
				}
			}
			for (var i in clothes){
				if (searchById=='*'){
					currentList.push(i);
				}else if(searchById.indexOf('!')==0){
					if(clothes[i].name==searchById.substr(1)) currentList.push(i);
				}else if(searchById.indexOf('*')>-1){
					var searchArr=searchById.split('*');
					for (m=0;m<searchArr.length;m++){
						//if(searchArr[m].indexOf('!')==0) {if(clothes[i].name!=searchArr[m].substr(1)) break; } else 
						if(searchArr[m]!=''&&clothes[i].name.indexOf(searchArr[m])<0&&clothes[i].type.type.indexOf(searchArr[m])<0) {break;}
						if (m==searchArr.length-1) currentList.push(i);
					}
				}else if(clothes[i].name.indexOf(searchById)>-1||clothes[i].type.type.indexOf(searchById)>-1){
					currentList.push(i);
				}
			}
		}
		out+=appendCurrent();
		out+='</table>';
		var out1='查找：'+searchById;
		if(currentList.length>0||currentSetList.length>0) {
			$('#topsearch_info').html(out);
			if (searchById!='*') out1+='　'+ahref('查找所有染色及进化',"searchSub(0,"+"'"+searchById+"')");
		}
		else {$("#topsearch_info").html('没有找到相关资料');}
		$("#topsearch_note").html(out1);
	}
}

function calcall(){ // calc all categories
	var date1=new Date();
	if (isNaN(parseInt($("#showCnt").val())) || $("#showCnt").val()<1) $("#showCnt").val(1);
	$("#showCnt").val(parseInt($("#showCnt").val()));
	if (isNaN(parseInt($("#maxHide").val())) || $("#maxHide").val()<1) $("#maxHide").val(1);
	$("#maxHide").val(parseInt($("#maxHide").val()));
	if($('#check_manual_flist').is(":checked")) manflist=$('#manual_flist').val().replace(/"/g,"'");
	else manflist='';
	
	manfresult = {};
	
	storeTopByCate(category);
	storeTop_Normal = cloneKey(storeTop);
	limitMode=1;
	storeTopByCate(category);
	storeTop_Limit = cloneKey(storeTop);
	var date2=new Date();
	$('#topsearch_note').html('计算完成，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;');
}

function calctop(calcopts){
	var date1=new Date();
	if (isNaN(parseInt($("#showCnt").val())) || $("#showCnt").val()<1) $("#showCnt").val(1);
	$("#showCnt").val(parseInt($("#showCnt").val()));
	if (isNaN(parseInt($("#maxHide").val())) || $("#maxHide").val()<1) $("#maxHide").val(1);
	$("#maxHide").val(parseInt($("#maxHide").val()));
	
	if (!($('#showJJC').is(":checked")||$('#showAlly').is(":checked")||$('#showNormal').is(":checked"))){
		$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
	}else{
		var err=0;
		for(var l=0;l<cartNum;l++){
			if(cartList[l].length==0) {err=1; break;}
		}
		if (err) $('#alert_msg').html('有选取列表为空_(:з」∠)_');
		else{
			$('#alert_msg').html('');
			$('#topsearch_info').html('');
			$('#topsearch_note').html('');
			var indexes='本页内容：';
			var topsearch_info_all='';
			limitMode=0;
			if (calcopts && calcopts == 'all') { //mod; generate content without recalc
				if (getLength(storeTop_Normal)>0) storeTop = cloneKey(storeTop_Normal);
				else {
					$('#ajglz_out').val('');
					$('#topsearch_note').html('请先全部计算_(:з」∠)_');
					return;
				}
			} else { //calc for only the given categories in cartCates
				if($('#check_manual_flist').is(":checked")) manflist=$('#manual_flist').val().replace(/"/g,"'");
				else manflist='';
				manfresult = {};
				storeTopByCate_all();
			}
			var topsearch_info_n=[];
			for(var l=0;l<cartNum;l++){
				var listname=($('#cartName'+(l+1)).val() ? $('#cartName'+(l+1)).val() : $('#cartName'+(l+1)).attr('placeholder'));
				var topsearch_info='<a id="'+(l+1)+'"></a>';
				topsearch_info+=('<p class="title2">'+listname+'</p><span class="norm">'+calctop_byall(l).replace(/\n/g,'\\n').replace(/href="" /g,'')+'</span>');
				topsearch_info_n.push(topsearch_info);
				indexes+=('&emsp;<a href="#'+(l+1)+'">'+listname+'</a>');
			}
			limitMode=1;
			if (calcopts && calcopts == 'all') { //mod; generate content without recalc
				if (getLength(storeTop_Limit)>0) storeTop = cloneKey(storeTop_Limit);
				else {
					$('#ajglz_out').val('');
					$('#topsearch_note').html('请先全部计算_(:з」∠)_');
					return;
				}
			}
			else storeTopByCate_all(); //calc for only the given categories in cartCates
			for(var l=0;l<cartNum;l++){
				topsearch_info_all+=topsearch_info_n[l];
				topsearch_info_all+='<span class="limit">'+calctop_byall(l).replace(/\n/g,'\\n').replace(/href="" /g,'')+'</span>';
				topsearch_info_all+='<span class="prop">'+propanal_byall(l).replace(/\n/g,'\\n')+'</span>';
			}
			if ($('#hideNores').is(":checked")) indexes+='<br>注：本页只显示顶配/高配部件。'
			$('#ajglz_out').val(header()+indexes+middle()+topsearch_info_all+footer());
			
			var date2=new Date();
			$('#topsearch_note').html('计算完成：'+ ($('#ajglz_title').val() ? $('#ajglz_title').val() : $('#ajglz_title').attr('placeholder')) +'，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
			if (calcopts && calcopts == 'all') { //mod; generate content without recalc
				$('#cartContent').hide();
			}
		}
	}
}

function propanal_byall(cartList_num){
	//***modified from top.js, rmb to update if it is changed in top.js***
	if($('#showSource').is(":checked")) var showSource=1;
	else var showSource=0;
	if($('#showMerc').is(":checked")) var showMerc=1;
	else var showMerc=0;
	
	var out='<table border="1" class="propByAll'+((showMerc||showSource)?' propSrc':'')+'">';
	out+=tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('同属性排名')+td('同部位同tag数')+td('属性被覆盖'));
	
	var out_cont='';
	for (var c in category){//sort by category
		for (var i in cartList[cartList_num]){
			id=cartList[cartList_num][i];
			if(clothes[id].type.type!=category[c]) continue;
			var withTag=clothesWithTag(clothes[id]);
			var result=propanal_byid(id);
			var out_rank=result[0]; 
			var out_rankTag=result[1];
			var out_tagCnt=result[2]; 
			var out_repl=result[3];
			var out_replTag=result[4];
			var isTop=result[5];
			var isSec=result[6];
			
			var cell=td(addTooltip(clothes[id].name,cell_tag(id,1)));
			cell+=td(clothes[id].type.type);
			if(showSource||showMerc){
				var cell_3rd='';
				if(showSource){
					var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
						srcs=conv_source(srcs,'定',clothes[id].type.mainType);
					if (srcs.indexOf('套装成就：')==0) srcs='套装成就';
					cell_3rd=srcs;
				}
				if(showMerc){
					var price=getMerc(id);
					if(price) {
						var hasStr=0;
						for (var r in replaceSrc){
							if(cell_3rd.indexOf(replaceSrc[r])>-1) {cell_3rd=cell_3rd.replace(replaceSrc[r],price); hasStr=1; break;}
						}
						if (!hasStr) cell_3rd=price;
					}
				}
				cell+=td(cell_3rd);
			}
			
			//同属性排名
			var cellRank='';
			var rankTxt=(withTag?'不计tag:':'')+out_rank[0];
			cellRank+=(out_rank[1] ? addTooltip(rankTxt,out_rank[1]) : rankTxt) +'<br>';
			if (withTag){
				for (var tagj in out_rankTag){
					var rankTagTxt=rmtagstr(tagj)+':'+out_rankTag[tagj][0];
					cellRank+=(out_rankTag[tagj][1] ? addTooltip(rankTagTxt,out_rankTag[tagj][1]) : rankTagTxt) +'<br>';
				}
			}
			cell+=td(cellRank,(cellRank.indexOf('第1<')>-1?'class="top"':''));
			//tag
			if (withTag){
				var cellRank='';
				for (var tagj in out_tagCnt){
					var tagTxt=rmtagstr(tagj)+':'+out_tagCnt[tagj][0];
					cellRank+=(out_tagCnt[tagj][1] ? addTooltip(tagTxt,out_tagCnt[tagj][1]) : tagTxt) +'<br>';
				}
				cell+=td(cellRank,(cellRank.indexOf('0个<')>-1?'class="top"':''));
			}else {cell+=td('-');}
			//属性被覆盖
			var cellRank='';
			var replTxt=(withTag?'不计tag:':'')+out_repl[0];
			cellRank+=(out_repl[1] ? addTooltip(replTxt,out_repl[1]) : replTxt) +'<br>';
			if (withTag){
				for (var tagj in out_replTag){
					var replTagTxt=rmtagstr(tagj)+':'+out_replTag[tagj][0];
					cellRank+=(out_replTag[tagj][1] ? addTooltip(replTagTxt,out_replTag[tagj][1]) : replTagTxt) +'<br>';
				}
			}
			cell+=td(cellRank,(cellRank.indexOf('0个<')>-1?'class="top"':''));
			
			if ($.inArray(clothes[id].type.type, skipCategory)>=0) {cellContent=td('-')+td('-')+td('-'); isTop=0; isSec=0;} //skip
			
			if (!$('#hideNores').is(":checked")||isSec||isTop){
				out_cont+=tr(cell,(isTop?'class="top"':''));
			}
		}
	}
	if(out_cont) return out+out_cont+'</table>';
	else return '<p class="normal" align="center">无顶配/高配信息</p>';
}

function calctop_byall(cartList_num){
	//***modified from top.js, rmb to update if it is changed in top.js***
	if ($('#showJJC').is(":checked")) var showJJC=1;
	else var showJJC=0;
	if ($('#showAlly').is(":checked")) var showAlly=1;
	else var showAlly=0;
	if ($('#showNormal').is(":checked")) var showNormal=1;
	else var showNormal=0;
	if($('#showSource').is(":checked")) var showSource=1;
	else var showSource=0;
	if($('#showMerc').is(":checked")) var showMerc=1;
	else var showMerc=0;
	if($('#rmguildhs').is(":checked")) var rmguildhs=1;
	else var rmguildhs=0;
	
	var out='<table class="calcByAll'+((showMerc||showSource)?' calcSrc':'')+'">';
	out+=tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('顶配')+(showJJC?td('竞技场'):'')+(showAlly?td('联盟'+(limitMode&&!rmguildhs?'(极限)':'')):'')+(showNormal?td('关卡'+(limitMode?'(极限)':'')):''));
	var out_cont='';
	for (var c in category){//sort by category
		for (var i in cartList[cartList_num]){
			id=cartList[cartList_num][i];
			if(clothes[id].type.type!=category[c]) continue;
			calctop_byid(id);
			var rowspan=(inTop.length>0&&inSec.length>0)? 2:1;
			
			var cell=td(addTooltip(clothes[id].name,cell_tag(id,1)),(rowspan>1?'rowspan="'+rowspan+'"':''));
			cell+=td(clothes[id].type.type,(rowspan>1?'rowspan="'+rowspan+'"':''));
			if(showSource||showMerc){
				var cell_3rd='';
				if(showSource){
					var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
						srcs=conv_source(srcs,'定',clothes[id].type.mainType);
					if (srcs.indexOf('套装成就：')==0) srcs='套装成就';
					cell_3rd=srcs;
				}
				if(showMerc){
					var price=getMerc(id);
					if(price) {
						var hasStr=0;
						for (var r in replaceSrc){
							if(cell_3rd.indexOf(replaceSrc[r])>-1) {cell_3rd=cell_3rd.replace(replaceSrc[r],price); hasStr=1; break;}
						}
						if (!hasStr) cell_3rd=price;
					}
				}
				cell+=td(cell_3rd,(rowspan>1?'rowspan="'+rowspan+'"':''));
			}
			if(inTop.length>0){
				cell+=td('顶配');
				cell+=(showJJC?td(retTopTd(inTop,'竞技场',id,cartList_num)):'');
				cell+=(showAlly?td(retTopTd(inTop,'联盟',id,cartList_num)):'');
				cell+=(showNormal?td(retTopTd(inTop,'关卡',id,cartList_num)):'');
				out_cont+=tr(cell,'class="top"');
			}
			if(inSec.length>0){
				if(inTop.length>0) cell='';
				cell+=td('高配');
				cell+=(showJJC?td(retTopTd(inSec,'竞技场',id,cartList_num)):'');
				cell+=(showAlly?td(retTopTd(inSec,'联盟',id,cartList_num)):'');
				cell+=(showNormal?td(retTopTd(inSec,'关卡',id,cartList_num)):'');
				out_cont+=tr(cell);
			}
			if(inTop.length==0 && inSec.length==0 && !($('#hideNores').is(":checked"))){
				out_cont+=tr(cell+td('-')+(showJJC?td(''):'')+(showAlly?td(''):'')+(showNormal?td(''):''));
			}
			
			//place manual f result
			if (!limitMode && manfresult[clothes[id].name]){
				for (var f in manfresult[clothes[id].name]) 
					$('#manual_flist_result').append(clothes[id].name + ' ' + f + ' F<br>');
			}
		}
	}
	if(out_cont) return out+out_cont+'</table>';
	else return '<p class="normal" align="center">无顶配/高配信息</p>';
}

function isBasicSet(id){
	var targ=[];
	targ.push(id);
	do{
		var total=0;
		for (var i in clothes){
			for (var t in targ){
				if (clothes[i].source.indexOf(clothes[targ[t]].id)>0 
				&& clothes[targ[t]].type.mainType==clothes[i].type.mainType 
				&& $.inArray(i,targ)<0){
					targ.push(i);
					total+=1;
				}
			}
		}
	}while(total>0);
	for (var i in targ){
		if(clothes[targ[i]].set) return 1;
	}
	return 0;
}

function download_top(){
	var file_content=$('#ajglz_out').val();
	var file_name=$('#ajglz_filename').val();
	download(file_content, file_name, 'text/plain');
}

function clear_textarea(){
	$('#ajglz_filename').val('');
	$('#ajglz_out').val('');
}

function storeTopByCate_all(){
	var cartCates=[];
	for (var l in cartList){
	for (var i in cartList[l]){
		cartCates.push(clothes[cartList[l][i]].type.type);
		for (var k in repelCates){
			if($.inArray(clothes[cartList[l][i]].type.type, repelCates[k])>-1){
				for (var j in repelCates[k]){
					cartCates.push(repelCates[k][j]);
				}
			}
		}
	}
	}
	cartCates=getDistinct(cartCates);
	storeTopByCate(cartCates);
}

function clearCart(n){
	cartList[n-1]=[];
	refreshCart(n-1);
}

function addCart_All(n){
	for (var i in currentList){
		cartList[n-1].push(currentList[i]);
	}
	refreshCart(n-1);
}

function refreshCart(n){
	$('#cart'+(n+1)).html('');
	cartList[n]=getDistinct(cartList[n]);
	for (var i in cartList[n]){
		$('#cart'+(n+1)).append('<button class="btn btn-xs btn-default">'+clothes[cartList[n][i]].name+ahref('[×]','delCart('+cartList[n][i]+','+n+')')+'</button>&ensp;');
	}
}

function addCart(id){
	cartList[currentCart].push(id);
	refreshCart(currentCart);
}

function delCart(id,n){
	var newArr=cartList[n];
	cartList[n]=[];
	for (var i in newArr){
		if(newArr[i]!=id) cartList[n].push(newArr[i]);
	}
	refreshCart(n);
}

function header(){
	var appurl=$('#appurl').is(":checked") ? 1 : 0;
 var h='<!DOCTYPE html>';
	h+='<head>';
	h+='<meta name="viewport" content="width=device-width, initial-scale=1"/>';
	//h+='<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	h+='<meta charset="UTF-8" />';
	h+='<link rel="stylesheet" type="text/css" href="'+(appurl?'http://aojiaogongluezu.github.io/nikkiup2u3/':'../../')+'css/style.css" />';
	h+='<link rel="stylesheet" type="text/css" href="'+(appurl?'http://aojiaogongluezu.github.io/nikkiup2u3/html/3-DingPei/':'')+'dp-style.css" />';
	h+='<script type="text/javascript" src="'+(appurl?'http://aojiaogongluezu.github.io/nikkiup2u3/html/3-DingPei/':'')+'dp.js"></script>';
	h+='</head>';
	h+='<body>';
	h+='<div class="myframe">';
	h+='<p class="title1">';
	h+='顶配分析-';
	h+=$('#ajglz_title').val() ? $('#ajglz_title').val() : $('#ajglz_title').attr('placeholder');
	h+='</p>';
	h+='<hr class="mhr"/>';
	h+='<p class="normal"><span class="title3">更新时间：</span>';
	var d=new Date();
	h+=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	h+='<br>';
	h+='<span class="title3">更新人员：</span>';
	h+=$('#ajglz_staff').val() ? $('#ajglz_staff').val() : $('#ajglz_staff').attr('placeholder');
	if($('#ajglz_title').val().indexOf('最新活动')>=0) 
		h+='<br><span class="title3">说明：</span>新品通常未排F，仅供参考；如果看到内容是上一个活动的，说明最新的顶配分析还没更新，请耐心等待。<br>';
	h+='</p>';
	h+='<hr class="mhr"/>';
	h+='<p class="normal">';
	return h;
}

function middle(){
	return '</p><p id="radio"></p>';
}

function footer(){
	return '</div></body></html>';
}

function addTooltip(text,tooltip){
	return '<a tooltip="'+tooltip+'">'+text+'</a>';
}

function nobr(text){
	return '<em>'+text+'</em>';
}

function cloneKey(obj){
	if (obj instanceof Array) {
		var o = [];
		for (var i in obj){
			o[i] = cloneKey(obj[i]);
		}
		return o;
	}else return obj;
}

function cloneKeyObj(obj){
	if (obj instanceof Object) {
		var o = {};
		for (var i in obj){
			o[i] = cloneKeyObj(obj[i]);
		}
		return o;
	}else return obj;
}

function getLength(obj){
	var l=0;
	for (var i in obj) {if (obj[i]) l++;}
	return l;
}

//*******************************************search module*******************************************//

function init_searchModule(){
	var box=['不使用'];
	for (var m in modules_top){
		box.push(modules_top[m][0]);
	}
	box=getDistinct(box);
	$('#searchModule').html(selectBox('modes','genModule()',box));
}

function selectBox(id,onchange,valArr,textArr){
	var ret='<select id="'+id+'" onchange='+onchange+'>';
	if(!textArr) textArr=valArr;
	for (var i in valArr){
		ret+='<option value="'+valArr[i]+'">'+textArr[i]+'</option>';
	}
	ret+='</select>';;
	return ret;
}

function genModule(){
	//clear all carts
	var cnt=cartNum;
	for (var c=0;c<cnt;c++){
		delCartNum();
	}
	clearCart(1);
	$('#cartName1').val('');
	$('#ajglz_title').val('');
	$('.modable').find('input[type=checkbox]').prop('checked',false);
	//start
	var modes=$('#modes').val();
	if(modules_top_checkbox[modes]){
		for (var c in modules_top_checkbox[modes]) $('#'+modules_top_checkbox[modes][c]).prop('checked',true);
	}
	var title=[];
	for (var m in modules_top){
		if (modules_top[m][0]==modes) title.push(modules_top[m][1]);
	}
	title=getDistinct(title);
	if(title.length>0) $('#ajglz_title').val(modes);
	for (var t in title){
		if(t>0) addCartNum();
		for (var m in modules_top){
			if (modules_top[m][0]==modes&&modules_top[m][1]==title[t]) {
				$('#cartName'+(t*1+1)).val(title[t]);
				if(modules_top[m][2]){
					searchSet(modules_top[m][3]);
				}else{
					searchById(modules_top[m][3],modules_top[m][4]);
				}
				searchSub(0,modules_top[m][3]);
				addCart_All(t*1+1);
			}
		}
	}
	if(modules_top_filename[modes]) $('#ajglz_filename').val(modules_top_filename[modes]);
	$('#cartContent').show();
}

function toggle_manual_flist(){
	$('#p_fcontent').toggle();
}

function toggle_rmguildhs(){
	if($('#rmguildhs').is(":checked")) backup_guild_hs();
	else restore_guild_hs();
}

function backup_guild_hs(){
	tasksAdd_bk = cloneKeyObj(tasksAdd);
	tasksAdd = function() {
		var ret = {};
		for (var i in tasksAdd){
			if (i.substr(0,4) != '联盟委托') ret[i] = tasksAdd[i];
		}
		return ret;
	}();
}

function restore_guild_hs(){
	if(tasksAdd_bk) tasksAdd = cloneKeyObj(tasksAdd_bk);
}
