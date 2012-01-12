YUI.add("gallery-yql-rest-client-oauth",function(a){(function(d){var c=d.Do,n=c.Prevent,o=d.YQLRESTClient,e,i=d.each,b,k=Math.floor,l=d.YQLCrypto.hmacSha1_b64,g=d.Array.map,p,h=d.Lang.now,j=Math.random,m,f=o.request;c.before(function(u,v,q,t){u=u||{};var A=u.oAuth,y,s={},z,x,r,w;if(!A){return;}r=function(){return b(y.secret)+"&"+b(x.secret);};w=function(B){s.oauth_signature=B;u.headers=u.headers||{};u.headers.Authorization=e(s);};y=A.consumer||{};s.oauth_consumer_key=y.key||"";z=A.signatureMethod;s.oauth_signature_method=z;x=A.token||{};s.oauth_token=x.key||"";if(x.verifier){s.oauth_verifier=x.verifier;}s.oauth_version="1.0";switch(z){case"HMAC-SHA1":s.oauth_nonce=m();s.oauth_timestamp=k(h()/1000);l([b(u.method.toUpperCase()),b(u.url),b(p(u.content,s,u.query))].join("&"),r(),function(B){w(B);f(u,v,q,t);},null,{proto:"https"});return new n("asynchronous");case"PLAINTEXT":w(r());return;default:throw"Unknown OAuth Signature Method";}},o,"request");e=function(r){var q=[];i(r,function(t,s){q.push(b(s)+'="'+b(t));});return"OAuth "+q.join('",')+'"';};b=function(q){if(!q){return"";}return encodeURIComponent(q).replace(/(\!)|(\')|(\()|(\))|(\*)/g,function(r){return"%"+r.charCodeAt(0).toString(16).toUpperCase();});};p=function(r,q,s){var t=[];i([r,q,s],function(u){i(u,function(w,v){t.push([b(v),b(w)]);});});t.sort(function(v,u){if(v[0]<u[0]){return -1;}if(v[0]>u[0]){return 1;}if(v[1]<u[1]){return -1;}if(v[1]>u[1]){return 1;}return 0;});t=g(t,function(u){return u.join("=");});return t.join("&");};m=function(){return j().toString(32).substr(2);};}(a));},"@VERSION@",{requires:["array-extras","event-custom-base","gallery-yql-crypto","gallery-yql-rest-client"],skinnable:false});