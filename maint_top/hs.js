var output_row=[];

function setBoost(criteria, boostType) {
  global.boostType = boostType;
  $(".boost").text("");
  switch(global.boostType) {
    case 2: // global
      criteria.boost1 = global.extreme.boost1;
      criteria.boost2 = global.extreme.boost2;
      $("#" + criteria.boost1 + "Boost").text("<-暖暖的微笑");
      $("#" + criteria.boost2 + "Boost").text("<-迷人飞吻+暖暖的微笑");
	  output_row.push([$("#theme").val(),criteria.boost1,criteria.boost2]);
	  $('#output_row').append("['"+$("#theme").val()+"','"+criteria.boost1+"','"+criteria.boost2+"'],"+"<br>");
      shoppingCart.clear();
      if (global.extreme.shoppingCart) {
        for (var i in global.extreme.shoppingCart.cart) {
          shoppingCart.put(global.extreme.shoppingCart.cart[i][2]);
        }
      }
      break;
    case 3: // own
      criteria.boost1 = global.extremeOwn.boost1;
      criteria.boost2 = global.extremeOwn.boost2;
      $("#" + criteria.boost1 + "Boost").text("<-暖暖的微笑");
      $("#" + criteria.boost2 + "Boost").text("<-迷人飞吻+暖暖的微笑");
      shoppingCart.clear();
      if (global.extremeOwn.shoppingCart) {
        for (var i in global.extremeOwn.shoppingCart.cart) {
          shoppingCart.put(global.extremeOwn.shoppingCart.cart[i][2]);
        }
      }
      break;
    default:
      criteria.boost1 = null;
      criteria.boost2 = null;
  }
}

/*
function conv_wardrobe(){
var cnt=0;
	for(var i=0;i<wardrobe.length;i++){//assign values into str[] from wardrobe
			if(wardrobe[i]){
				if(wardrobe[i][1]=='上装'){wardrobe[i][1]='上衣';cnt++;}
			}
		}
	alert(cnt);
	for(var j=0;j<category.length;j++){
		if(category[j]){
				if(category[j]=='上装'){category[j]='上衣';alert('done');}
			}
	}
}
*/