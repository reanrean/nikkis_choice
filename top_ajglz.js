function init_top(){
	enterKey();
	gen_setList();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	addCartNum();
	init_passcode();
	searchMode();
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

function verify(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		$("#p_passcode").hide();
		$("#p_content").show();
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
	if($('#searchMode').html()=='来源'){
		$('#searchMode').html('名称');
		$('#searchMode').removeClass('btn-info');
		$('#searchMode').addClass('btn-success');
		$('#textBox').attr('placeholder','套装/名称/类别');
	}else{
		$('#searchMode').html('来源');
		$('#searchMode').removeClass('btn-success');
		$('#searchMode').addClass('btn-info');
		$('#textBox').attr('placeholder','来源/类别');
	}
}

function searchById(txt){
	if(txt) {var searchById=txt;}
	else {var searchById=$.trim($("#textBox").val());}
	currentList=[];
	currentSetList=[];
	if(searchById){
		var out='<table border="1">';
		out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
		
		if($('#searchMode').html()=='来源'){
			for (var i in clothes){
				if (searchById=='*'){
					currentList.push(i);
				}else if(searchById.indexOf('*')>-1){
					var searchArr=searchById.split('*');
					for (m=0;m<searchArr.length;m++){
						if (searchArr[m]=='套装'){
							if(!clothes[i].set) {break;}
						}else if (searchArr[m]=='非套装'){
							if(clothes[i].set) {break;}
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
							if(clothes[i].source.indexOf(searchArr[m])<0&&clothes[i].type.type.indexOf(searchArr[m])<0){break;}
						}
						if (m==searchArr.length-1) {currentList.push(i);}
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
				}else if(searchById.indexOf('*')>-1){
					var searchArr=searchById.split('*');
					for (m=0;m<searchArr.length;m++){
						if(searchArr[m]!=''&&clothes[i].name.indexOf(searchArr[m])<0&&clothes[i].type.type.indexOf(searchArr[m])<0){break;}
						if (m==searchArr.length-1) {currentList.push(i);}
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
			if (searchById!='*') {out1+='　'+ahref('查找所有染色及进化',"searchSub(0,"+"'"+searchById+"')");}
		}
		else {$("#topsearch_info").html('没有找到相关资料');}
		$("#topsearch_note").html(out1);
	}
}

function calctop(){
	var date1=new Date();
	if (isNaN(parseInt($("#showCnt").val())) || $("#showCnt").val()<1) {$("#showCnt").val(1);}
	$("#showCnt").val(parseInt($("#showCnt").val()));
	if (isNaN(parseInt($("#maxHide").val())) || $("#maxHide").val()<1) {$("#maxHide").val(1);}
	$("#maxHide").val(parseInt($("#maxHide").val()));
	
	if (!($('#showJJC').is(":checked")||$('#showAlly').is(":checked")||$('#showNormal').is(":checked"))){
		$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
	}else{
			var err=0;
			for(var l=0;l<cartNum;l++){
				if(cartList[l].length==0) {err=1; break;}
			}
			if (err){
				$('#alert_msg').html('有选取列表为空_(:з」∠)_');
			}else{
				$('#alert_msg').html('');
				$('#topsearch_info').html('');
				$('#topsearch_note').html('');
				var indexes='本页内容：';
				var topsearch_info='';
				for(var l=0;l<cartNum;l++){
					var listname=($('#cartName'+(l+1)).val() ? $('#cartName'+(l+1)).val() : $('#cartName'+(l+1)).attr('placeholder'));
					limitMode=0;
					storeTopByCate_all(l);
					topsearch_info+=('<a id="'+(l+1)+'"></a>');
					topsearch_info+=('<p class="title2">'+listname+'</p><span class="norm">'+calctop_byall(l).replace(/\n/g,'&NewLine;')+'</span>');
					limitMode=1;
					storeTopByCate_all(l);
					topsearch_info+=('<span class="limit">'+calctop_byall(l).replace(/\n/g,'&NewLine;')+'</span>');
					
					indexes+=('&emsp;<a href="#'+(l+1)+'">'+listname+'</a>');
				}
				if ($('#hideNores').is(":checked")){indexes+='<br>注：本页只显示顶配/高配部件。'}
				$('#ajglz_out').val(header()+indexes+middle()+topsearch_info+footer());
				var date2=new Date();
				$('#topsearch_note').html('计算完成，用时'+((date2-date1)/1000).toFixed(2)+'秒&#x1f64a;<br>↓↓下方复制代码哦↓↓');
			}
		}
	//$('#topsearch_info').css("margin-bottom",($("#showCnt").val()*20+50)+"px");
}

function calctop_byall(cartList_num){
	//***modified from top.js, rmb to update if it is changed in top.js***
	if ($('#showJJC').is(":checked")){var showJJC=1;}
	else{var showJJC=0;}
	if ($('#showAlly').is(":checked")){var showAlly=1;}
	else{var showAlly=0;}
	if ($('#showNormal').is(":checked")){var showNormal=1;}
	else{var showNormal=0;}
	if($('#showSource').is(":checked")){var showSource=1;}
	else{var showSource=0;}
	if($('#showMerc').is(":checked")){var showMerc=1;}
	else{var showMerc=0;}
	var out='<table border="1" class="calcByAll'+((showMerc||showSource)?' calcSrc':'')+'">';
	out+=tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('顶配')+(showJJC?td('竞技场'):'')+(showAlly?td('联盟'+(limitMode?'(极限)':'')):'')+(showNormal?td('关卡'+(limitMode?'(极限)':'')):''));
	for (var c in category){//sort by category
		for (var i in cartList[cartList_num]){
			id=cartList[cartList_num][i];
			if(clothes[id].type.type!=category[c]){continue;}
			calctop_byid(id);
			var rowspan=1;
			if(inTop.length>0 && inSec.length>0) {rowspan++;}
			
			var cell_tag='';
			if(clothes[id].simple[0]) {cell_tag+='简'+clothes[id].simple[0];}
			if(clothes[id].simple[1]) {cell_tag+='华'+clothes[id].simple[1];}
			if(clothes[id].active[0]) {cell_tag+='|活'+clothes[id].active[0];}
			if(clothes[id].active[1]) {cell_tag+='|雅'+clothes[id].active[1];}
			if(clothes[id].cute[0]) {cell_tag+='|可'+clothes[id].cute[0];}
			if(clothes[id].cute[1]) {cell_tag+='|成'+clothes[id].cute[1];}
			if(clothes[id].pure[0]) {cell_tag+='|纯'+clothes[id].pure[0];}
			if(clothes[id].pure[1]) {cell_tag+='|性'+clothes[id].pure[1];}
			if(clothes[id].cool[0]) {cell_tag+='|凉'+clothes[id].cool[0];}
			if(clothes[id].cool[1]) {cell_tag+='|暖'+clothes[id].cool[1];}
			if(clothes[id].tags[0]) {cell_tag+='\n'+clothes[id].tags.join(',');}
			
			var cell=td(addTooltip(clothes[id].name,cell_tag),'rowspan="'+rowspan+'" class="normTip"');
			cell+=td(clothes[id].type.type,'rowspan="'+rowspan+'"');
			if(showSource||showMerc){
				var cell_3rd='';
				if(showSource){
					var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
					srcs=conv_source(srcs,'定',clothes[id].type.mainType);
					cell_3rd=srcs;
				}
				if(showMerc){
					var price=getMerc(id);
					cell_3rd=(price?price:cell_3rd);
				}
				cell+=td(cell_3rd,'rowspan="'+rowspan+'"');
			}
			if(inTop.length>0){
				cell+=td('顶配');
				cell+=(showJJC?td(retTopTd(inTop,'竞技场',id,cartList_num)):'');
				cell+=(showAlly?td(retTopTd(inTop,'联盟',id,cartList_num)):'');
				cell+=(showNormal?td(retTopTd(inTop,'关卡',id,cartList_num)):'');
				out+=tr(cell,'class="top"');
			}
			if(inSec.length>0){
				if(inTop.length>0){cell='';}
				cell+=td('高配');
				cell+=(showJJC?td(retTopTd(inSec,'竞技场',id,cartList_num)):'');
				cell+=(showAlly?td(retTopTd(inSec,'联盟',id,cartList_num)):'');
				cell+=(showNormal?td(retTopTd(inSec,'关卡',id,cartList_num)):'');
				out+=tr(cell);
			}
			if(inTop.length==0 && inSec.length==0 && !($('#hideNores').is(":checked"))){
				out+=tr(cell+td('-')+(showJJC?td(''):'')+(showAlly?td(''):'')+(showNormal?td(''):''));
			}
		}
	}
	out+='</table>';
	return out;
}

function clear_textarea(){
	$('#ajglz_out').val('');
}

function storeTopByCate_all(l){
	var cartCates=[];
	for (var i in cartList[l]){
		cartCates.push(clothes[cartList[l][i]].type.type);
		if($.inArray(clothes[cartList[l][i]].type.type, ['连衣裙','上装','下装'])>-1){
			cartCates.push('连衣裙');
			cartCates.push('上装');
			cartCates.push('下装');
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
		if(newArr[i]!=id) {cartList[n].push(newArr[i]);}
	}
	refreshCart(n);
}

function header(){
 var h='<!DOCTYPE html>';
	h+='<head>';
	h+='<meta name="viewport" content="width=device-width, initial-scale=1"/>';
	h+='<meta http-equiv="Content-Type" content="text/html"; charset=utf-8" />';
	h+='<link rel="stylesheet" type="text/css" href="../../css/style.css" />';
	h+='<link rel="stylesheet" type="text/css" href="dp-style.css" />';
	h+='<script type="text/javascript" src="dp.js"></script>';
	h+='</head>';
	h+='<body>';
	h+='<div class="myframe">';
	h+='<p class="title1">';
	h+=$('#ajglz_title').val() ? $('#ajglz_title').val() : $('#ajglz_title').attr('placeholder');
	h+='</p>';
	h+='<hr class="mhr"/>';
	h+='<p class="normal"><span class="title3">更新时间：</span>';
	var d=new Date();
	h+=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	h+='<br>';
	h+='<span class="title3">更新人员：</span>';
	h+=$('#ajglz_staff').val() ? $('#ajglz_staff').val() : $('#ajglz_staff').attr('placeholder');
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
	return '<a href="" tooltip="'+tooltip+'" class="aTooltip">'+text+'</a>';
}
