"use strict";function _classCallCheck(a,s){if(!(a instanceof s))throw new TypeError("Cannot call a class as a function")}var Map=function a(s,i,t,h,n){_classCallCheck(this,a),this.name=s,this.image=t,this.imageMask=i,this.width=h,this.height=n,this.loaded=!1};
"use strict";function _classCallCheck(s,a){if(!(s instanceof a))throw new TypeError("Cannot call a class as a function")}var MapPoint=function s(a,n,t){_classCallCheck(this,s),this.x=a,this.y=n,this.under=t};
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}(),PlayerPosition=function(){function t(e,n,a){_classCallCheck(this,t),this.point=e,this.viewAngle=a||0,this.type=n}return _createClass(t,[{key:"updateAngle",value:function(t){var e=t.y-this.point.y,n=t.x-this.point.x,a=Math.atan2(-e,n);a<0&&(a+=2*Math.PI);var i=180*a/Math.PI;(n>1||n<0||e>1||e<0)&&(this.viewAngle=Math.abs(i))}}]),t}();
"use strict";function _classCallCheck(s,a){if(!(s instanceof a))throw new TypeError("Cannot call a class as a function")}var Player=function s(a,t,i,n){_classCallCheck(this,s),this.name=a,this.positions=t||[],this.color=n,this.team=i};
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,i,a){return i&&t(e.prototype,i),a&&t(e,a),e}}(),Shape=function(){function t(e,i,a){_classCallCheck(this,t),this.context=i,this.text=a,this.position=e}return _createClass(t,[{key:"fillText",value:function(){var t=this.context,e=this.position.point;t.fillStyle="black",t.font="12px Arial",t.fillText(this.text,e.x-4,e.y+4)}},{key:"drawFieldOfView",value:function(){var t=this.context,e=CSMApi.Settings,i=this.position,a=this.position.point;t.beginPath(),t.moveTo(a.x,a.y),t.arc(a.x,a.y,e.FOV_RADIUS,-(i.viewAngle*Math.PI/180)-.25*Math.PI,-(i.viewAngle*Math.PI/180)+.25*Math.PI,!1);var n=t.createRadialGradient(a.x,a.y,1,a.x,a.y,e.FOV_RADIUS);n.addColorStop(0,"rgba("+e.FOV_COLOR_DARK+", 0.33)"),n.addColorStop(2/3,"rgba("+e.FOV_COLOR+", 0.33)"),n.addColorStop(1,"rgba("+e.FOV_COLOR+", 0)"),t.closePath(),t.fillStyle="rgba(239, 242, 248, 0.2)",t.fill()}}]),t}();
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Camppoint=function(e){function t(e,n,r,o){_classCallCheck(this,t);var i=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,n,r,o));return i.player=e,i}return _inherits(t,e),_createClass(t,[{key:"draw",value:function(){var e=this.context,t=this.player,n=this.position.point,r=1;this.drawFieldOfView(),e.beginPath(),e.fillStyle="rgba("+t.color+", "+r+")",e.strokeStyle="black",e.lineWidth=2,e.lineTo(n.x,n.y-12),e.lineTo(n.x+12,n.y+8),e.lineTo(n.x-12,n.y+8),e.closePath(),e.stroke(),e.fill(),this.fillText()}},{key:"isInBounds",value:function(e){var t=function(e,t,n){return e.x*(t.y-n.y)+t.x*(n.y-e.y)+n.x*(e.y-t.y)},n=this.position.point,r={x:n.x,y:n.y-12},o={x:n.x+12,y:n.y+8},i={x:n.x-12,y:n.y+8};return t(e,r,o)>=0&&t(e,o,i)>=0&&t(e,i,r)>=0}}]),t}(Shape);
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),Syncpoint=function(t){function e(t,n,r,o){_classCallCheck(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r,o));return i.player=t,i}return _inherits(e,t),_createClass(e,[{key:"draw",value:function(){var t=this.context,e=this.player,n=this.position.point,r=1;this.drawFieldOfView(),t.beginPath(),t.fillStyle="rgba("+e.color+", "+r+")",t.strokeStyle="black",t.lineWidth=2,t.closePath(),t.strokeRect(n.x-8,n.y-8,16,16),t.fillRect(n.x-8,n.y-8,16,16),this.fillText()}},{key:"isInBounds",value:function(t){var e=this.position.point;return t.x>=e.x-8&&t.x<=e.x+8&&t.y>=e.y-8&&t.y<=e.y+8}}]),e}(Shape);
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Waitpoint=function(e){function t(e,n,r,o){_classCallCheck(this,t);var i=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,n,r,o));return i.player=e,i}return _inherits(t,e),_createClass(t,[{key:"draw",value:function(){var e=this.context,t=this.player,n=this.position.point,r=1;this.drawFieldOfView(),e.beginPath(),e.fillStyle="rgba("+t.color+", "+r+")",e.strokeStyle="black",e.lineWidth=2,e.lineTo(n.x,n.y+12),e.lineTo(n.x+12,n.y-8),e.lineTo(n.x-12,n.y-8),e.closePath(),e.stroke(),e.fill(),this.fillText()}},{key:"isInBounds",value:function(e){var t=function(e,t,n){return e.x*(t.y-n.y)+t.x*(n.y-e.y)+n.x*(e.y-t.y)},n=this.position.point,r={x:n.x,y:n.y+12},o={x:n.x+12,y:n.y-8},i={x:n.x-12,y:n.y-8};return t(e,r,o)<=0&&t(e,o,i)<=0&&t(e,i,r)<=0}}]),t}(Shape);
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),Waypoint=function(t){function e(t,n,r,o){_classCallCheck(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r,o));return i.player=t,i}return _inherits(e,t),_createClass(e,[{key:"draw",value:function(){var t=this.player,e=this.position.point,n=this.context,r=1,o=2*Math.PI,i=2*o;n.beginPath(),n.fillStyle="rgba("+t.color+", "+r+")",n.strokeStyle="black",n.lineWidth=2;var a=CSMApi.Settings.PLAYER_RADIUS+3;n.arc(e.x,e.y,a,o,i,!1),n.closePath(),n.stroke(),n.fill(),this.fillText()}},{key:"isInBounds",value:function(t){var e=this.position.point;return Math.sqrt((t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y))<=CSMApi.Settings.PLAYER_RADIUS+3}}]),e}(Shape);
"use strict";!function(t){t.ShapeFactory={createShape:function(n){switch(n.shapeType){case t.EnumShape.Waypoint:return new Waypoint(n.player,n.position,n.context,n.text);case t.EnumShape.Syncpoint:return new Syncpoint(n.player,n.position,n.context,n.text);case t.EnumShape.Camppoint:return new Camppoint(n.player,n.position,n.context,n.text);case t.EnumShape.Waitpoint:return new Waitpoint(n.player,n.position,n.context,n.text)}}}}(window.CSMApi||(window.CSMApi={}));
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}();!function(t,e,n){e.EnumShape={Waypoint:1,Syncpoint:2,Waitpoint:3,Camppoint:4},e.Settings={ACTIVE_MENU:!1,PLAYER_RADIUS:5,FOV_RADIUS:45,NO_TEAM:0,TERRORIST:1,COUNTER_TERRORIST:2,FOV_COLOR_DARK:"140, 190, 140",FOV_COLOR:"200, 250, 200",TEAM_COLORS:["69, 69, 69","255, 63, 0","75, 148, 221"],PLAYER_COLORS:["138, 223, 125","222, 79, 58","238, 233, 32","98, 177, 242","242, 165, 60"]};var a={data:{positions:[],shapes:[],map:new Map("de_dust2","images/de_dust2.mask.png","images/de_dust2.png",876,606)},get:function(t,e){var n=new XMLHttpRequest;n.open("GET",t,!0),n.responseType="arraybuffer",n.onload=function(){this.status>=200&&e(this.response)},n.send()},throttle:function(t,e){var n=0;return function(){var a=Date.now();if(n+e<a)return n=a,t.apply(this,arguments)}}},i={appendCanvas:function(e){t.body.appendChild(e)},appendChild:function(e){t.querySelector("#container").appendChild(e)},destroyActiveMenus:function(){for(var e,n=t.querySelectorAll(".menu-context"),a=0;e=n[a];a++)null!==e.offsetParent&&e.parentNode.removeChild(e)},setContextMenu:function(e,n){var a=t.createElement("ul");a.className="menu-context";var o=!0,r=!1,s=void 0;try{for(var u,l=e[Symbol.iterator]();!(o=(u=l.next()).done);o=!0){var c=u.value,p=t.createElement("li");p.innerHTML=c.text,c.onclick&&p.addEventListener("click",c.onclick,!1),a.appendChild(p)}}catch(t){r=!0,s=t}finally{try{!o&&l.return&&l.return()}finally{if(r)throw s}}a.style.display="block",a.style.left=n.x+8+"px",a.style.top=n.y-2+"px",i.appendChild(a)},setBackground:function(t,e){t.style.backgroundImage="url("+a.data.map.image+")"},showFps:a.throttle(function(e){e=isFinite(e)?e:60,e=Math.round(10*e)/10,t.querySelector("#fps").innerHTML=e+" fps"},250)},o=function(){function o(){_classCallCheck(this,o),this.canvas=null,this.context=null,this.maskContext=null,this.mousePosition=null,this.bgImage=null,this.keysDown={}}return _createClass(o,[{key:"create",value:function(){var e=this;return e.canvas=t.createElement("canvas"),e.context=e.canvas.getContext("2d"),e.canvas.width=a.data.map.width,e.canvas.height=a.data.map.height,e.canvas.setAttribute("tabindex",1),i.appendCanvas(e.canvas),e}},{key:"getScenarioPointRGB",value:function(t){var e=this.maskContext.getImageData(t.x,t.y,1,1).data,n=((1<<24)+(e[0]<<16)+(e[1]<<8)+e[2]).toString(16).slice(1);return n}},{key:"isValidPoint",value:function(t){return"000000"!=this.getScenarioPointRGB(t)}},{key:"loadData",value:function(t,n,a){if(null==n)throw new Error("Positions not found");if(null==a)throw new Error("Shapes not found");var i=!0,o=!1,r=void 0;try{for(var s,u=t[Symbol.iterator]();!(i=(s=u.next()).done);i=!0){var l=s.value,c=1,p=!0,d=!1,y=void 0;try{for(var v,h=l.positions[Symbol.iterator]();!(p=(v=h.next()).done);p=!0){var f=v.value;n.push(f),a.push(e.ShapeFactory.createShape({context:this.context,player:l,position:f,shapeType:f.type,text:c++}))}}catch(t){d=!0,y=t}finally{try{!p&&h.return&&h.return()}finally{if(d)throw y}}}}catch(t){o=!0,r=t}finally{try{!i&&u.return&&u.return()}finally{if(o)throw r}}return this}},{key:"listen",value:function(){var t=this,n=!0,o=!1,s=null,u=null,l=function(t){u&&!o&&u.position.updateAngle(c(t))},c=function(e){var n=t.canvas.getBoundingClientRect(),a={x:e.clientX-n.left,y:e.clientY-n.top};return a},p=function(e){var n=s,a=t.isValidPoint(e);a&&(n.position.point=new MapPoint(e.x,e.y,n.position.point.under))};t.canvas.addEventListener("keydown",function(e){t.keysDown[e.keyCode]=!0},!1),t.canvas.addEventListener("keyup",function(e){delete t.keysDown[e.keyCode]},!1),t.canvas.addEventListener("mousedown",function(t){var e=c(t),i=!0,r=!1,l=void 0;try{for(var p,d=a.data.shapes[Symbol.iterator]();!(i=(p=d.next()).done);i=!0){var y=p.value,v=y.isInBounds(e);if(v){s=y,o=!1,n=!0,3!==t.which&&(u=s);break}}}catch(t){r=!0,l=t}finally{try{!i&&d.return&&d.return()}finally{if(r)throw l}}},!1);var d=function(n,o){var s=r[0],u=new PlayerPosition(new MapPoint(n.x,n.y),o);s.positions.push(u),a.data.positions.push(u),a.data.shapes.push(e.ShapeFactory.createShape({context:t.context,player:s,position:u,shapeType:u.type,text:s.positions.length})),i.destroyActiveMenus()};return t.canvas.addEventListener("contextmenu",function(n){n.preventDefault();var a=c(n),o=t.isValidPoint(a);if(o){i.destroyActiveMenus();var r=[{text:"Create Waypoint",onclick:function(){return d(a,e.EnumShape.Waypoint)}},{text:"Create Syncpoint",onclick:function(){return d(a,e.EnumShape.Syncpoint)}},{text:"Create Waitpoint",onclick:function(){return d(a,e.EnumShape.Waitpoint)}},{text:"Create Camppoint",onclick:function(){return d(a,e.EnumShape.Camppoint)}}];i.setContextMenu(r,a)}},!1),t.canvas.addEventListener("click",i.destroyActiveMenus,!1),t.canvas.addEventListener("mousemove",function(t){s?(p(c(t)),o=!0):n||l(t)},!1),t.canvas.addEventListener("mouseup",function(t){s=null,n=!n,n&&(u=null)},!1),t}},{key:"setBackground",value:function(){var e=this;i.setBackground(e.canvas,a.data.map.image);var n=t.createElement("canvas");n.width=a.data.map.width,n.height=a.data.map.height;var o=n.getContext("2d");return e.bgImage=new Image,e.bgImage.onload=function(){o.drawImage(e.bgImage,0,0),a.data.map.loaded=!0},e.bgImage.src=a.data.map.imageMask,e.maskContext=o,e}},{key:"update",value:function(t){}},{key:"render",value:function(){if(a.data.map.loaded){var t=this;t.context.clearRect(0,0,t.canvas.width,t.canvas.height);var e=!0,n=!1,i=void 0;try{for(var o,r=a.data.shapes[Symbol.iterator]();!(e=(o=r.next()).done);e=!0){var s=o.value;s.draw()}}catch(t){n=!0,i=t}finally{try{!e&&r.return&&r.return()}finally{if(n)throw i}}}}},{key:"animate",value:function(t){var e=Date.now(),a=e-t,o=this,r=a/1e3;o.update(r),o.render();var s=1/r;i.showFps(s),n(o.animate.bind(o,e))}}]),o}(),r=[new Player("Player 1",[new PlayerPosition(new MapPoint(180,66),e.EnumShape.Waypoint)],e.Settings.COUNTER_TERRORIST,e.Settings.PLAYER_COLORS[0]),new Player("Player 2",[new PlayerPosition(new MapPoint(210,66),e.EnumShape.Syncpoint)],e.Settings.COUNTER_TERRORIST,e.Settings.PLAYER_COLORS[1]),new Player("Player 3",[new PlayerPosition(new MapPoint(240,66),e.EnumShape.Waitpoint)],e.Settings.COUNTER_TERRORIST,e.Settings.PLAYER_COLORS[2]),new Player("Player 4",[new PlayerPosition(new MapPoint(270,96),e.EnumShape.Waypoint),new PlayerPosition(new MapPoint(270,66),e.EnumShape.Camppoint)],e.Settings.COUNTER_TERRORIST,e.Settings.PLAYER_COLORS[3]),new Player("Player 5",[new PlayerPosition(new MapPoint(310,66),e.EnumShape.Syncpoint)],e.Settings.COUNTER_TERRORIST,e.Settings.PLAYER_COLORS[4])];(new o).create().setBackground().loadData(r,a.data.positions,a.data.shapes).listen().animate(Date.now())}(document,window.CSMApi||(window.CSMApi={}),window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)});