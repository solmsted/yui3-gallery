YUI.add("gallery-yql-rest-client",function(a){(function(d){var j=d.Lang,f=d.each,g=d.YQL.execute,e=g.getResult,h=j.isArray,c=j.isObject,b,i=d.QueryString.stringify;d.YQLRESTClient={request:function(B,u,t,s){B=B||{};var n=B.accept,k=[],w=B.content,A=B.contentType,y=B.fallbackCharsets,z=B.forceCharset,l=B.headers,q=B.jsonCompat,x=B.matrix,m=B.method,v=B.paths,p=B.query,r=B.timeout,o=B.url;if(!m||!o){throw"Request requires a url and a method.";}k.push('response.object = y.rest("'+b(B.url)+'")');if(n){k.push('accept("'+b(n)+'")');}if(c(w)){w=i(w);A="application/x-www-form-urlencoded";}if(A){k.push('contentType("'+b(A)+'")');}if(y){k.push('fallbackCharset("'+b(h(y)?y.join(","):y)+'")');}if(z){k.push('forceCharset("'+b(z)+'")');}if(l){f(l,function(D,C){k.push('header("'+b(C)+'", "'+b(D)+'")');});}if(q){k.push('jsonCompat("'+b(q)+'")');}if(x){f(x,function(D,C){k.push('matrix("'+b(C)+'", "'+b(D)+'")');});}if(v){f(v,function(C){k.push('path("'+b(C)+'")');});}if(p){f(p,function(D,C){k.push('query("'+b(C)+'", "'+b(D)+'")');});}if(r){k.push('timeout("'+b(r)+'")');}switch(m){case"delete":m="del";case"get":case"head":k.push(m+"()");break;case"post":case"put":k.push(m+'("'+b(w)+'")');break;default:throw"Unknown method.";}g(k.join(".")+";",function(C){u(e(C));},t,s);}};b=function(k){return String(k||"").replace(/"/g,'\\"');};}(a));},"@VERSION@",{requires:["gallery-yql-execute","querystring-stringify"],skinnable:false});