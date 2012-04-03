YUI.add("gallery-slidecheckbox",function(c){var e="SlideCheckbox",i="contentBox",g="wrapper",a="slider",f="sliderwrap",b="labelOn",h="labelOff",d="handle";c[e]=c.Base.create(e,c.Widget,[c.MakeNode],{anim:null,currentX:null,lastX:null,renderUI:function(){this.src=this.get("srcNode").addClass(this.getClassName("hidden"));this.get(i).append(this._makeNode()).append(this.src);this._locateNodes();var m=this._labelOnNode.one("div").get("offsetWidth"),l=this._labelOffNode.one("div").get("offsetWidth"),n=this._labelOnNode.get("offsetWidth"),o=this.getSkinName(),j=o?o.indexOf("ios5")>-1:null;if(m>l){this._labelOffNode.one("div").setStyle("width",m);}else{this._labelOnNode.one("div").setStyle("width",l);n=this._labelOnNode.get("offsetWidth");}this.left=-this._labelOnNode.get("offsetWidth")+3;var k=2*n;if(j){this._slideWrapWidth=2*n+28;this.left=this.left+11;k=n+14;}else{this._slideWrapWidth=3*n+10;this._handleNode.setStyle("width",n-3);}this._sliderwrapNode.setStyle("width",this._slideWrapWidth);this._wrapperNode.setStyle("width",k);},bindUI:function(){this.disabled=this.src.get("disabled");var k=new c.DD.Drag({node:this._sliderwrapNode,activeHandle:this._handleNode,lock:this.disabled}),j=this.get(i);this._addDragConstraint(k);k.on("drag:drag",function(m){var l=this._wrapperNode.getXY();if(l[1]!==k.actXY[1]){k.unplug();this._addDragConstraint(k);m.halt(true);}if(k.actXY[0]%2===0){this.lastX=this.currentX;}this.currentX=k.actXY[0];},this);k.on("drag:end",this.move,this);j.on("focus",function(){j.on("key",this.goLeft,"down:37",this);j.on("key",this.goRight,"down:39",this);j.on("key",function(l){l.preventDefault();this.move();},"down:32",this);},this);j.on("blur",function(){j.detach("key");j.blur();},this);this.src.on("change",function(l){alert(this.src.get("checked"));});},syncUI:function(){this._sliderwrapNode.setStyle("left",this.src.get("checked")?0:this.left);},destructor:function(){this.anim.stop().destroy();this.src=null;},goLeft:function(){this.to=this.left;this._execute();},goRight:function(){this.to=0;this._execute();},move:function(){this.from=this._replacePx(this._sliderwrapNode.getComputedStyle("left"));if(this.lastX!==null){if(this.currentX<this.lastX||this.from===this.left){this.goLeft();}else{this.goRight();}}if(this.from>this.left){this.goLeft();}else{this.goRight();}},_addDragConstraint:function(j){var k=this._wrapperNode.getXY();j.plug(c.Plugin.DDConstrained,{constrain:{top:k[1],bottom:k[1]+this._wrapperNode.get("offsetHeight"),right:k[0]+this._slideWrapWidth,left:k[0]+this.left}});},_defaultCB:function(j){return null;},_onClick:function(j){j.preventDefault();this.move();},_execute:function(){this.focus();if(this.disabled){return;}if(this.anim===null){this.anim=new c.Anim({node:this._sliderwrapNode,from:{left:this.from},duration:this.get("duration"),to:{left:this.to},easing:"easeIn"});}this.lastX=null;this.anim.set("from",{left:(this.from?this.from:this.baseX)});this.anim.set("to",{left:this.to});this.anim.run();this.src.set("checked",!this.src.get("checked"));},_replacePx:function(j){return parseInt(j.replace("px",""));}},{ATTRS:{duration:{value:0.2},strings:{value:{labelOn:"ON",labelOff:"OFF"}}},_CLASS_NAMES:[g,a,f,b,h,d],_TEMPLATE:['<div class="{c wrapper}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span>','<div class="{c slider}"><div class="{c sliderwrap}">','<div class="{c labelOn}"><label><div>{s labelOn}</div></label></div>','<div class="{c handle}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span></div>','<div class="{c labelOff}"><label><div>{s labelOff}</div></label></div>',"</div></div></div>"].join("\n"),_EVENTS:{slider:[{type:"click",fn:"_onClick"}]},HTML_PARSER:{value:function(j){return j.getAttribute("checked");}}});},"gallery-2012.03.28-20-16",{skinnable:true,requires:["node-base","anim-base","anim-easing","base-build","event-key","event-move","widget","node-style","gallery-makenode","dd-drag","dd-constrain"]});