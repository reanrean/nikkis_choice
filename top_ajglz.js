function init_top(){
	init_pagecontent();
	enterKey();
	gen_setList();
	sortTags();
	addCartNum();
	searchMode();
	presetModules();
	init_searchModule();
	init_placeholder();
	init_passcode();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	$('#showCnt2').val(3);
	$('#showScore').val(1000);
}

function init_pagecontent(){
	var style = $("<style>");
	style.append('.unwrap {word-break:keep-all; color:#ff7890;}');
	style.append('a.monkey {color:inherit;text-decoration:none;}');
	style.append('body {margin:1em; font-family: "Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;}');
	style.append('fieldset {width:100%; max-width:270px; padding:.35em .625em .75em; border:1px solid silver;}');
	style.append('legend {border:0; width:auto; margin-bottom:0; font-size:14px;}');
	style.append('label {font-weight:normal; line-height:100%;}');
	style.append('button.btn-cust {border:0px}');
	style.append('td {padding:5px;}');
	style.append('tr:first-child {font-weight:bold;}');
	style.appendTo("head");
	
	var page = '<p id="top_radio"><label><input type="radio" name="ar" checked onclick="chgDpMode(1)">顶配分析</label><label><input type="radio" name="ar" onclick="chgDpMode(2)">懒人替换</label><label><input type="radio" name="ar" onclick="chgDpMode(3)">刷分更新</label></p>';
	page += '<hr>';
	page += '<span class="DpMode1">';
	page += '<p>';
	page += '<button id="searchMode" class="btn btn-sm btn-info btn-cust" onclick="searchMode()"></button>';
	page += '<input type="text" id="textBox">';
	page += '<button id="searchById" onclick="searchById()">查找</button>';
	page += '<button id="calc" onclick="calctop()">计算</button>';
	page += '<span id="alert_msg" class="unwrap"></span>';
	page += '</p>';
	page += '<fieldset>';
	page += '<legend>选项（重新计算生效）</legend>';
	page += '模板：<span id="searchModule"></span> <label><input type="checkbox" id="rmguildhs" onclick="toggle_rmguildhs()" />for点点</label><br>';
	page += '计算 <label><input type="checkbox" id="showJJC" checked />竞技场</label> <label><input type="checkbox" id="showAlly" checked />联盟</label> <label><input type="checkbox" id="showNormal" checked />主线</label><br>';
	page += '高配数：<input type="text" id="showCnt" size="2" style="line-height:100%;"/> 收起：><input type="text" id="maxHide" size="2" style="line-height:100%;"/><br>';
	page += '<label><input type="checkbox" id="check_manual_flist" onclick="toggle_manual_flist()" />手动F表</label> ';
	page += '<span class="modable">';
	page += '<label><input type="checkbox" id="hideNores" />只显示顶配/高配部件</label><br>';
	page += '显示 <label><input type="checkbox" id="showSource" />来源</label> <label><input type="checkbox" id="showMerc" />兑换数量</label><br>';
	page += '</span>';
	page += '<span style="display:none"><input type="checkbox" id="cartMode" onclick="chgcartMode()" checked />选取多件</span>';
	page += '<button id="calcall" onclick="calcall()">全部计算</button>';
	page += '<button id="genall" onclick="calctop('+"'all'"+')">生成</button>';
	page += '<button id="genall_1click" onclick="genall_1click()">一键生成</button>';
	page += '</fieldset>';
	page += '<hr>';
	var d = new Date(new Date().getTime()+24*60*60*1000);
	var ajglz_date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	page += '<p>标题：<input type="text" id="ajglz_title" placeholder="XXXX"/>&emsp;更新人员：<input type="text" id="ajglz_staff" placeholder="Rean翎"/>&emsp;更新时间：<input type="text" id="ajglz_date" placeholder="'+ajglz_date+'"/></p>';
	page += '<p>分类数量：<span id="cartNum"></span>&ensp;<button class="btn btn-xs btn-default" onclick="addCartNum()">＋</button><button class="btn btn-xs btn-default" onclick="delCartNum()">－</button>&emsp;点击单品添加到：<span id="currentCart"></span></p>';
	page += '<span id="cartContent"></span>';
	page += '</span>';
	page += '<span class="DpMode2 DpMode3" style="display:none">';
	page += '<p>版本追溯至：<input type="text" id="newVer" placeholder="V?.?.?"/>&emsp;更新人员：<input type="text" id="ajglz_staff2" placeholder="Rean翎"/>&emsp;更新时间：<input type="text" id="ajglz_date2" placeholder="'+ajglz_date+'"/>&emsp;<button onclick="genLanRen()">一键懒人</button></p>';
	page += '</span>';
	page += '<span class="DpMode2" style="display:none"><button onclick="CreateReplace()">竞技场联盟新衣服替换</button> ';
	page += '<button onclick="CreateJJC()">竞技场简表</button> ';
	page += '<button onclick="CreateLM6()">联盟六简表</button> ';
	page += '</span>';
	page += '<span class="DpMode3" style="display:none">';
	page += '<p><button id="calcold" onclick="calcTaskAddOld()">先: 计算旧极限</button>';
	page += '<button id="calcupd" onclick="calctopupd()">极限分数更新</button>';
	page += '<span id="alert_msg_update" class="unwrap"></span></p>';
	page += '<fieldset>';
	page += '<legend>选项（重新计算生效）</legend>';
	page += '显示<input type="text" id="showCnt2" size="2" style="line-height:100%;"/>件高配信息<br>';
	page += '分差超过<input type="text" id="showScore" size="5" style="line-height:100%;"/>的关卡<br>';
	page += '<label><input type="checkbox" id="showNormal2" checked />主线</label> <label><input type="checkbox" id="showAlly2" checked />联盟</label> <label><input type="checkbox" id="showAlly62" />联盟六</label> <label><input type="checkbox" id="showJJC2" />竞技场</label><br>';
	page += '</fieldset>';
	page += '</span>';
	page += '<hr>';
	page += '<p id="topsearch_note"></p>';
	page += '<p id="topsearch_info"></p>';
	page += '<hr>';
	page += '<p id="p_passcode" style="display:none"><input type="password" id="passcode" placeholder="神秘代码"/><a href="" onclick="verify();return false;" class="monkey">&#x1f648;</a></p>';
	page += '<p class="p_content">';
	page += '<button onclick="clear_textarea()">清空</button><button onclick="previewHtml()">预览</button><button onclick="download_top()">下载</button><br>';
	page += '<input type="text" id="ajglz_filename" style="width:100%" placeholder="文件名"/><br>';
	page += '<textarea id="ajglz_out" rows=15 style="width:100%"></textarea><br>';
	page += '</p>';
	page += '<hr>';
	page += '<p id="p_fcontent" style="display:none">';
	page += '<textarea id="manual_flist" rows=5 style="width:100%">';
	page += "F表格式（示例）：\n'关卡: 1-1':[20401,20402,],\n'关卡: 1-2':[20435,],</textarea><br>";
	page += '<span id="manual_flist_result" class="p_content" style="display:none"></span>';
	page += '</p>';
	$("#init").html(page);
}

