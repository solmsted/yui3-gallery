YUI.add("gallery-yql-crypto",function(a){(function(i){var d=i.Base64.decode,c,h,e,b,g=i.bind,f;c=function(l,j,m,k){i.YQL("SELECT * FROM execute WHERE code = '"+l.replace(/'/g,"\\'")+"'",j,m,k);};h=function(j){j=j&&j.query;j=j&&j.results;return j&&j.result;};e=function(m,k,j,n,l){c("response.object = y.crypto.encode"+m+'("'+String(k||"").replace(/"/g,'\\"')+'");',function(o){j(f(d(h(o))));},n,l);};b=function(n,l,j,k,o,m){c("response.object = y.crypto.encode"+n+'("'+String(j||"").replace(/"/g,'\\"')+'", "'+String(l||"").replace(/"/g,'\\"')+'");',function(p){k(f(d(h(p))));},o,m);};f=function(j){var m="",k,l,n;for(k=0,l=j.length;k<l;k+=1){n=j.charCodeAt(k).toString(16);if(n.length<2){n="0"+n;}m+=n;}return m;};i.YQLCrypto={execute:c,hmacSha1:g(b,null,"HmacSHA1"),hmacSha256:g(b,null,"HmacSHA256"),md5:g(e,null,"Md5"),sha1:g(e,null,"Sha"),uuid:function(j,l,k){c("response.object = y.crypto.uuid();",function(m){j(h(m));},l,k);}};}(a));},"@VERSION@",{requires:["gallery-base64","yql"],skinnable:false});