function init_top(){
	enterKey();
	gen_setList();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	addCartNum();
	init_passcode();
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

function calctop(){
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
					topsearch_info+=('<p class="title2">'+listname+'</p><span class="norm">'+calctop_byall(l)+'</span>');
					limitMode=1;
					storeTopByCate_all(l);
					topsearch_info+=('<span class="limit">'+calctop_byall(l)+'</span>');
					
					indexes+=('&emsp;<a href="#'+(l+1)+'">'+listname+'</a>');
				}
				$('#ajglz_out').val(header()+indexes+middle()+topsearch_info.replace(/\n/g,"\\n")+footer());
				$('#topsearch_note').html('&emsp;&#x1f64a;计算完成&#x1f64a;<br>↓↓下方复制代码↓↓');
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
			
			var cell=td(clothes[id].name,'rowspan="'+rowspan+'" class="inName'+(inTop.length>0?' haveTop':'')+'"');
			cell+=td(clothes[id].type.type,'rowspan="'+rowspan+'" class="inName'+(inTop.length>0?' haveTop':'')+'"');
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
				cell+=td(cell_3rd,'rowspan="'+rowspan+'" class="inName'+(inTop.length>0?' haveTop':'')+'"');
			}
			if(inTop.length>0){
				cell+=td('顶配','class="inTop"');
				cell+=(showJJC?td(retTopTd(inTop,'竞技场',id,cartList_num),'class="inTop"'):'');
				cell+=(showAlly?td(retTopTd(inTop,'联盟',id,cartList_num),'class="inTop"'):'');
				cell+=(showNormal?td(retTopTd(inTop,'关卡',id,cartList_num),'class="inTop"'):'');
				out+=tr(cell);
			}
			if(inSec.length>0){
				if(inTop.length>0){cell='';}
				cell+=td('高配','class="inSec"');
				cell+=(showJJC?td(retTopTd(inSec,'竞技场',id,cartList_num),'class="inSec"'):'');
				cell+=(showAlly?td(retTopTd(inSec,'联盟',id,cartList_num),'class="inSec"'):'');
				cell+=(showNormal?td(retTopTd(inSec,'关卡',id,cartList_num),'class="inSec"'):'');
				out+=tr(cell);
			}
			if(inTop.length==0 && inSec.length==0 && !($('#hideNores').is(":checked"))){
				out+=tr(cell+td('-','class="inNone"')+(showJJC?td('','class="inNone"'):'')+(showAlly?td('','class="inNone"'):'')+(showNormal?td('','class="inNone"'):''));
			}
		}
	}
	out+='</table>';
	return out;
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
