YUI.add("gallery-async-command-withhold",function(a){(function(d){var c=d.delay,b;b=d.extend(function(e){b.superclass.constructor.call(this,e);},d.Plugin.Base,{initializer:function(){this.onHostEvent(["failure","success"],function(f){f.preventDefault();var e=arguments,h=f.target,g=h.getEvent(f.type);c(g.defaultFn,this.get("withhold")).apply(g,e);},this);}},{ATTRS:{withhold:{value:0,writeOnce:"initOnly"}},NAME:"async-command-withhold",NS:"withhold"});d.Plugin.AsyncCommandWithhold=b;}(a));},"@VERSION@",{requires:["gallery-async-command","gallery-delay","plugin"],skinnable:false});