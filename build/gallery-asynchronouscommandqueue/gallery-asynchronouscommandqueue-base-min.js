YUI.add("gallery-asynchronouscommandqueue-base",function(b){var a;a=function(c){a.superclass.constructor.call(this,c);};a.ATTRS={completed:{readOnly:true,value:false},paused:{value:false},started:{readOnly:true,value:false},queue:{value:[],writeOnce:"initOnly"}};a.NAME="AsynchronousCommandQueue";b.extend(a,b.Base,{addCommand:function(c){this.get("queue").push(c);return this;},getCommandCount:function(){return this.get("queue.length");},initializer:function(){this.publish("complete",{fireOnce:true});this.publish("start",{fireOnce:true});this.after("pausedChange",function(c){if(!c.newVal){this.startQueue();}},this);this.on("complete",function(e,c,d){this._set("completed",true);},this);this.on("start",function(e,c,d){this._set("started",true);},this);},startAll:function(){var d,e=0,f,g,c=this.get("queue");g=function(h){h.execute().on("complete",function(){e+=1;if(e===d){this._set("queue",c.slice(d));if(this.get("queue.length")){this.startAll();}else{this.fire("complete");}}},this);};this.fire("start");for(f=0,d=c.length;f<d;f+=1){g.call(this,c[f]);}if(!d){this.fire("complete");}return this;},startQueue:function(){if(this.get("paused")){return this;}else{if(!this.get("queue.length")){this.fire("complete");return this;}}this.fire("start");this.get("queue").shift().execute().on("complete",function(){this.startQueue();},this);return this;}});b.AsynchronousCommandQueue=a;},"gallery-2011.04.13-22-38",{requires:["base"],skinnable:false});
