YUI.add("gallery-funcprog",function(b){function a(d,e){var c=b.Array(arguments,1,true);switch(b.Array.test(e)){case 1:return b.Array[d].apply(null,c);case 2:c[0]=b.Array(e,0,true);return b.Array[d].apply(null,c);default:if(e&&e[d]&&e!==b){c.shift();return e[d].apply(e,c);}else{return b.Object[d].apply(null,c);}}}b.mix(b,{every:function(g,e,h,d){return a("every",g,e,h,d);},filter:function(g,e,h,d){return a("filter",g,e,h,d);},find:function(g,e,h,d){return a("find",g,e,h,d);},map:function(g,e,h,d){return a("map",g,e,h,d);},partition:function(g,e,h,d){return a("partition",g,e,h,d);},reduce:function(h,g,e,i,d){return a("reduce",h,g,e,i,d);},reject:function(g,e,h,d){return a("reject",g,e,h,d);}});b.mix(b.Array,{findIndexOf:function(d,g,h){var e=-1;b.Array.some(d,function(c,f){if(g.call(h,c,f,d)){e=f;return true;}});return e;}});},"gallery-2012.04.12-13-50",{requires:["oop","array-extras","gallery-object-extras"],optional:["gallery-nodelist-extras2"]});