function init_passcode(){
	$('#passcode').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			verify();
		}
	});
	$('#unhide_pass').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			unhide();
		}
	});
}

var cartNum=0;
var currentCart=0;
var storeTop_Normal=[];
var storeTop_Limit=[];
var impCart = [];

function verify(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		$("#p_passcode").hide();
		$(".p_content").show();
	}
}

function unhide(){
	var pass='5e65d9d696058c4e452b2ab82666a14cbcec2c7a';
	var userInput=$.sha1($("#unhide_pass").val());
	$("#unhide_pass").val('');
	if (userInput==pass){
		$("#unhide").hide();
		$("#hide").show();
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
	$('#currentCart').html(valOrPh('cartName'+(currentCart+1)));
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
		$('#currentCart').html(valOrPh('cartName'+(currentCart+1)));
		$('#cartNum').html(cartNum);
	}
}

function chooseCurCart(n){
	currentCart=n-1;
	$('#currentCart').html(valOrPh('cartName'+(currentCart+1)));
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
		else $("#topsearch_info").html('没有找到相关资料');
		$("#topsearch_note").html(out1);
	}
}

function calcall(){ // calc all categories
	var date1=new Date();
	verifyNum('showCnt');
	verifyNum('maxHide');
	var showCnt = $("#showCnt").val();
	if($('#check_manual_flist').is(":checked")) manflist=$('#manual_flist').val().replace(/"/g,"'");
	else manflist='';
	var caltype = 42;//2*3*7
	
	manfresult = {};
	
	storeTop = storeTopByCate(category, caltype, showCnt, []);
	storeTop_Normal = cloneKey(storeTop);
	limitMode=1;
	storeTop = storeTopByCate(category, caltype, showCnt, []);
	storeTop_Limit = cloneKey(storeTop);
	var date2=new Date();
	$('#topsearch_note').html('计算完成-全部计算，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;');
}

function calctop(calcopts){
	var date1=new Date();
	verifyNum('showCnt');
	verifyNum('maxHide');
	var showCnt = $("#showCnt").val();
	var caltype = ($('#showJJC').is(":checked")?2:1) * ($('#showAlly').is(":checked")?3:1) * ($('#showNormal').is(":checked")?7:1);
	
	if (caltype == 1){
		$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
	}else{
		var err=0;
		for(var l=0;l<cartNum;l++){
			if(cartList[l].length==0) {err=1; break;}
		}
		if (err) {
			$('#alert_msg').html('有选取列表为空_(:з」∠)_');
			console.log('有选取列表为空: ' + valOrPh('ajglz_title'));
		}
		else{
			$('#alert_msg').html('');
			$('#topsearch_info').html('');
			$('#topsearch_note').html('');
			var indexes='本页内容：';
			var topsearch_info_all='';
			limitMode=0;
			if (calcopts && calcopts == 'all') { //mod; generate content without recalc
				if (getLength(storeTop_Normal)>0) storeTop = cloneKey(storeTop_Normal);
				else{
					$('#ajglz_out').val('');
					$('#topsearch_note').html('请先全部计算_(:з」∠)_');
					return;
				}
			}else{ //calc for only the given categories in cartCates
				if($('#check_manual_flist').is(":checked")) manflist=$('#manual_flist').val().replace(/"/g,"'");
				else manflist='';
				manfresult = {};
				storeTopByCartCates(caltype, showCnt);
			}
			var topsearch_info_n=[];
			for(var l=0;l<cartNum;l++){
				var listname=(valOrPh('cartName'+(l+1)));
				var topsearch_info = subtitle(listname, (l+1))+'<span class="norm">'+calctop_byall(l,caltype).replace(/\n/g,'\\n').replace(/href="" /g,'')+'</span>';
				topsearch_info_n.push(topsearch_info);
				indexes+=('&emsp;<a href="#'+(l+1)+'">'+listname+'</a>');
			}
			limitMode=1;
			if (calcopts && calcopts == 'all'){ //mod; generate content without recalc
				if (getLength(storeTop_Limit)>0) storeTop = cloneKey(storeTop_Limit);
				else{
					$('#ajglz_out').val('');
					$('#topsearch_note').html('请先全部计算_(:з」∠)_');
					return;
				}
			}
			else storeTopByCartCates(caltype, showCnt); //calc for only the given categories in cartCates
			for(var l=0;l<cartNum;l++){
				topsearch_info_all+=topsearch_info_n[l];
				topsearch_info_all+='<span class="limit">'+calctop_byall(l,caltype).replace(/\n/g,'\\n').replace(/href="" /g,'')+'</span>';
				topsearch_info_all+='<span class="prop">'+propanal_byall(l).replace(/\n/g,'\\n')+'</span>';
			}
			if ($('#hideNores').is(":checked")) indexes+='<br>注：本页只显示顶配/高配部件。'
			$('#ajglz_out').val(header()+indexes+middle()+topsearch_info_all+footer());
			
			var date2=new Date();
			$('#topsearch_note').html('计算完成：'+ valOrPh('ajglz_title') +'，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
			if (calcopts && calcopts == 'all') { //mod; generate content without recalc
				$('#cartContent').hide();
			}
		}
	}
}

function isBasicSet(id){
	var targ=[];
	targ.push(id);
	do{
		var total=0;
		for (var i in clothes){
			for (var t in targ){
				if ( (clothes[i].source.indexOf('进'+clothes[targ[t]].id)>=0 || clothes[i].source.indexOf('定'+clothes[targ[t]].id)>=0)
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
	var file_content = $('#ajglz_out').val();
	var file_name = $('#ajglz_filename').val() ? $('#ajglz_filename').val() : '0.html';
	var blob = new Blob([file_content], {type: "text/plain;charset=utf-8"});
	saveAs(blob, file_name);
}

function clear_textarea(){
	$('#ajglz_filename').val('');
	$('#ajglz_out').val('');
}

function storeTopByCartCates(caltype, nCount){
	var cartCates=[];
	for (var l in cartList){
		for (var i in cartList[l]) cartCates = addCates(cartCates, cartList[l][i]);
	}
	cartCates = getDistinct(cartCates);
	storeTop = storeTopByCate(cartCates, caltype, nCount, []);
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

function previewHtml(){
	var head = '<meta name="viewport" content="width=device-width, initial-scale=1"/><meta charset="UTF-8" />';
	head += '<link rel="stylesheet" type="text/css" href="http://aojiaogongluezu.github.io/nikkiup2u3/css/style.css" />';
	head += '<link rel="stylesheet" type="text/css" href="http://aojiaogongluezu.github.io/nikkiup2u3/html/3-DingPei/dp-style.css" />';
	var record=$("#ajglz_out").val().replace(/<head>(.*)<\/head>/, head);
	var winRecord = window.open('');
	winRecord.document.write(record);
	
	/*var script = document.createElement('script');//seems cannot load it, anyway
	script.src = 'http://aojiaogongluezu.github.io/nikkiup2u3/html/3-DingPei/dp.js';
	script.type = 'text/javascript';
	script.charset = 'UTF-8';
	winRecord.document.head.appendChild(script);*/
}

function header(){
	var appurl = $('#rmguildhs').is(":checked");
	var h=headerFrame('顶配分析-'+valOrPh('ajglz_title'), valOrPh('ajglz_staff'), valOrPh('ajglz_date'), 1, appurl);
	if($('#ajglz_title').val().indexOf('最新活动')>=0) 
		h+='<span class="title3">说明：</span>新品通常未排F，仅供参考；如果看到内容是上一个活动的，说明最新的顶配分析还没更新，请耐心等待。<br>\n';
	h+='</p>';
	h+='<hr class="mhr"/>';
	h+='<p class="normal">';
	return h;
}

function headerFrame(stitle, sname, sdate, dp, appurl){
	var h='<!DOCTYPE html><head>';
	h+='<meta name="viewport" content="width=device-width, initial-scale=1"/>';
	h+='<meta charset="UTF-8" />';
	//h+='<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
	h+='<link rel="stylesheet" type="text/css" href="'+(appurl?'http://ajglz.coding.me/':'../../')+'css/style.css" />';
	if (dp) h+='<link rel="stylesheet" type="text/css" href="'+(appurl?'http://ajglz.coding.me/html/3-DingPei/':'../3-DingPei/')+'dp-style.css" />';
	if (dp) h+='<script type="text/javascript" src="'+(appurl?'http://ajglz.coding.me/html/3-DingPei/':'../3-DingPei/')+'dp.js"></script>';
	h+='</head>\n<body>';
	if (dp&&appurl) h+='<style>label:first-child,#limitn,.norm{display:none;}.limit{display:inline;}</style>';
	if (appurl) h+='\n<style>body{background-image:url(http://ajglz.coding.me/images/bk2.png);background-repeat:repeat-y;background-position:50% 0%;background-size:60%;}</style>';
	h+='<div class="myframe">\n';
	h+='<p class="title1">'+stitle+'</p><hr class="mhr"/>\n';
	h+='<p class="normal"><span class="title3">更新时间：</span>'+sdate;
	h+='<br>\n<span class="title3">更新人员：</span>'+sname+'<br>\n';
	return h;
}

function middle(){
	return '</p>\n<p id="radio"></p>';
}

function footer(){
	return '\n</div></body></html>';
}

function addTooltip(text,tooltip){
	return '<a tooltip="'+tooltip+'">'+text+'</a>';
}

function nobr(text){
	return '<em>'+text+'</em>';
}

function subtitle(text, id){
	 return '\n' + (id ? '<a id="'+id+'"></a>' : '' ) + '<p class="title2">' + text + '</p>';
}

function normaltext(text){
	 return '<p class="normal" align="center">' + text + '</p>';
}

function valOrPh(id){
	return $('#'+id).val() ? $('#'+id).val() : $('#'+id).attr('placeholder');
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
	var box = ['不使用'];
	for (var m in modules_top){
		box.push(modules_top[m][0]);
	}
	box = getDistinct(box);
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

function genall_1click(){
	var date1=new Date();
	if (!getLength(storeTop_Normal)>0) {
		$('#ajglz_out').val('');
		$('#topsearch_note').html('请先全部计算_(:з」∠)_');
		return false;
	}
	
	var zip = new JSZip();
	$("#modes > option").each(function(){
		var modeName = $(this).val();
		if ($.inArray(modeName,auto_skip)<0) {
			$("#modes").val(modeName).change();
			calctop('all');
			var file_content = $('#ajglz_out').val();
			var file_name = $('#ajglz_filename').val();
			zip.file(file_name, file_content);
		}
	});
	var date2=new Date();
	$('#topsearch_note').html('计算完成-一键生成，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;');
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		saveAs(content, "3-DingPei.zip");
	});
}

function genLanRen(){
	var date1=new Date();
	var zip = new JSZip();
	chgDpMode(2);
	CreateReplace();
		var file_content = $('#ajglz_out').val();
		zip.file($('#ajglz_filename').val(), file_content);
		zip.file('LR_lasted.html', file_content);
	CreateJJC();
		var file_content = $('#ajglz_out').val();
		zip.file($('#ajglz_filename').val(), file_content);
		zip.file('LR_lasted_JJC.html', file_content);
	CreateLM6();
		var file_content = $('#ajglz_out').val();
		zip.file($('#ajglz_filename').val(), file_content);
		zip.file('LR_lasted_LM6.html', file_content);
	chgDpMode(3);
	calcTaskAddOld();
	calctopupd();	
		var file_content = $('#ajglz_out').val();
		zip.file($('#ajglz_filename').val(), file_content);
		zip.file('LR_GQ.html', file_content);
	var date2=new Date();
	$('#topsearch_note').html('计算完成-一键懒人，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;');
	zip.generateAsync({type:"blob"})
	.then(function(content) {
		saveAs(content, "11-LanRen.zip");
	});
}

//*******************************integrate with ruoly and top_update********************************//

function init_placeholder(){
	$('#newVer').attr('placeholder',lastVersion);
}

function CreateReplace() {
	var date1=new Date();
	var out=headerFrame('竞技场联盟新衣服替换('+valOrPh('newVer')+'～)', valOrPh('ajglz_staff2'), valOrPh('ajglz_date2'),0,0);
	out+='<span class="title3">使用说明：</span>表格列出的是排名前五的衣服。<font color="red">红色</font>表示新衣服为顶配，<font color="blue">蓝色</font>表示新衣服为次配，<font color=#8E4890>紫色</font>表示可能有<font color=#8E4890>连衣裙</font>>上下装或者<font color=#8E4890>上下装</font>>连衣裙的情况。</p>\n';
	out+='<p class="normal">本页内容：<a href="#1">竞技场</a>&emsp;<a href="#2">联盟六(极限权重)</a>&emsp;<a href="#3">联盟六(标准权重)</a></p>\n';
	impCart = searchVersion(valOrPh('newVer'));
	out+=calctopRep(5);
	out+=footer();
	$('#ajglz_filename').val('LR_'+valOrPh('newVer').replace(/\./g,'')+'.html');
	$('#ajglz_out').val(out);
	var date2=new Date();
	$('#topsearch_note').html('计算完成-竞技场联盟新衣服替换，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
}

function CreateJJC() {
	var date1=new Date();
	var out=headerFrame('竞技场简表(新衣服标注'+valOrPh('newVer')+'～)', valOrPh('ajglz_staff2'), valOrPh('ajglz_date2'),0,0);	
	out+='<span class="title3">使用说明：</span><font color="red">红色</font>表示新衣服为顶配，<font color="blue">蓝色</font>表示新衣服为次配。如没有部件时请到<a href="../../jingjichang.html">精修版</a>补充。</p>\n';
	impCart = searchVersion(valOrPh('newVer'));
	out+=calctopJJC(15, 5);
	out+=footer();
	$('#ajglz_filename').val('LR_'+valOrPh('newVer').replace(/\./g,'')+'_JJC.html');
	$('#ajglz_out').val(out);
	var date2=new Date();
	$('#topsearch_note').html('计算完成-竞技场简表，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
}

function CreateLM6() {
	var date1=new Date();
	var out=headerFrame('联盟六简表(新衣服标注'+valOrPh('newVer')+'～)', valOrPh('ajglz_staff2'), valOrPh('ajglz_date2'),0,0);	
	out+='<span class="title3">使用说明：</span><font color="red">红色</font>表示新衣服为顶配，<font color="blue">蓝色</font>表示新衣服为次配。如没有部件时请到<a href="../../lianmeng.html">精修版</a>补充。</p>\n';
	impCart = searchVersion(valOrPh('newVer'));
	out+=calctopLM6(15, 5);
	out+=footer();
	$('#ajglz_filename').val('LR_'+valOrPh('newVer').replace(/\./g,'')+'_LM6.html');
	$('#ajglz_out').val(out);
	var date2=new Date();
	$('#topsearch_note').html('计算完成-联盟六简表，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
}

function calctopJJC(nCount, nMin){
	storeTop = storeTopByCate(category, 2, nCount, []);
	var out = '<p class="normal">本页内容：';
	
	var ii = 0;
	for (var b in competitionsRaw){
		ii++;
		out+='<a href="#'+ii+'">' + b + '</a>&emsp;';
	}
	out += '</p>\n';
	
	ii = 0;
	for (var b in competitionsRaw){
		theme_name='竞技场: '+b;
		ii++;
		out += subtitle(theme_name, ii) +'\n';
		var out2 = calctopByTheme(theme_name, nMin);
		out += '<p class="center">顶配分数：'+out2[1]+'</p>';
		out += out2[0];
	}
	return out;
}

function calctopLM6(nCount, nMin){
	limitMode=1;
	storeTop = storeTopByCate(category, 5, nCount, []);
	var out = '<p class="normal">本页内容：<br>\n&emsp;极限权重：';
	
	var ii = 0;
	for (var b in tasksRaw){
		if (b.indexOf(strAlly6)==0){
			ii++;
			out+='<a href="#J'+ii+'">' + b.replace('联盟委托: ','') + '</a>&emsp;';
		}
	}
	out += '<br>\n&emsp;标准权重：';
	
	ii = 0;
	for (var b in tasksRaw){
		if (b.indexOf(strAlly6)==0){
			ii++;
			out+='<a href="#B'+ii+'">' + b.replace('联盟委托: ','') + '</a>&emsp;';
		}
	}
	out += '</p>\n';
	
	ii = 0;
	for (var b in tasksRaw){
		if (b.indexOf(strAlly6)==0){
			theme_name=b;
			ii++;
			out += subtitle('[极限] '+theme_name, 'J'+ii) +'\n';
			var out2 = calctopByTheme(theme_name, nMin);
			out += '<p class="center">理论极限分数：'+Math.round(out2[1]*1.2726)+'</p>';
			out += out2[0];
		}
	}
	
	limitMode=0;
	storeTop = storeTopByCate(category, 5, nCount, []);
	
	ii = 0;
	for (var b in tasksRaw){
		if (b.indexOf(strAlly6)==0){
			theme_name=b;
			ii++;
			out += subtitle('[标准] '+theme_name, 'B'+ii) +'\n';
			var out2 = calctopByTheme(theme_name, nMin);
			out += out2[0];
		}
	}
	return out;
}

function calctopByTheme(them, nMin){
	var out='<table border="1" width="100%">\n';
	out+=tr(td('部位', 'width="15%"')+td('顶配', 'width="25%"')+td('次配'));
	var scoreTop = 0;
	
	if (allThemes[them]) {
		inTop=[]; 
		for (var c in category) addTxtDoubByThemeCate(them, category[c], nMin);
		if (inTop.length > 0){
			var cell='';
			for (var r in inTop) {
				cell+=td(inTop[r][2]);
				cell+=td(inTop[r][0]);
				cell+=td(inTop[r][1]);
				out+=tr(cell);
				cell='';
				scoreTop += inTop[r][3];
			}
		}
	}
	out+='\n</table>\n';
	return [out, scoreTop];
}

function addTxtDoubByThemeCate(them, ctype, min){
	var cloList = [];
	for (var l in impCart) cloList.push(clothes[impCart[l]]);
	var resultList = get_storeTop_Cate(them, ctype);
	var txtSec='';
	var txtTop='';
	var scoreTop = 0;
	var isJin = 0;
	for (var r in resultList){
		if (resultList[r]) {
			var inList = $.inArray(resultList[r][0], cloList)>=0 ? 1 : 0;
			var srcs = '['+resultList[r][0].srcShort+']';
			var src = resultList[r][0].source;
			
			if (r>0 && resultList[r][1]<resultList[0][1]) {
				if (resultList[r][1] == resultList[r-1][1]) txtSec += ' = ';
				else txtSec += ' > ';
				if (inList == 1) txtSec += '<font color="blue">'+resultList[r][0].name + resultList[r][1] + srcs + '</font>';
				else txtSec += resultList[r][0].name + resultList[r][1] + srcs;			
			}else{
				var moveTopToSec = checkRealTop(them, r, resultList, min)[0];
				var prefix = r>0 ? ' = ' : '';
				if (inList == 1){
					if (!moveTopToSec) {
						txtTop += prefix + '<font color="red">' +resultList[r][0].name + resultList[r][1] + srcs + '</font>';
						scoreTop += resultList[r][1];
					}
					else txtSec += prefix + '<font color="blue">' +resultList[r][0].name + resultList[r][1] + srcs + '</font>';
				}else{
					if (!moveTopToSec) {
						txtTop += prefix + resultList[r][0].name + resultList[r][1] + srcs;
						scoreTop += resultList[r][1];
					}
					else txtSec += prefix + resultList[r][0].name + resultList[r][1] + srcs;
				}
			}
			var j = r*1+1;
			if (!resultList[j]) break;
			if (('/'+src).match(/\/[0-9]\-[0-9]+少/) || ('/'+src).match(/\/[0-9]\-[0-9]+公/) || src.indexOf('店·金') > -1 || src.indexOf('赠送') > -1)
				isJin = 1;
			if (isJin && j>=min && resultList[r][1]>resultList[j][1]) break;
		}
	}
	inTop.push([txtTop, txtSec, ctype, scoreTop]);
}

function calctopRep(nCount){
	var cartCates=[];
	for (var i in impCart) cartCates = addCates(cartCates, impCart[i]);
	cartCates = getDistinct(cartCates);
	limitMode=1;
	storeTop = storeTopByCate(cartCates, 10, nCount, []);
	
	var out=subtitle('竞技场', 1) + '\n';
	out+='<table border="1" width="100%">\n';
	out+=tr(td('关卡', 'width="15%"')+td('部位', 'width="15%"')+td('名称'));
	for (var b in competitionsRaw){
		theme_name='竞技场: '+b;
		out += outputRep(theme_name, nCount);
	}	
	out+='\n</table>\n';
	
	out+=subtitle('联盟第六章(极限权重, 顶配有效，次配数据仅做参考', 2) + '\n';
	out+='<table border="1" width="100%">\n';
	out+=tr(td('关卡')+td('部位')+td('名称', 'width="70%"'));
	for (var c in tasksRaw){
		theme_name=c;
		if (allThemes[theme_name]) out+=outputRep(theme_name, nCount);
	}	
	out+='\n</table>\n';
	
	limitMode=0;
	storeTop = storeTopByCate(cartCates, 5, nCount, []);
	
	out+=subtitle('联盟第六章(标准权重)', 3) + '\n';
	out+='<table border="1" width="100%">\n';
	out+=tr(td('关卡')+td('部位')+td('名称', 'width="70%"'));
	for (var c in tasksRaw){
		theme_name=c;
		if (allThemes[theme_name]) out+=outputRep(theme_name, nCount);
	}
	out+='\n</table>\n';
	
	return out;
}


function outputRep(them, nCount){
	var out = '';
	var rowspan=0;
	
	inTop=[]; inSec=[];	
	for (var c in category) addTxtPlainByThemeCate(them, category[c], nCount);
	rowspan += inTop.length + inSec.length;
	
	if (rowspan > 0){
		var cell=td(them.replace(/竞技场: /,''), 'rowspan="'+rowspan+'"');
		for (var r in inTop) {
			var tidx = inTop[r][0];						
			cell+=td(inTop[r][1]);
			cell+=td(inTop[r][0]);
			out+=tr(cell);
			cell='';	
		}
		for (var r in inSec) {
			var tidx = inSec[r][0];						
			cell+=td(inSec[r][1]);
			cell+=td(inSec[r][0]);
			out+=tr(cell);
			cell='';	
		}
	}
	return out;
}

function addTxtPlainByThemeCate(them, ctype, nCount){
	var cloList = [];
	for (var l in impCart) cloList.push(clothes[impCart[l]]);
	var resultList = get_storeTop_Cate(them, ctype);
	//resultList[r][0]=clothes, resultList[r][1]=clothes.sumScore
	var txt='';
	var isInTop = 0;
	var isInSec = 0;
	
	for (var r in resultList){
		if (resultList[r]) {
			var inList = $.inArray(resultList[r][0], cloList)>=0 ? 1 : 0;
			var srcs = '['+resultList[r][0].srcShort+']';
			
			if (r>0 && resultList[r][1]<resultList[0][1]) {
				if (resultList[r][1] == resultList[r-1][1]) txt += ' = ';
				else txt += ' > ';
				if (inList == 1){
					txt += '<font color="blue">'+resultList[r][0].name + resultList[r][1] + srcs + '</font>';
					if (!checkRealTop(them, r, resultList, nCount)[1]) isInSec = 1;
				}else txt += resultList[r][0].name + resultList[r][1] + srcs;
			}else if (r == 0 || inList == 1){
				var realTop = checkRealTop(them, r, resultList, nCount);
				if (r>0) txt += ' = ';
				else if (realTop[0]) txt += '<font color=#8E4890>' + realTop[2].replace(/[\[\]\\n\n0-9]+/g,'') + realTop[2].replace(/[^0-9]+/g,'') + '</font> > ';
				if (inList == 1){
					if (!realTop[0]) {
						txt += '<font color="red">' +resultList[r][0].name + resultList[r][1] + srcs + '</font>';
						isInTop = 1;
					}else if (!realTop[1]) {
						txt += '<font color="blue">' +resultList[r][0].name + resultList[r][1] + srcs + '</font>';
						isInSec = 1;
					}
				}else txt += resultList[r][0].name + resultList[r][1] + srcs;
			}else txt += ' = ' + resultList[r][0].name + resultList[r][1] + srcs;
		}
	}
	
	if (isInTop) inTop.push([txt, ctype]);
	else if (isInSec) inSec.push([txt, ctype]);
}

function calctopupd(){
	var date1=new Date();
	verifyNum('showCnt2');
	verifyNum('showScore');
	var showScore = parseInt($("#showScore").val());
	var caltype = ($('#showJJC2').is(":checked")?2:1) * ($('#showAlly2').is(":checked")?3:1) * ($('#showAlly62').is(":checked")?5:1) * ($('#showNormal2').is(":checked")?7:1);
	if (caltype == 1){
		$('#alert_msg_update').html('至少选一种关卡_(:з」∠)_');
	}else{
		clearOutput();
		check_tasksAdd_old();
		limitMode = 1;
		storeTop = storeTopByCate(category, caltype, $("#showCnt2").val(), []);
		limitMode = 3;
		storeTop_old = storeTopByCate(category, caltype, 1, searchVersion(valOrPh('newVer')));
		$('#ajglz_filename').val('LR_GQ-'+valOrPh('newVer').replace(/\./g,'')+'.html');
		var out = headerFrame('关卡极限分数更新('+valOrPh('newVer')+'～)', valOrPh('ajglz_staff2'), valOrPh('ajglz_date2'),1,0);
		out+='<span class="title3">使用说明：</span>分差根据上一版本和此版本的极限顶配分数计算（饰品分数已按带满衰减），'+(showScore>0? '只显示分差'+showScore+'以上的关卡，' : '')+'方便查看哪些关卡的理论分数更新最多，仅作为参考用。<br>\n';
		out+='</p>';
		out+='<p class="normal">本页内容：';
		if($('#showNormal2').is(":checked")) out+='&emsp;<a href="#7">主线关卡</a>';
		if($('#showAlly2').is(":checked")) out+='&emsp;<a href="#3">联盟委托</a>';
		else if ($('#showAlly62').is(":checked")) out+='&emsp;<a href="#5">联盟委托</a>';
		if($('#showJJC2').is(":checked")) out+='&emsp;<a href="#2">竞技场</a>';
		out+=compByTheme(caltype).replace(/\n/g,'\\n').replace(/<table/g,'<table style="width:100%;table-layout:fixed;"');
		out+=footer();
		$('#ajglz_out').val(out);
		var date2=new Date();
		$('#topsearch_note').html('计算完成-关卡极限分数更新，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
	}
}

function calcTaskAddOld(){
	tasksAdd_old = {};
	var date1=new Date();
	var ids = searchVersion(valOrPh('newVer'));
	for (var c in tasksRaw){
		theme_name=c;
		if (allThemes[theme_name]) {
			setFilters(allThemes[theme_name]);
			tasksAdd_old[theme_name] = genLimitExc(ids);
		}
	}
	for (var d in levelsRaw){
		theme_name='关卡: '+d;
		if (allThemes[theme_name]) {
			setFilters(allThemes[theme_name]);
			tasksAdd_old[theme_name] = genLimitExc(ids);
		}
	}
	var date2=new Date();
	$('#topsearch_note').html('计算完成-旧极限，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;');
}