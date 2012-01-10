YUI.add("gallery-model-sync-rest",function(h){var e,d=h.Lang,c=d.sub,g=d.isValue,a=d.isString,b=d.isNumber,f=d.isFunction;e=function(){};e.HTTP_METHODS={"create":"POST","read":"GET","update":"PUT","delete":"DELETE"};e.HTTP_HEADERS={"Accept":"application/json","Content-Type":"application/json"};e.EMULATE_HTTP=false;e.prototype={root:"",url:function(){var i=this.root,j;if(this instanceof h.ModelList||this.isNew()){return i;}j=this.getAsURL("id");if(i&&i.charAt(i.length-1)==="/"){j+="/";}return this._joinURL(j);},initializer:function(i){i||(i={});g(i.url)&&(this.url=i.url);},sync:function(m,k,p){k||(k={});var j=this._getURL(),o=e.HTTP_METHODS[m],n=h.merge(e.HTTP_HEADERS,k.headers),l=k.timeout||e.HTTP_TIMEOUT,i;if(o==="POST"||o==="PUT"){i=h.JSON.stringify(this);}else{delete n["Content-Type"];}if(e.EMULATE_HTTP&&(o==="PUT"||o==="DELETE")){n["X-HTTP-Method-Override"]=o;o="POST";}h.io(j,{method:o,headers:n,data:i,timeout:l,on:{success:function(r,q){if(f(p)){p(null,q.responseText);}},failure:function(r,q){if(f(p)){p({code:q.status,msg:q.statusText},q.responseText);}}}});},_getURL:function(){var i=this.url,j;if(f(i)){return this.url();}if(this instanceof h.Model){j={};h.Object.each(this.toJSON(),function(m,l){if(a(m)||b(m)){j[l]=encodeURIComponent(m);}});i=c(i,j);}return i||this.root;},_joinURL:function(j){var i=this.root;if(j.charAt(0)==="/"){j=j.substring(1);}return i&&i.charAt(i.length-1)==="/"?i+j:i+"/"+j;}};h.namespace("ModelSync").REST=e;},"gallery-2012.01.04-22-09",{requires:["model","model-list","io-base","json-stringify"],skinnable:false});