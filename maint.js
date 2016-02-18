var wname=[wardrobe,wardrobe_i,wardrobe_s];
var wowner=['rean','ivangift','seal100x'];

function show(){
	var pass='d0be2dc421be4fcd0172e5afceea3970e2f3d940';
	var userInput=$("#passcode").val();
	$("#passcode").val('');
	userInput=$.sha1(userInput);
	if (userInput==pass){
		go();
	}else{
		$("#info").html('&#x1f64a&#x1f64a&#x1f64a&#x1f64a&#x1f64a');
	}
}
function go(){
	var max=getMaxLength();
	var str=[];
	for (var i in wname){
		str[i]=[];
	}
	for(var i=0;i<max;i++){
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
	out+=td('<hr>');
	for(var i=1;i<wname.length;i++){
		out+=td("Extra values in "+wowner[0]+"'s wardrobe VS "+wowner[i]+"'s:");
		out+=td(compare(str[0],str[i],max));
		out+=td('<hr>');
		out+=td("Extra values in "+wowner[i]+"'s wardrobe VS "+wowner[0]+"'s:");
		out+=td(compare(str[i],str[0],max));
		out+=td('<hr>');
	}
	out+='</table>';
	
	$("#info").html(out);
}

function getMaxLength(){
	var a=0; var b=0; var c=0;
	for(var i in wname[0]){a++;}
	for(var i in wname[1]){b++;}
	for(var i in wname[2]){c++;}
	return Math.max(a,b,c);
};

function compare(a,b,len){//a contains but b not
	var out='';
	for(var i=0;i<len;i++){
		var ind=0;
		for(var j=0;j<len;j++){
			if (a[i]==b[j]){
				ind=1;
				break;
			}
		}
		if(!ind) out+=a[i]+'</br>';
	}
	return out;
}

function td(text){
	return '<tr><td>'+text+'</td></tr>';
}
