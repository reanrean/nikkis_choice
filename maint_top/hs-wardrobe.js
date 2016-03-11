var wardrobe_orig=wardrobe;
var wardrobe=function() {
	var ret = [];
	for (var i in wardrobe_orig) {
		var tmp=wardrobe[i];
		if (tmp[1]=='上装'){tmp[1]='上衣';}
		ret.push(tmp);
	}
	return ret;
}();

var category_orig=category;
var category=function() {
	var ret = [];
	for (var i in category_orig) {
		if (category_orig[i]=='上装'){ret.push('上衣');}
		else{ret.push(category_orig[i])};
	}
	return ret;
}();
