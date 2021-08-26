var rows=0;
var field_desc=['名字','分类','编号','心级',
	'华丽','简约','优雅','活泼','成熟','可爱','性感','清纯','清凉','保暖',
	'tag','来源','套装','版本','短来源','动作'];
//var skip_comp=['来源'];
var skip_comp=[];

function show(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		go();
	}else{
		$("#menu").html('');
		$("#info").html('&#x1f64a&#x1f64a&#x1f64a&#x1f64a&#x1f64a');
		$("#extra").html('');
	}
}

function go(){
	var menu='<table width=100% style="table-layout: fixed; font-weight:bold;">';
	var line=td(ahref('EncWardrobe','go_encw()'));
		line+=td(ahref('DecWardrobe','go_decw()'));
		line+=td(ahref('Data','go_static()'));
		line+=td(ahref('GenId','go_genid()'));
		line+=td(ahref('Add','go_add()'), 'style="color: lightgrey;"');
		line+=td(ahref('Source','go_src()'), 'style="color: lightgrey;"');
		line+=td('<a href="hs-rean.html" target="_blank">HSLevel</a>', 'style="color: lightgrey;"');
	menu+=tr(line);
	$("#menu").html(menu);
	$("#info").html('');
	$("#extra").html('');
}

function go_encw(){
    var dlcontent = "var category = ['" + category.join("','") + "'];\n";
    dlcontent += "var skipCategory = [" + (skipCategory.length>0 ? "'" + skipCategory.join("','") + "'" : '' )+ "];\n";
    dlcontent += "var repelCates = [";
    for (var i in repelCates) dlcontent += "['" + repelCates[i].join("','") + "'],";
    dlcontent += '];\n';

    var cat2code = {}, code2cat = {};
    for (var i in category) {
        cat2code[category[i]] = num2code(i);
        code2cat[num2code(i)] = category[i];
    }
    
    var tagcnt = 0, tag2code = {}, code2tag = [];
    var suitcnt = 0, suit2code = {}, code2suit = [];
    var vercnt = 0, ver2code = {}, code2ver = [];
    var srccnt = 0, src2code = {}, code2src = [];
    var ssrccnt = 0, ssrc2code = {}, code2ssrc = [];
    for (var i in wardrobe1) {
        //tag (exclude'+')
        var tagstr = wardrobe1[i][$.inArray('tag', field_desc)];
        if (tagstr != '' && tagstr.indexOf('+') < 0) {
            var tags = tagstr.split('/');
            if (tags[0]) {
                if (!tag2code[tags[0]]) {
                    tag2code[tags[0]] = num2code(tagcnt);
                    code2tag.push(tags[0]);
                    tagcnt++;
                }
            }
            if (tags[1]) {
                if (!tag2code[tags[1]]) {
                    tag2code[tags[1]] = num2code(tagcnt);
                    code2tag.push(tags[1]);
                    tagcnt++;
                }
            }
        }
        
        //suit
        var suitstr = wardrobe1[i][$.inArray('套装', field_desc)];
        if (suitstr && suitstr.indexOf('·套')<0 && suitstr.indexOf('·染')<0 && suitstr.indexOf('·基')<0) {
            if (!suit2code[suitstr]) {
                suit2code[suitstr] = num2code(suitcnt);
                code2suit.push(suitstr);
                suitcnt++;
            }
        }
        
        //ver
        var verstr = wardrobe1[i][$.inArray('版本', field_desc)];
        if (verstr) {
            if (!ver2code[verstr]) {
                ver2code[verstr] = num2code(vercnt);
                code2ver.push(verstr);
                vercnt++;
            }
        }
        
        //ssrc
        var ssrcstr = wardrobe1[i][$.inArray('短来源', field_desc)].replace(/^套·/, '');
        if (ssrcstr) {
            if (!ssrc2code[ssrcstr]) {
                ssrc2code[ssrcstr] = num2code(ssrccnt);
                code2ssrc.push(ssrcstr);
                ssrccnt++;
            }
        }
        
        //src (exclude list below)
        var srcstr = wardrobe1[i][$.inArray('来源', field_desc)];
        if (srcstr) {
            var srcs = srcstr.split('/');
            for (var j in srcs) {
                if (srcs[j].indexOf('公') == srcs[j].length-1) continue;
                if (srcs[j].indexOf('少') == srcs[j].length-1) continue;
                if (srcs[j].indexOf('设·定')==0) continue;
                if (srcs[j].indexOf('设·进')==0) continue;
                if (srcs[j].indexOf('梦境·')==0 && srcs[j]!='梦境·浮梦岛') continue;
                if (srcs[j].indexOf('套装·')==0) continue;
                if (srcs[j].indexOf('剧情')==0) continue;
                if (srcs[j].indexOf('故宫-')==0) continue;
                
                if (!src2code[srcs[j]]) {
                    src2code[srcs[j]] = num2code(srccnt);
                    code2src.push(srcs[j]);
                    srccnt++;
                }
            }
        }
    }
    
    dlcontent += "var code2tag = ['" + code2tag.join("','") + "'];\n";
    dlcontent += "var code2suit = ['" + code2suit.join("','") + "'];\n";
    dlcontent += "var code2ver = ['" + code2ver.join("','") + "'];\n";
    dlcontent += "var code2src = ['" + code2src.join("','") + "'];\n";
    dlcontent += "var code2ssrc = ['" + code2ssrc.join("','") + "'];\n";
    
    codewardrobe = [];
    dlcontent += "var codewardrobe = [\n";
    for (var i in wardrobe1) {
        //套:* 染:@ 基:! 梦境:~
        var w = wardrobe1[i];
        var wstr = w[0] + '|';
        wstr += cat2code[w[1]] + num2code(w[2]) + '|';
        if (w[19]) wstr += '*';
        wstr += stat2code(w[3], stat2num(w[4],w[5]), stat2num(w[6],w[7]), stat2num(w[8],w[9]), stat2num(w[10],w[11]), stat2num(w[12],w[13])) + '|';
        if (w[14]){
            if (w[14].indexOf('+') >= 0) wstr += w[14];
            else {
                var tags = w[14].split('/');
                if (tags[0]) wstr += tag2code[tags[0]];
                if (tags[1]) wstr += tag2code[tags[1]];
            }
        }
        wstr += '|';
        if (w[16]) {
            if (suit2code[w[16]]) wstr += suit2code[w[16]];
            else if (w[16].indexOf('·套')>0) wstr += '*' + suit2code[w[16].replace(/·套/, "")];
            else if (w[16].indexOf('·染')>0) wstr += '@' + suit2code[w[16].replace(/·染/, "")];
            else if (w[16].indexOf('·基')>0) wstr += '!' + suit2code[w[16].replace(/·基/, "")];
            else wstr += w[16];
        }
        wstr += '|';
        wstr += (ver2code[w[17]] ? ver2code[w[17]] : w[17]) + '|';
        var w15 = w[15].split('/'), w15c = [];
        for (var j in w15) {
            if (src2code[w15[j]]) w15c.push(src2code[w15[j]]);
            else if (w15[j].indexOf('套装·') == 0) w15c.push('*' + suit2code[w15[j].replace(/套装·/, '')]);
            else if (w15[j].indexOf('设·定') == 0) w15c.push('@' + num2code(w15[j].replace(/设·定/,'')));
            else if (w15[j].indexOf('设·进') == 0) w15c.push('!' + num2code(w15[j].replace(/设·进/,'')));
            else if (w15[j].indexOf('梦境·') == 0) w15c.push('~' + w15[j].replace(/梦境·/,''));
            else w15c.push(w15[j]);
        }
        wstr += w15c.join('/') + '|';
        if(w[18]) {
            var pref = w[18].indexOf('套·') == 0 ? '*' : '';
            var suf = w[18].replace(/^套·/, '');
            wstr += (ssrc2code[suf] ? pref + ssrc2code[suf] : w[18]);
        }
        codewardrobe.push(wstr);
        wstr = "'" + wstr + "',\n";
        dlcontent += wstr;
    }
    dlcontent += "];\n\n";
    
    var codes = "var wardrobe = function() {\n";
    codes += "    var ret = [];\n";
    codes += "    for (var i in codewardrobe) {\n";
    codes += "        var item = [];\n";
    codes += "        var w = codewardrobe[i].split('|');\n";
    codes += "        item.push(w[0]);\n";
    codes += "        item.push(category[code2num(w[1].charAt(0))]);\n";
    codes += "        item.push(numberToInventoryId(code2num(w[1].substr(1))));\n";
    codes += "        item = item.concat(code2stat(w[2].charAt(0)=='*' ? w[2].substr(1) : w[2]));\n";
    codes += "        if (w[3] == '' || w[3].indexOf('+')>0) item.push(w[3]);\n";
    codes += "        else item.push(code2tag[code2num(w[3].charAt(0))] + (w[3].length > 1 ? '/' + code2tag[code2num(w[3].charAt(1))] : '' ));\n";
    codes += "        var w6s = w[6].split('/'), srcs = [];\n";
    codes += "        for (var s in w6s) {\n";
    codes += "            if (w6s[s].charAt(0) == '*') srcs.push('套装·' + code2suit[code2num(w6s[s].substr(1))]);\n";
    codes += "            else if (w6s[s].charAt(0) == '@') srcs.push('设·定' + numberToInventoryId(code2num(w6s[s].substr(1))));\n";
    codes += "            else if (w6s[s].charAt(0) == '!') srcs.push('设·进' + numberToInventoryId(code2num(w6s[s].substr(1))));\n";
    codes += "            else if (w6s[s].charAt(0) == '~') srcs.push('梦境·' + w6s[s].substr(1));\n";
    codes += "            else if (iscode(w6s[s])) srcs.push(code2src[code2num(w6s[s])]);\n";
    codes += "            else srcs.push(w6s[s]);\n";
    codes += "        }\n";
    codes += "        item.push(srcs.join('/'));\n";
    codes += "        if (w[4] == '') item.push('');\n";
    codes += "        else if (w[4].charAt(0) == '*') item.push(code2suit[code2num(w[4].substr(1))] + '·套');\n";
    codes += "        else if (w[4].charAt(0) == '@') item.push(code2suit[code2num(w[4].substr(1))] + '·染');\n";
    codes += "        else if (w[4].charAt(0) == '!') item.push(code2suit[code2num(w[4].substr(1))] + '·基');\n";
    codes += "        else item.push(code2suit[code2num(w[4])]);\n";
    codes += "        item.push(code2ver[code2num(w[5])]);\n";
    codes += "        item.push(w[7].charAt(0)=='*' ? '套·' + code2ssrc[code2num(w[7].substr(1))] : code2ssrc[code2num(w[7])]);\n";
    codes += "        item.push(w[2].charAt(0)=='*' ? '1' : '');\n";
    codes += "        ret.push(item);\n";
    codes += "    }\n";
    codes += "    return ret;\n";
    codes += "}();\n";

    codes += "function letter2num(s) {\n";
    codes += "    var charcode = s.charCodeAt(0);\n";
    codes += "    if (charcode <= 57) return charcode - 48;\n";
    codes += "    else if (charcode <= 90) return charcode - 55;\n";
    codes += "    else return charcode - 61;\n";
    codes += "}\n";

    codes += "function code2num(s) {\n";
    codes += "    var len = s.length;\n";
    codes += "    var num = 0;\n";
    codes += "    for (var i = 0; i<len; i++) num = 62 * num + letter2num(s.charAt(i));\n";
    codes += "    return num;\n";
    codes += "}\n";

    codes += "function code2stat(s) {\n";
    codes += "    var num2stat = ['C|', 'B|', 'A|', 'S|', 'SS|', 'SSS|', '|C', '|B', '|A', '|S', '|SS', '|SSS'];\n";
    codes += "    var ret = [];\n";
    codes += "    var num = code2num(s);\n";
    codes += "    for (var i = 0; i < 5; i++) {\n";
    codes += "        ret = ret.concat(num2stat[num % 12].split('|'));\n";
    codes += "        num = Math.floor(num / 12);\n";
    codes += "    }\n";
    codes += "    ret.unshift(num.toString());\n";
    codes += "    return ret;\n";
    codes += "}\n";

    codes += "function numberToInventoryId(s) {\n";
    codes += "    if (s < 10) return '00' + s;\n";
    codes += "    if (s < 100) return '0' + s;\n";
    codes += "    else return s.toString();\n";
    codes += "}\n";

    codes += "function iscode(s) {\n";
    codes += "    for (var i = 1; i < s.length; i++) {\n";
    codes += "        c = s.charCodeAt(i);\n";
    codes += "        if (!(c==33 || c==42 || (c>=48&&c<=57) || (c>=64&&c<=90) || (c>=97&&c<=122))) return false;\n";
    codes += "    }\n";
    codes += "    return true;\n";
    codes += "}\n";
    
    dlcontent += codes;
    dlcontent += "var wardrobe_lastupd = '" + wardrobe_lastupd + "';";
    
    var file_content = dlcontent;
    var file_name = 'wardrobe.js';
    var blob = new Blob([file_content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, file_name);
}

function num2letter(i) {
    //0-48, 9-57, A-65(10), Z-90(35), a-97(36), z-122(61); 26+26+10=62
    if (i >= 62 || i <= 0)  return '0';
    else if (i < 10) return i;
    else if (i <= 35) return String.fromCharCode(i + 55);
    else return String.fromCharCode(i + 61);
}

function num2code(i) {
    var ret = '';
    if (i < 0) return ret;
    do {
        ret = num2letter(i % 62) + ret;
        i = Math.floor(i / 62);
    } while (i > 0);
    return ret;
}

function stat2num(stat1, stat2) {
    switch(stat1) {
        case 'C':
            return 0;
        case 'B':
            return 1;
        case 'A':
            return 2;
        case 'S':
            return 3;
        case 'SS':
            return 4;
        case 'SSS':
            return 5;
    }
    switch(stat2) {
        case 'C':
            return 6;
        case 'B':
            return 7;
        case 'A':
            return 8;
        case 'S':
            return 9;
        case 'SS':
            return 10;
        case 'SSS':
            return 11;
    }
    return 0;
}

//LSB = first stats, MSB = star
function stat2code(star, num1, num2, num3, num4, num5) {
    var num = star;
    num = num * 12 + num5;
    num = num * 12 + num4;
    num = num * 12 + num3;
    num = num * 12 + num2;
    num = num * 12 + num1;
    return num2code(num);
}

function go_decw(){
    var dlcontent = "var wardrobe1 = [\n";
    for(var i in wardrobe) {
        dlcontent += "  ['" + wardrobe[i].join("','") + "'],\n";
    }
    dlcontent += '];';
    var file_content = dlcontent;
    var file_name = 'wardrobe1.js';
    var blob = new Blob([file_content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, file_name);
}

/*
function go_comp(){
	//start - special handling for seal100x wardrobe
	if(wardrobe_s){
		for(var i in wardrobe_s){
			var setInd = wardrobe_s[i][16];
			if($.inArray(setInd.substr(setInd.length-2,setInd.length), ['·套','·基','·染']) >=0) wardrobe_s[i][16]='';
		}
	}
	//end - special handling for seal100x wardrobe
	
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
	var skip_pos=[];
	if(skip_comp){
		for (var i in skip_comp) skip_pos.push($.inArray(skip_comp[i], field_desc));
	}
	//var skip_pos=$.inArray('来源', field_desc);
	for(var i=0;i<max;i++){//assign values into str[] from wardrobe
		for (var j in wname){
			if(wname[j][i]){
				str[j][i]=wname[j][i][0];
				for (var p=1;p<field_desc.length;p++){
					if($.inArray(p, skip_pos)>=0) continue;
					if(p==1&&wname[j][i][p]=='上衣') str[j][i]+='/上装';
					else str[j][i]+='/'+wname[j][i][p];
				}
			}else{
				str[j][i]='';
			}
		}
	}
	var out='<table>';
	out+=tr(td(list));
	out+=tr(td('<hr>'));
	for(var j=0;j<wname.length;j++){
		for(var i=j+1;i<wname.length;i++){//compare [j] with [i]
			if(j==i)  continue;
			out+=tr(td("Extra records in "+wowner[j]+"'s wardrobe VS "+wowner[i]+"'s:"));
			out+=tr(td(compare(str[j],str[i],'<br/>')));
			out+=tr(td('<hr>'));
			out+=tr(td("Extra records in "+wowner[i]+"'s wardrobe VS "+wowner[j]+"'s:"));
			out+=tr(td(compare(str[i],str[j],'<br/>')));
			out+=tr(td('<hr>'));
		}
	}
	out+='</table>';
	
	$("#info").html(out);
	$("#extra").html('');
}

function go_comp_pattern(){
	var p1=[];
	var p2=[];
	for (var i in pattern){
		p1.push(pattern[i].join('/'));
	}
	for (var i in pattern_s){
		p2.push(pattern_s[i].join('/'));
	}
	var out='<table>';
	out+=tr(td("Extra records in rean's wardrobe VS seal100x's:"));
	out+=tr(td(compare(p1,p2,'<br/>')));
	out+=tr(td('<hr>'));
	out+=tr(td("Extra records in seal100x's wardrobe VS rean's:"));
	out+=tr(td(compare(p2,p1,'<br/>')));
	out+='</table>';
	
	$("#info").html(out);
	$("#extra").html('');
}
*/

function go_add(){
	rows=0;
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

function go_src(){
	var pos=$.inArray('来源', field_desc);
	var src=[];
	for (var c in wardrobe){
		var ss=wardrobe[c][pos].split("/");
		for (var s in ss){
			if (ss[s].indexOf('公')>-1) {ss[s]='*公';}
			if (ss[s].indexOf('少')>-1) {ss[s]='*少';}
			if (ss[s].indexOf('定')>-1) {ss[s]='*定';}
			if (ss[s].indexOf('进')>-1) {ss[s]='*进';}
			if (ss[s].indexOf('梦境·')>-1) {ss[s]='*梦境';}
			if (ss[s].indexOf('套装·')>-1) {ss[s]='*套装';}
			if (ss[s].indexOf('签到·')>-1) {ss[s]='*签到';}
			if (ss[s].indexOf('剧情')>-1) {ss[s]='*剧情';}
			if (ss[s].indexOf('故宫-')>-1) {ss[s]='*故宫-';}
			if ($.inArray(ss[s], src)<0) {src.push(ss[s]);}
		}
	}
	src.sort();
	for (var s in src){
		src[s]=(s<9? '0'+(s*1+1) : (s*1+1))+src[s];
	}
	$("#info").html(src.join('<br/>'));
	$("#extra").html('');
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
		for (var i=1;i<=field_desc.length;i++){
			out+="'"+$('#in'+j+'_'+i).val()+"'"+(i==field_desc.length?'':',');
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
	var src_list=[];//source list
	for (var c in wardrobe){
		if($.inArray(wardrobe[c][15], src_list)<0) {src_list.push(wardrobe[c][15]);}
	}
	for(var j=1;j<=rows;j++){
		var head=(j==1? '':'<br/>')+'row'+j+'('+$('#in'+j+'_1').val()+'): '
		var check=[];
		var cont='';
		for (var i=1;i<=field_desc.length;i++){
			check[i]=$('#in'+j+'_'+i).val();
			if(($.inArray(i, chk1)>-1)&&(!check[i])) {cont+=field_desc[i-1]+'null, ';}
			if($.inArray(i, chk2)>-1){
				if(check[i]&&check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'both, ';}
				else if(!check[i]&&!check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'null, ';}
				else if($.inArray(check[i], prop)<0){cont+=field_desc[i-1]+'inv, ';}
				else if($.inArray(check[i-1], prop)<0){cont+=field_desc[i-2]+'inv, ';}
			}
			if(i==2&&check[i]&&$.inArray(check[i], category)<0) {cont+=field_desc[i-1]+'inv, ';}
			if(i==3&&check[i]&&isNaN(parseInt(check[i]))) {cont+=field_desc[i-1]+'inv, ';}
			if(i==16&&check[i]&&$.inArray(check[i], src_list)<0) {cont+=field_desc[i-1]+'inv, ';}
		}
		if(cont){out+=head+cont;}
	}
	$("#extra").html(out);
}

function compare(a,b,split){//a contains but b not
	var out='';
	for(var i=0;a[i];i++){
		if ($.inArray(a[i], b)<0) {out+=a[i]+split;}
	}
	return out;
}

function arrowKey() {
	$('input').keydown(function(e) {
		if (e.keyCode==37) {//left
			if(this.value.slice(0, this.selectionStart).length==0){
			//$(this).prev('input').focus();
			$(this).parent().prev().find('input').focus();
			}
		}
		if (e.keyCode==39) {//right
			if(this.value.length==this.value.slice(0, this.selectionStart).length){
			$(this).parent().next().find('input').focus();
			}
		}
		if (e.keyCode==38) {//up
			var thisid=$(this).attr('id');
			var tar_str=thisid.substr(2,thisid.indexOf('_')-2);
			var tar_id=thisid.replace(tar_str,parseInt(tar_str)-1);
			if($('#'+tar_id).length>0) {$('#'+tar_id).focus();}
		}
		if (e.keyCode==40) {//down
			var thisid=$(this).attr('id');
			var tar_str=thisid.substr(2,thisid.indexOf('_')-2);
			var tar_id=thisid.replace(tar_str,parseInt(tar_str)+1);
			if($('#'+tar_id).length>0) {$('#'+tar_id).focus();}
		}
	});
}

function go_genid(){
    var txt = '<table style="width:100%">';
    txt += '<tr><td>target_suit_id</td></tr>';
    txt += '<tr><td><textarea id="genid_calc" rows="5" style="width:100%"></textarea><td></tr>';
    txt += '<tr><td style="width:25%">achievement_detail_data<br>-&gt;gdAchievementDetailData</td><td style="width:25%">clothes_evolution_data<br>-&gt;gdClothesEvolutionData</td><td style="width:25%">clothes_data<br>-&gt;gdClothesCvtSeriesData</td><td style="width:25%">suit_convert_data<br>-&gt;gdSuitConvertData</td></tr>';
    txt += '<tr><td><textarea id="genid_achieve" rows="10" style="width:100%"></textarea></td><td><textarea id="genid_evo" rows="10" style="width:100%"></textarea></td><td><textarea id="genid_cvt" rows="10" style="width:100%"></textarea></td><td><textarea id="genid_suit" rows="10" style="width:100%"></textarea></td></tr>';
	txt += '<tr><td>' + button('↓↓↓↓↓','genid_generate()') + '</td></tr>';
	txt += '<tr><td><textarea id="genid_output" rows="10" style="width:100%"></textarea></td></tr>';
    txt += '</table>';
    $("#info").html(txt);
    $("#extra").html('');
}

function genid_generate(){
    var output = '';
    var targets = $("#genid_calc").val().split(' ');
    var genid_achieve = $("#genid_achieve").val();
    var genid_evo = $("#genid_evo").val();
    var genid_cvt = $("#genid_cvt").val();
    var genid_suit = $("#genid_suit").val();
    var contents = contentOf(genid_achieve)[0];
    var contentsName = contentOf(genid_achieve)[1];
    var contentsEvo = contentOf(genid_evo)[0];
    var contentsCvt = contentOf(genid_cvt)[0];
    var contentsSuit = contentOf(genid_suit)[0];
    var contentsSuitName = contentOf(genid_suit)[1];
    for (var t in targets) {
        target = targets[t];
        var idx = $.inArray(target, contentsName);
        if (idx < 0){
            alert("not found:" + target);
            continue;
        }
        var outputarr = [];
        
        var target_content = contents[idx];
        output += contentBy(target_content, 'name', true)[0].replace(/"/g, '');
        var target_clothes = contentBrac(target_content, "clothes");
        var target_rewards = contentBrac(target_content, "rewardcomplex");
        for (var i in target_clothes){
            var by = contentBy(target_clothes[i], '');
            for (var j in by) {
                if ($.inArray(by[j], outputarr) < 0){
                    outputarr.push(by[j]);
                    output += by[j] + ' ';
                }
            }
        }
        for (var i in target_rewards) {
            var by_id = contentBy(target_rewards[i], 'id');
            var by_type = contentBy(target_rewards[i], 'type');
            for (var j in by_type){
                if (by_type[j] == '0') {
                    if (j == 0)
                        output += '送';
                    if ($.inArray(by_id[j], outputarr) < 0){
                        outputarr.push(by_id[j]);
                        output += by_id[j] + ' ';
                    }
                }
            }
        }
        
        var found = true;
        var offset = 0;
        while (found) {
            found = false;
            var len = outputarr.length;
            for (var i = offset; i < len; i++) {
                for (var j in contentsEvo) {
                    if (outputarr[i] == contentBy(contentsEvo[j], 'id')[0]) {
                        var src = contentBy(contentsEvo[j], 'src')[0];
                        if ($.inArray(src, outputarr) < 0){
                            if (!found)
                                output += '进';
                            outputarr.push(src);
                            output += src + ' ';
                            found = true;
                        }
                    }
                }
            }
            offset = len;
        }
        
        for (var i in outputarr) {
            for (var j in contentsCvt) {
                var cvt = contentBy(contentsCvt[j], '');
                if (outputarr[i] == cvt[0]) {
                    for (var k = 1; k < cvt.length; k++) {
                        if ($.inArray(cvt[k], outputarr) < 0){
                            if (!found)
                                output += '定';
                            outputarr.push(cvt[k]);
                            output += cvt[k] + ' ';
                            found = true;
                        }
                    }
                }
            }
        }
        
        var idx_suit = $.inArray(target, contentsSuitName);
        if (idx_suit >= 0) {
            found = false;
            var suit_convert = contentsSuit[idx_suit];
            var suit_clothes = contentBrac(suit_convert, "clothes");
            for (var i in suit_clothes){
                var by = contentBy(suit_clothes[i], '');
                for (var j in by) {
                    if ($.inArray(by[j], outputarr) < 0){
                        if (!found)
                            output += '套';
                        outputarr.push(by[j]);
                        output += by[j] + ' ';
                        found = true;
                    }
                }
            }
        }
    }
    $("#genid_output").val(output);
}

function contentBrac(txt, varname){
    varname = varname+'=';
    if (txt.indexOf(varname)<0) return '';
    var txt_sp = txt.split(varname);
    var ret = [];
    
    for (var j = 1; j < txt_sp.length; j++) {
        var sub_txt = txt_sp[j];
        var ind = 0;
        var ret_cont = '';
        for (var i = 0; i < sub_txt.length; i++){
            var c = sub_txt.substr(i,1);
            if (c=='{') ind++;
            else if (c=='}') {
                ind--;
                if (ind==0) {
                    ret.push(ret_cont.substr(1));
                    break;
                }
            }
            if (ind>0) ret_cont += c;
        }
    }
    //for (var i=1; i<txt_sp.length; i++) ret.push(txt_sp[i].split(',')[0]);
    return ret;
}

function go_static(){
	var radio=['refactor','convert','cvtSeries','evolve','merge','arena','shop','guild','achieve','+suit','amputation'];
	var info = '<form id="static" action="">';
	for (var i in radio){
		info += '<label><input type="radio" name="radio_static" id="static_'+radio[i]+'" value="'+radio[i]+'" '+(i==0?'checked':'')+' onclick="clickRadio()">'+radio[i]+'</label><label>';
	}
	info += '</form><br>';
	info += '<textarea id="static_input" rows="10" style="width:100%"></textarea><br>';
	info += button('↓↓↓↓↓','static_generate()')+'<br>';
	info += '<textarea id="static_output" rows="10" style="width:100%"></textarea><br>';
	
	$("#info").html(info);
	$("#extra").html('');
	
	//gen list of setCates
	setCates = function() {
		var ret = [];
		for (var i in wardrobe){
			var cate = /^.*·[染套基]$/.test(wardrobe[i][16]) ? '' : wardrobe[i][16];
			if ($.inArray(cate,ret)<0) ret.push(cate);
		}
		return ret;
	}();
}

function clickRadio(){
	if ($("#static input[type=radio]:checked").val()=='+suit') 
		$("#static_input").val( function() {
			return this.value + '\n*****\n';
		});
	return;
}

function static_generate(){
    var mainType = ['发型','连衣裙','外套','上装','下装','袜子','鞋子','饰品','妆容','萤光之灵'];
	var staticMode = $("#static input[type=radio]:checked").val();
	var static_input = $("#static_input").val();
	if(static_input) {
        var consolelog = [];
		var contents = contentOf(static_input)[0];
		var contentsName = contentOf(static_input)[1];
		var out = '';
		var outArr = {};
		var errmsg = '';
		for (var i in contents){
			switch(staticMode){
				case 'merge' :
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var skip = [];
					if ($.inArray(parseInt(tar.uid),skip)>=0) continue;
					var src_arr = contentBy(contents[i],'cloth');
					var num_arr = contentBy(contents[i],'num');
					if (tar.name&&tar.src[15].indexOf('设·图')<0) {
                        var ward = cloneArr(tar.src);
                        ward[15] = '设·图';
                        ward[18] = '图';
                        var log = "  ['" + ward.join("','") + "'],";
                        consolelog.push([tar.row, log]);
					}
					for (var j in src_arr){
						var src = convert_uid(src_arr[j]);
						//if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','"+num_arr[j]+"','设'],\n";
                        if (tar.name&&src.name) out += "["+$.inArray(tar.mainType,mainType)+","+parseInt(tar.id)+","+$.inArray(src.mainType,mainType)+","+parseInt(src.id)+","+num_arr[j]+"],\n";
						if (tar.name&&!src.name) errmsg += " " + src_arr[j];
					}
					break;
				case 'evolve':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var src = convert_uid(contentBy(contents[i],'src')[0]);
					var num = contentBy(contents[i],'num')[0];
					if (tar.name&&tar.src[15].indexOf('设·进')<0) {
                        var ward = cloneArr(tar.src);
                        ward[15] = "设·进" + src.id;
                        ward[18] = '进·';
                        var log = "  ['" + ward.join("','") + "'],";
                        consolelog.push([tar.row, log]);
					}
					//if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','"+num+"','进'],\n";
					if (tar.name&&src.name) out += "["+$.inArray(tar.mainType,mainType)+","+parseInt(tar.id)+","+$.inArray(src.mainType,mainType)+","+parseInt(src.id)+","+num+"],\n";
					if (tar.name&&!src.name) errmsg += " " + contentBy(contents[i],'src')[0];
					if (src.name&&!tar.name) errmsg += " " + contentBy(contents[i],'id')[0];
					break;
				case 'cvtSeries':
					var src = convert_uid(contentBy(contents[i],'')[0]);
					var tar_arr = contentBy(contents[i],'');
					tar_arr = tar_arr.slice(1);
					for (var j in tar_arr){
						var tar = convert_uid(tar_arr[j]);
						if (tar.name&&tar.src[15].indexOf('设·定')<0) {
                            var ward = cloneArr(tar.src);
                            ward[15] = "设·定" + src.id;
                            ward[18] = '定·';
                            var log = "  ['" + ward.join("','") + "'],";
                            consolelog.push([tar.row, log]);
						} /*else if (tar.name&&src.src[16]!=''&tar.src[16]=='') {
                            var ward = cloneArr(tar.src);
                            ward[16] = src.src[16] + "·染";
                            var log = "//  ['" + ward.join("','") + "'],";
                            consolelog.push([tar.row, log]);
                        }*/
						//if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','1','染'],\n";
						if (tar.name&&src.name) out += "["+$.inArray(tar.mainType,mainType)+","+parseInt(tar.id)+","+$.inArray(src.mainType,mainType)+","+parseInt(src.id)+",1],\n";
						if (src.name&&!tar.name) errmsg += " " + tar_arr[j];
					}
					break;
				case 'convert':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var dye = convert_dye(contentBy(contents[i],'item')[0]);
					var num = contentBy(contents[i],'num')[0];
					if (tar.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+dye[0]+"','"+dye[1]+"','"+num+"'],\n";
					break;
				case 'shop':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var skip = [11379,30574,40593,50550,71237,83111,83112,83113,83114,10818,30339,40449,50413,60312,70742,81241,81242,81243,90053];
                    //美杜莎, 甜蜜阳光
					if ($.inArray(parseInt(tar.uid),skip)>=0) continue;
					var price = contentBy(contents[i],'price')[0];
					var price_type = contentBy(contents[i],'price_type')[0];
					var currency = convert_priceType(price_type);
					var isOld = contentBy(contents[i],'is_activity_goods')[0]==1 ? '1' : '0';
					if (tar.name) out += "['"+tar.mainType+"','"+tar.id+"',"+price+",'"+currency+"',"+isOld+"],\n";
					if (tar.name&&tar.src[15].indexOf('店·')<0) {
                        var ward = cloneArr(tar.src);
                        ward[15] = "店·"+currency;
                        ward[18] = currency.charAt(0);
                        var log = "  ['" + ward.join("','") + "'],";
                        consolelog.push([tar.row, log]);
					}
					break;
				case 'arena':
					var tar = convert_uid(contentsName[i]);
					var price = contentBy(contents[i],'price')[0];
					var noDisplay = contentBy(contents[i],'no_display');
					var haveDiscount = contentBy(contents[i],'is_old_product')[0]=='1' ? '0' : '1';
					var isOld = contentBy(contents[i],'is_activity_goods')[0];
					if (tar.name&&!noDisplay) out += "  ['"+tar.mainType+"','"+tar.id+"',"+price+","+haveDiscount+","+isOld+",],\n";
					break;
				case 'refactor':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var src_arr = contentBy(contents[i],'cloth');
					var num_arr = contentBy(contents[i],'num');
					for (var j in src_arr){
						var src = convert_uid(src_arr[j]);
						if (tar.name&&src.name) out += "['"+tar.mainType+"','"+tar.id+"','"+src.name+"',"+num_arr[j]+"],\n";
					}
					break;
				case 'guild':
					var tar = convert_uid(contentsName[i]);
					var price = contentBy(contents[i],'price')[0];
					if (tar.name) out += "['"+tar.mainType+"','"+tar.id+"',"+price+",'联盟币'],\n";
					break;
				case 'achieve':
					var name = contentBy(contents[i],'name',1)[0].replace(/[\ \"]/g,'');
					var genre = contentBy(contents[i],'genre')[0];
					switch (genre){
						case '7': var genreName = '节日盛典'; var seq = 10; break;
						case '8': var genreName = '十二月剧团'; var seq = 11; break;
						case '9': var genreName = '一路相随'; var seq = 12; break;
						case '10': var genreName = '满天繁星'; var seq = 13; break;
						case '11': var genreName = '苹果联邦'; var seq = 3; break;
						case '12': var genreName = '莉莉斯王国'; var seq = 4; break;
						case '13': var genreName = '云端帝国'; var seq = 5; break;
						case '14': var genreName = '信鸽王国'; var seq = 6; break;
						case '15': var genreName = '北地王国'; var seq = 7; break;
						case '16': var genreName = '荒原共和国'; var seq = 8; break;
						case '17': var genreName = '废墟孤岛'; var seq = 9; break;
						case '18': var genreName = '梦恋奇迹'; var seq = 14; break;
						case '19': var genreName = '故事套装'; var seq = 30; break;
						case '22': var genreName = '远古化石展'; var seq = 17; break;
						case '23': var genreName = '星座展'; var seq = 18; break;
						case '24': var genreName = '御苑琼芳'; var seq = 15; break;
						case '25': var genreName = '吴郡风雅'; var seq = 16; break;
						case '27': var genreName = '至臻典藏'; var seq = 1; break;
						case '28': var genreName = '璀璨华光'; var seq = 2; break;
						case '29': var genreName = '童话梦乡'; var seq = 19; break;
						case '30': var genreName = '缤纷画卷'; var seq = 20; break;
						default: var genreName = '';
					}
					if (genreName && name && $.inArray(name,setCates)>=0){
						if (!outArr[seq]) outArr[seq] = [];
						outArr[seq].push("  ['" + genreName + "','" + name + "'],\n");
						if (name=='白骨夫人'||name=='幽冥仙主') outArr[seq].push("  ['" + genreName + "','" + name + "·入夜'],\n");
					}
                    
                    //check single clothes is in set
                    var clothesList = contentBrac(contents[i],'clothes')[0];
                    if (clothesList) {
                        var by = contentBy(clothesList, '');
                        for (var j in by) {
                            var tar = convert_uid(by[j]);
                            if (tar.name&&tar.src[16] != name) {
                                var ward = cloneArr(tar.src);
                                var pref = tar.src[16] == '' ? '' : '//';
                                ward[16] = name;
                                var log = pref + "  ['" + ward.join("','") + "'],";
                                consolelog.push([tar.row, log]);
                            }
                        }
                    }
                    
					if (i==Object.keys(contents).length-1){ //last record
						for (var seq in outArr){
							outArr[seq].reverse();
							for (var l in outArr[seq]){
								out += outArr[seq][l];
							}
						}
					}
					break;
				case '+suit':
					checkSuitConvert(static_input);
					return;
					break;
                case 'amputation':
                    var tar = convert_uid(contentBy(contents[i],'id')[0]);
					if (tar.name&&!tar.src[19]) {
						var ward = cloneArr(tar.src);
                        ward[19] = '1';
                        var ln = "  ['" + ward.join("','") + "'],";
                        out += ln + '\n';
						consolelog.push([tar.row, ln]);
					}
                    break;
				default:
					break;
			}
		}
		if (errmsg) {
			alert('尚缺:'+errmsg);
			console.log('尚缺:'+errmsg);
		}
		$("#static_output").val(out);
        consolelog.sort(function(a, b){return a[0] - b[0];});
        for (var ln in consolelog) {
            console.log(consolelog[ln][1]);
        }
	}
}

function checkSuitConvert(input){
	var errmsg = '';
    var consolelog = [];
	var inputSplit = input.split('*****');
	var existSetIds = {};
	var achieve = inputSplit[0];
	var convert = inputSplit[1];
	var achieveContents = contentOf(achieve)[0]; //analyze achieve text
	var achieveId = contentOf(achieve)[1];
	var achieveName = [];
	for (var i=0; i<achieveContents.length; i++){
		achieveName.push(contentBy(achieveContents[i],'name',1)[0].replace(/[\ \"]/g,''));
	}
	for (var i=0; i<setCates.length; i++){ //get id for each setName
		var idx = $.inArray(setCates[i],achieveName);
		if (idx>=0){
			existSetIds[achieveId[idx]] = setCates[i];
		}
	}
	var convertContents = contentOf(convert)[0]; //analyze convert text
	var convertId = contentOf(convert)[1];
	for (var i=0; i<convertContents.length; i++){
        if (!existSetIds[convertId[i]]) continue;
        var setName = existSetIds[convertId[i]];
		var cvtCnt = contentOf(convertContents[i])[0];
		for (var j=0; j<cvtCnt.length; j++){
            var convertSuffix = contentBy(cvtCnt[j],'convert',1) ? "·染" : "·套";
			var cloListRaw = contentOf(cvtCnt[j])[0][0].split(',');
			for (var k=0; k<cloListRaw.length; k++){
				var equalSign = cloListRaw[k].indexOf('=');
				if (equalSign==-1) continue;
				var uid = cloListRaw[k].substr(equalSign).replace(/[^0-9]/g,'');
				var tar = convert_uid(uid);
				if (!tar.name) errmsg += " " + uid;
                else if (tar.src && tar.src[16]=='') {
                    var ward = cloneArr(tar.src);
                    ward[16] = setName + convertSuffix;
                    var log = "  ['" + ward.join("','") + "'],";
                    consolelog.push([tar.row, log]);
                }
                //else if (tar.src && tar.src[16].indexOf(setName)<0) {
                else if (tar.src && tar.src[16]!=setName && tar.src[16]!=(setName+convertSuffix)) {
                    var ward = cloneArr(tar.src);
                    ward[16] = setName + convertSuffix;
                    var log = "//  ['" + ward.join("','") + "'],";
                    consolelog.push([tar.row, log]);
                }
			}
		}
	}
	if (errmsg) {
		alert('尚缺:'+errmsg);
		console.log('尚缺:'+errmsg);
	}
	else alert('check done.');
    
    consolelog.sort(function(a, b){return a[0] - b[0];});
    for (var line in consolelog) {
        console.log(consolelog[line][1]);
    }
}

function contentOf(txt){
	var ind=0; var ind2=0;
	var ret=[]; var ret_cont=''; var ret_name=''; var name=[];
	for (var i=0; i<txt.length; i++){
		var c = txt.substr(i,1);
		if (c=='{') ind++;
		else if (c=='}') {
			ind--;
			if (ind==0) {ret.push(ret_cont.substr(1)); ret_cont=''; name.push(ret_name); ret_name='';}
		}
		if (ind>0) ret_cont += c;
		else if (c.match(/^[0-9a-z]$/)) ret_name += c;
	}
	return [ret,name];
}

function cloneArr(arr){
    var ret = [];
    for (var i in arr) {
        ret.push(arr[i]);
    }
    return ret;
}

function contentBy(txt,varname,keepChars){
	if (!keepChars) txt = txt.replace(/[^0-9a-z\,_{}=]/gi,'');
	varname = varname+'=';
	if (txt.indexOf(varname)<0) return false;
	var txt_sp = txt.split(varname);
	var ret = [];
	for (var i=1; i<txt_sp.length; i++) ret.push(txt_sp[i].split(',')[0]);
	return ret;
}

function convert_uid(uid){
	if (uid=='81327') uid='31327';
	if (uid=='82599') uid='62599';
	if (uid=='83221') uid='73221';
	if (uid=='85735') uid='65735';
	if (uid=='30961') uid='49961';
	
	var mainId = uid.substr(0,1);
	var id = (uid.substr(1,1)==0 ? uid.substr(2,3) : uid.substr(1,4));
	var mainType = convert_type(mainId);
	return {
		uid: uid,
		mainType: mainType,
		id: id,
		name: clothesSet[mainType][id],
		src: clothesSrc[mainType][id], //src=clothesSrc[mainType][id][15]
        row: clothesRow[mainType][id],
	}
}

var clothesSet = function() {
  var ret = {};
  for (var i in wardrobe) {
    var t = wardrobe[i][1].split('-')[0];
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][wardrobe[i][2]] = wardrobe[i][0];
  }
  return ret;
}();

var clothesSrc = function() {
  var ret = {};
  for (var i in wardrobe) {
    var t = wardrobe[i][1].split('-')[0];
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][wardrobe[i][2]] = wardrobe[i];
  }
  return ret;
}();

var clothesRow = function() {
  var ret = {};
  for (var i in wardrobe) {
    var t = wardrobe[i][1].split('-')[0];
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][wardrobe[i][2]] = i;
  }
  return ret;
}();

function convert_type(tid){
	switch(tid){
		case '1' : return '发型';
		case '2' : return '连衣裙';
		case '3' : return '外套';
		case '4' : return '上装';
		case '5' : return '下装';
		case '6' : return '袜子';
		case '7' : return '鞋子';
		case '8' : return '饰品';
		case '9' : return '妆容';
	}
}

function convert_dye(tid){
	switch(tid){
		case '2001' : return ['石榴红','8'];
		case '2002' : return ['青柠黄','8'];
		case '2003' : return ['阳光橙','8'];
		case '2004' : return ['灵动绿','8'];
		case '2005' : return ['天真蓝','8'];
		case '2006' : return ['典雅紫','8'];
		case '2007' : return ['梦幻粉','8'];
		case '2008' : return ['珍珠白','8'];
		case '2009' : return ['星尘黑','8'];
		case '2010' : return ['其他染料','12'];
		case '3001' : return ['水玉点点','20'];
		case '3002' : return ['经典网格','20'];
		case '3003' : return ['清新条纹','20'];
		case '3004' : return ['高级花纹','20'];
	}
}

function convert_priceType(tid){
	switch(tid){
		case '0' : return '金币';
		case '1' : return '钻石';
		case '3' : return '水晶鞋';
		case '6' : return '蔷薇';
		case '5' : return '翡翠';
		case '9' : return '沙漏';
		case '17' : return '惊雀铃';
		case '28' : return '琉璃';
		default : return '?';
	}
}

$(document).ready(function () {
	$('#passcode').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			show();
		}
	});
});

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function button(text,onclick){
	return '<button onclick="'+onclick+';return false;">'+text+'</button>'
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}
