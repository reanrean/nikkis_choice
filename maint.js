var wname=[wardrobe,wardrobe_i,wardrobe_s];
var wowner=['rean','ivangift','seal100x'];

var rows=0;
var field_desc=['名字','分类','编号','心级',
	'华丽','简约','优雅','活泼','成熟','可爱','性感','清纯','清凉','保暖',
	'tag','来源','套装'];

function show(){
	var pass='d0be2dc421be4fcd0172e5afceea3970e2f3d940';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		go();
	}else{
		$("#info").html('&#x1f64a&#x1f64a&#x1f64a&#x1f64a&#x1f64a');
	}
}

function go(){
	var menu='<table width=50%>';
	var line=td('<a href="#" onclick=go_comp() ><b>Compare</b></a>');
		line+=td('<a href="#" onclick=go_add() ><b>Add</b></a>');
	menu+=tr(line);
	$("#menu").html(menu);
	$("#info").html('');
	$("#extra").html('');
}

function go_comp(){
	rows=0;
	var cnt=[];
	for (var j in wname){
		cnt[j]=0;
		for(var i in wname[j]){
			cnt[j]++;
		}
	}
	var max=0;
	var list='Count ';
	for (var j in wname){
		list+=wowner[j]+':'+cnt[j]+' ';
		if (cnt[j]>max) {max=cnt[j];}
	}
	
	var str=[];
	for (var i in wname){
		str[i]=[];
	}
	for(var i=0;i<max;i++){//assign values into str[] from wardrobe
		for (var j in wname){
			if(wname[j][i]){
				str[j][i]=wname[j][i][0]+'/'+wname[j][i][1].substr(0,1);
				for (var p=2;p<=14;p++){
					str[j][i]+='/'+wname[j][i][p];
				}
				str[j][i]+='/'+wname[j][i][16];
			}else{
				str[j][i]='';
			}
		}
	}
	var out='<table>';
	out+=tr(td(list));
	out+=tr(td('<hr>'));
	for(var i=1;i<wname.length;i++){//compare [0] with others
		out+=tr(td("Extra values in "+wowner[0]+"'s wardrobe VS "+wowner[i]+"'s:"));
		out+=tr(td(compare(str[0],str[i],'<br/>')));
		out+=tr(td('<hr>'));
		out+=tr(td("Extra values in "+wowner[i]+"'s wardrobe VS "+wowner[0]+"'s:"));
		out+=tr(td(compare(str[i],str[0],'<br/>')));
		out+=tr(td('<hr>'));
	}
	out+='</table>';
	
	$("#info").html(out);
	$("#extra").html('');
}

function go_add(){
	var form='<table id="go_add"><tbody>';
	var line='';
	for (var i in field_desc){
		line+=td(field_desc[i]);
	}
	form+=tr(line);
	form+='</tbody></table>';
	
	form+='<table>';
	line=td(button('Add',"add()"));
	line+=td(button('Del',"del()"));
	line+=td(button('Validate',"validWardrobe()"));
	line+=td(button('Generate',"genWardrobe()"));
	form+=tr(line);
	form+='</table>';
	
	$("#info").html(form);
	
	add();
}

function add(){
	rows++;
	var line='';
	for (var i=1;i<=field_desc.length;i++){
		line+=td('<input id="in'+rows+'_'+i+'" size="'+((i==1||i==2||i==15)?5:2)+'">');
	}
	$('#go_add > tbody:last-child').append(tr(line));
	arrowKey();
}

function del(){
	if(rows>1){
		rows--;
		$('#go_add tbody tr:last').remove();
	}
}

function genWardrobe(){
	var out='';
	for(var j=1;j<=rows;j++){
		out+='  [';
		for (var i=1;i<=17;i++){
			out+="'"+$('#in'+j+'_'+i).val()+"'"+(i==17?'':',');
		}
		out+='],<br/>';
	}
	$("#extra").html(out);
}

function validWardrobe(){
	var out='';
	var extra='';
	var chk1=[1,2,3,4,16];
	var chk2=[6,8,10,12,14];
	var prop=['SSS','SS','S','A','B','C',''];
	for(var j=1;j<=rows;j++){
		var head=(j==1? '':'<br/>')+'row'+j+'('+$('#in'+j+'_1').val()+'): '
		var check=[];
		var cont='';
		for (var i=1;i<=field_desc.length;i++){
			check[i]=$('#in'+j+'_'+i).val();
			if((jQuery.inArray(i, chk1)>-1)&&(!check[i])) {cont+=field_desc[i-1]+'null, ';}
			if(jQuery.inArray(i, chk2)>-1){
				if(check[i]&&check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'both, ';}
				else if(!check[i]&&!check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'null, ';}
				else if(jQuery.inArray(check[i], prop)<0){cont+=field_desc[i-1]+'invalid, ';}
				else if(jQuery.inArray(check[i-1], prop)<0){cont+=field_desc[i-2]+'invalid, ';}
			}
			if(i==2&&check[i]&&jQuery.inArray(check[i], category)<0) {cont+=field_desc[i-1]+'invalid, ';}
			if(i==3&&check[i]&&isNaN(parseInt(check[i]))) {cont+=field_desc[i-1]+'invalid, ';}
		}
		if(cont){out+=head+cont;}
	}
	$("#extra").html(out);
}

function compare(a,b,split){//a contains but b not
	var out='';
	for(var i=0;a[i];i++){
		if (jQuery.inArray(a[i], b)<0) {out+=a[i]+split;}
	}
	return out;
}

function arrowKey() {
$('input').keydown(function(e) {
    if (e.keyCode==39) {
		if(this.value.length==this.value.slice(0, this.selectionStart).length){
        $(this).parent().next().find('input').focus();
		}
    }
    if (e.keyCode==37) {
        if(this.value.slice(0, this.selectionStart).length==0){
        //$(this).prev('input').focus();
        $(this).parent().prev().find('input').focus();
		}
    }
});
}

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function button(text,onclick){
	return '<button onclick="'+onclick+'">'+text+'</button>'
}
