!function(a){var b=this;"object"==typeof exports?module.exports=a(b):"function"==typeof define&&define.amd?define([],function(){return a(b)}):b.jDataView=a(b)}(function(a){"use strict";function b(a,b){return"object"!=typeof a||null===a?!1:a.constructor===b||Object.prototype.toString.call(a)==="[object "+b.name+"]"}function c(a,c){return!c&&b(a,Array)?a:Array.prototype.slice.call(a)}function d(a,b){return void 0!==a?a:b}function e(a,c,f,g){if(e.is(a)){var h=a.slice(c,c+f);return h._littleEndian=d(g,h._littleEndian),h}if(!e.is(this))return new e(a,c,f,g);if(this.buffer=a=e.wrapBuffer(a),this._isArrayBuffer=j.ArrayBuffer&&b(a,ArrayBuffer),this._isPixelData=!0&&j.PixelData&&b(a,CanvasPixelArray),this._isDataView=j.DataView&&this._isArrayBuffer,this._isNodeBuffer=!1,!this._isArrayBuffer&&!this._isPixelData&&!b(a,Array))throw new TypeError("jDataView buffer has an incompatible type");this._littleEndian=!!g;var i="byteLength"in a?a.byteLength:a.length;this.byteOffset=c=d(c,0),this.byteLength=f=d(f,i-c),this._offset=this._bitOffset=0,this._isDataView?this._view=new DataView(a,c,f):this._checkBounds(c,f,i),this._engineAction=this._isDataView?this._dataViewAction:this._isArrayBuffer?this._arrayBufferAction:this._arrayAction}function f(a){for(var b=j.ArrayBuffer?Uint8Array:Array,c=new b(a.length),d=0,e=a.length;e>d;d++)c[d]=255&a.charCodeAt(d);return c}function g(a){return a>=0&&31>a?1<<a:g[a]||(g[a]=Math.pow(2,a))}function h(a,b){this.lo=a,this.hi=b}function i(){h.apply(this,arguments)}var j={NodeBuffer:!1,DataView:"DataView"in a,ArrayBuffer:"ArrayBuffer"in a,PixelData:!0&&"CanvasPixelArray"in a&&!("Uint8ClampedArray"in a)&&"document"in a},k=a.TextEncoder,l=a.TextDecoder;if(j.PixelData)var m=document.createElement("canvas").getContext("2d"),n=function(a,b){var c=m.createImageData((a+3)/4,1).data;if(c.byteLength=a,void 0!==b)for(var d=0;a>d;d++)c[d]=b[d];return c};var o={Int8:1,Int16:2,Int32:4,Uint8:1,Uint16:2,Uint32:4,Float32:4,Float64:8};e.wrapBuffer=function(a){switch(typeof a){case"number":if(j.ArrayBuffer)a=new Uint8Array(a).buffer;else if(j.PixelData)a=n(a);else{a=new Array(a);for(var d=0;d<a.length;d++)a[d]=0}return a;case"string":a=f(a);default:return"length"in a&&!(j.ArrayBuffer&&b(a,ArrayBuffer)||j.PixelData&&b(a,CanvasPixelArray))&&(j.ArrayBuffer?b(a,ArrayBuffer)||(a=new Uint8Array(a).buffer,b(a,ArrayBuffer)||(a=new Uint8Array(c(a,!0)).buffer)):a=j.PixelData?n(a.length,a):c(a)),a}},e.is=function(a){return a&&a.jDataView},e.from=function(){return new e(arguments)},e.Uint64=h,h.prototype={valueOf:function(){return this.lo+g(32)*this.hi},toString:function(){return Number.prototype.toString.apply(this.valueOf(),arguments)}},h.fromNumber=function(a){var b=Math.floor(a/g(32)),c=a-b*g(32);return new h(c,b)},e.Int64=i,i.prototype="create"in Object?Object.create(h.prototype):new h,i.prototype.valueOf=function(){return this.hi<g(31)?h.prototype.valueOf.apply(this,arguments):-(g(32)-this.lo+g(32)*(g(32)-1-this.hi))},i.fromNumber=function(a){var b,c;if(a>=0){var d=h.fromNumber(a);b=d.lo,c=d.hi}else c=Math.floor(a/g(32)),b=a-c*g(32),c+=g(32);return new i(b,c)};var p=e.prototype={compatibility:j,jDataView:!0,_checkBounds:function(a,b,c){if("number"!=typeof a)throw new TypeError("Offset is not a number.");if("number"!=typeof b)throw new TypeError("Size is not a number.");if(0>b)throw new RangeError("Length is negative.");if(0>a||a+b>d(c,this.byteLength))throw new RangeError("Offsets are out of bounds.")},_action:function(a,b,c,e,f){return this._engineAction(a,b,d(c,this._offset),d(e,this._littleEndian),f)},_dataViewAction:function(a,b,c,d,e){return this._offset=c+o[a],b?this._view["get"+a](c,d):this._view["set"+a](c,e,d)},_arrayBufferAction:function(b,c,e,f,g){var h,i=o[b],j=a[b+"Array"];if(f=d(f,this._littleEndian),1===i||(this.byteOffset+e)%i===0&&f)return h=new j(this.buffer,this.byteOffset+e,1),this._offset=e+i,c?h[0]:h[0]=g;var k=new Uint8Array(c?this.getBytes(i,e,f,!0):i);return h=new j(k.buffer,0,1),c?h[0]:(h[0]=g,void this._setBytes(e,k,f))},_arrayAction:function(a,b,c,d,e){return b?this["_get"+a](c,d):this["_set"+a](c,e,d)},_getBytes:function(a,b,e){e=d(e,this._littleEndian),b=d(b,this._offset),a=d(a,this.byteLength-b),this._checkBounds(b,a),b+=this.byteOffset,this._offset=b-this.byteOffset+a;var f=this._isArrayBuffer?new Uint8Array(this.buffer,b,a):(this.buffer.slice||Array.prototype.slice).call(this.buffer,b,b+a);return e||1>=a?f:c(f).reverse()},getBytes:function(a,b,e,f){var g=this._getBytes(a,b,d(e,!0));return f?c(g):g},_setBytes:function(a,b,e){var f=b.length;if(0!==f){if(e=d(e,this._littleEndian),a=d(a,this._offset),this._checkBounds(a,f),!e&&f>1&&(b=c(b,!0).reverse()),a+=this.byteOffset,this._isArrayBuffer)new Uint8Array(this.buffer,a,f).set(b);else for(var g=0;f>g;g++)this.buffer[a+g]=b[g];this._offset=a-this.byteOffset+f}},setBytes:function(a,b,c){this._setBytes(a,b,d(c,!0))},getString:function(a,b,c){var d=this._getBytes(a,b,!0);if(c="utf8"===c?"utf-8":c||"binary",l&&"binary"!==c)return new l(c).decode(this._isArrayBuffer?d:new Uint8Array(d));var e="";a=d.length;for(var f=0;a>f;f++)e+=String.fromCharCode(d[f]);return"utf-8"===c&&(e=decodeURIComponent(escape(e))),e},setString:function(a,b,c){c="utf8"===c?"utf-8":c||"binary";var d;k&&"binary"!==c?d=new k(c).encode(b):("utf-8"===c&&(b=unescape(encodeURIComponent(b))),d=f(b)),this._setBytes(a,d,!0)},getChar:function(a){return this.getString(1,a)},setChar:function(a,b){this.setString(a,b)},tell:function(){return this._offset},seek:function(a){return this._checkBounds(a,0),this._offset=a},skip:function(a){return this.seek(this._offset+a)},slice:function(a,b,c){function f(a,b){return 0>a?a+b:a}return a=f(a,this.byteLength),b=f(d(b,this.byteLength),this.byteLength),c?new e(this.getBytes(b-a,a,!0,!0),void 0,void 0,this._littleEndian):new e(this.buffer,this.byteOffset+a,b-a,this._littleEndian)},alignBy:function(a){return this._bitOffset=0,1!==d(a,1)?this.skip(a-(this._offset%a||a)):this._offset},_getFloat64:function(a,b){var c=this._getBytes(8,a,b),d=1-2*(c[7]>>7),e=((c[7]<<1&255)<<3|c[6]>>4)-1023,f=(15&c[6])*g(48)+c[5]*g(40)+c[4]*g(32)+c[3]*g(24)+c[2]*g(16)+c[1]*g(8)+c[0];return 1024===e?0!==f?0/0:1/0*d:-1023===e?d*f*g(-1074):d*(1+f*g(-52))*g(e)},_getFloat32:function(a,b){var c=this._getBytes(4,a,b),d=1-2*(c[3]>>7),e=(c[3]<<1&255|c[2]>>7)-127,f=(127&c[2])<<16|c[1]<<8|c[0];return 128===e?0!==f?0/0:1/0*d:-127===e?d*f*g(-149):d*(1+f*g(-23))*g(e)},_get64:function(a,b,c){c=d(c,this._littleEndian),b=d(b,this._offset);for(var e=c?[0,4]:[4,0],f=0;2>f;f++)e[f]=this.getUint32(b+e[f],c);return this._offset=b+8,new a(e[0],e[1])},getInt64:function(a,b){return this._get64(i,a,b)},getUint64:function(a,b){return this._get64(h,a,b)},_getInt32:function(a,b){var c=this._getBytes(4,a,b);return c[3]<<24|c[2]<<16|c[1]<<8|c[0]},_getUint32:function(a,b){return this._getInt32(a,b)>>>0},_getInt16:function(a,b){return this._getUint16(a,b)<<16>>16},_getUint16:function(a,b){var c=this._getBytes(2,a,b);return c[1]<<8|c[0]},_getInt8:function(a){return this._getUint8(a)<<24>>24},_getUint8:function(a){return this._getBytes(1,a)[0]},_getBitRangeData:function(a,b){var c=(d(b,this._offset)<<3)+this._bitOffset,e=c+a,f=c>>>3,g=e+7>>>3,h=this._getBytes(g-f,f,!0),i=0;(this._bitOffset=7&e)&&(this._bitOffset-=8);for(var j=0,k=h.length;k>j;j++)i=i<<8|h[j];return{start:f,bytes:h,wideValue:i}},getSigned:function(a,b){var c=32-a;return this.getUnsigned(a,b)<<c>>c},getUnsigned:function(a,b){var c=this._getBitRangeData(a,b).wideValue>>>-this._bitOffset;return 32>a?c&~(-1<<a):c},_setBinaryFloat:function(a,b,c,d,e){var f,h,i=0>b?1:0,j=~(-1<<d-1),k=1-j;0>b&&(b=-b),0===b?(f=0,h=0):isNaN(b)?(f=2*j+1,h=1):1/0===b?(f=2*j+1,h=0):(f=Math.floor(Math.log(b)/Math.LN2),f>=k&&j>=f?(h=Math.floor((b*g(-f)-1)*g(c)),f+=j):(h=Math.floor(b/g(k-c)),f=0));for(var l=[];c>=8;)l.push(h%256),h=Math.floor(h/256),c-=8;for(f=f<<c|h,d+=c;d>=8;)l.push(255&f),f>>>=8,d-=8;l.push(i<<d|f),this._setBytes(a,l,e)},_setFloat32:function(a,b,c){this._setBinaryFloat(a,b,23,8,c)},_setFloat64:function(a,b,c){this._setBinaryFloat(a,b,52,11,c)},_set64:function(a,b,c,e){"object"!=typeof c&&(c=a.fromNumber(c)),e=d(e,this._littleEndian),b=d(b,this._offset);var f=e?{lo:0,hi:4}:{lo:4,hi:0};for(var g in f)this.setUint32(b+f[g],c[g],e);this._offset=b+8},setInt64:function(a,b,c){this._set64(i,a,b,c)},setUint64:function(a,b,c){this._set64(h,a,b,c)},_setUint32:function(a,b,c){this._setBytes(a,[255&b,b>>>8&255,b>>>16&255,b>>>24],c)},_setUint16:function(a,b,c){this._setBytes(a,[255&b,b>>>8&255],c)},_setUint8:function(a,b){this._setBytes(a,[255&b])},setUnsigned:function(a,b,c){var d=this._getBitRangeData(c,a),e=d.wideValue,f=d.bytes;e&=~(~(-1<<c)<<-this._bitOffset),e|=(32>c?b&~(-1<<c):b)<<-this._bitOffset;for(var g=f.length-1;g>=0;g--)f[g]=255&e,e>>>=8;this._setBytes(d.start,f,!0)}};for(var q in o)!function(a){p["get"+a]=function(b,c){return this._action(a,!0,b,c)},p["set"+a]=function(b,c,d){this._action(a,!1,b,d,c)}}(q);p._setInt32=p._setUint32,p._setInt16=p._setUint16,p._setInt8=p._setUint8,p.setSigned=p.setUnsigned;for(var r in p)"set"===r.slice(0,3)&&!function(a){p["write"+a]=function(){Array.prototype.unshift.call(arguments,void 0),this["set"+a].apply(this,arguments)}}(r.slice(3));return e});
//# sourceMappingURL=jdataview.js.map


(function(document, w, requestAnimationFrame) {

	var Api = {
		settings: {
			PLAYER_RADIUS: 5,
			FOV_RADIUS: 45,
			NO_TEAM: 0,
			TERRORIST: 1, 
			COUNTER_TERRORIST: 2, 
			FOV_COLOR_DARK: "140, 190, 140", 
			FOV_COLOR: "200, 250, 200", 
			TEAM_COLORS: ["69, 69, 69", "255, 63, 0", "75, 148, 221"]
		},
		get: function(url, success) {

			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
			  if (this.status >= 200) {
			  	success(this.response);
			  }
			};

			request.send();
		},
		throttle: function(func, interval) {
		    var lastCall = 0;
		    return function() {
		        var now = Date.now();
		        if (lastCall + interval < now) {
		            lastCall = now;
		            return func.apply(this, arguments);
		        }
		    };
		}		
	}


	var MapPoint = function(a, b, c) {
	    this.x = a;
	    this.y = b;
	    this.under = c;
	}

    MapPoint.prototype.near = function(a) {
        return a.y <= this.y + 2 && this.y <= a.y && a.x <= this.x + 2 && 
    		   this.x <= a.x && this.under == a.under;
    }

	var Map = function(a, b, c, d, e, f, g, h) {
	    this.x = a;
	    this.y = b;
	    this.name = c;
	    this.image = e;
	    this.width = f;
	    this.height = g;
	    this.pointCount = h;
	    this.points = [];
	    this.loaded = !1;
	    this.loadMap(d);
	}

	Map.prototype.loadMap = function(url) {
	    var self = this;
	    Api.get(url, function(data) {	    
	        self.readBinaryPoints(new jDataView(data));
	        self.loaded = !0
	    })
	}

	Map.prototype.readBinaryPoints = function(data) {
	    var b;
	    try {
	        for (b = 1; b < this.pointCount; b++) {
	            var c, d, e, f, g;
	            f = data.getUint8();
	            g = data.getUint8();
	            c = g << 8 | f;
	            f = data.getUint8();
	            g = data.getUint8();
	            d = g << 8 | f;
	            e = data.getInt8();
	            this.points[b] = new MapPoint(3 * c + this.x,3 * d + this.y,e > 0);
	        }
	    } catch (h) {
	        console.log(h)
	    }
	}

	var Player = function(name, x, y, team) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.radius = 5;
		this.health = 100;
		this.viewAngle = 0;
		this.team = team;
	};

	Player.prototype.updateAngle = function(position) {
	    var deltaY = position.y - this.y;
	    var deltaX = position.x - this.x;
	    var theta = Math.atan2(-deltaY, deltaX)
	    if (theta < 0) theta += 2 * Math.PI;
	    var angle = theta * 180 / Math.PI;

	    if (deltaX > 1 || deltaX < 0 || deltaY > 1 || deltaY < 0)
		    this.viewAngle = Math.abs(angle);
	};

	var CanvasContext = function() {
		this.canvas = null;
		this.context = null;
		this.mousePosition = null;
		this.bgReady = false;
		this.bgImage = null;
		// Handle keyboard controls
		this.keysDown = {};

	}
	CanvasContext.prototype.create = function() {
		// Create the canvas
		var self = this;
		self.canvas = document.createElement("canvas");
		self.context = self.canvas.getContext("2d");
		self.canvas.width = map.width;
		self.canvas.height = map.height;
		self.canvas.setAttribute('tabindex', 1);
		document.body.appendChild(self.canvas);

		return self;
	};

	CanvasContext.prototype.listen = function() {
		var self = this;
		self.canvas.addEventListener('mousemove', function(evt) {
			var rect = self.canvas.getBoundingClientRect();
		    self.mousePosition = {
		      x: evt.clientX - rect.left,
		      y: evt.clientY - rect.top
		    }
		}, false);

		self.canvas.addEventListener('keydown', function (e) {
			self.keysDown[e.keyCode] = true;
		}, false);

		self.canvas.addEventListener('keyup', function (e) {
			delete self.keysDown[e.keyCode];
		}, false);

		return self;
	}

	CanvasContext.prototype.setBackground = function() {
		var self = this;

		self.bgImage = new Image();
		self.bgImage.onload = function () {
			self.bgReady = true;
		};
		self.bgImage.src = map.image;

		return self;
	};

	// Update game objects
	CanvasContext.prototype.update = function (modifier) {

		modifier = 3;
		
		var moveTo = new MapPoint(player.x, player.y, false);
		var keysDown = this.keysDown;

		if (38 in keysDown || 87 in keysDown) { // Player holding up
			moveTo.y -= modifier
		}
		if (40 in keysDown || 83 in keysDown) { // Player holding down
			moveTo.y += modifier
		}
		if (37 in keysDown || 65 in keysDown) { // Player holding left
			moveTo.x -= modifier
		}
		if (39 in keysDown || 68 in keysDown) { // Player holding right
			moveTo.x += modifier
		}

		var find = map.points.find(function(point) {
			if (point == undefined) return false;
			return point.near(moveTo);
		});

		if (find) {
			player.x = moveTo.x;
			player.y = moveTo.y;
		}

		player.updateAngle(this.mousePosition || {x: player.x, y: player.y});
	};

	// Draw everything
	CanvasContext.prototype.render = function () {
		if (this.bgReady) {
			this.context.drawImage(this.bgImage, 0, 0);
		}

	    var c = 1,
	    	d = 2 * Math.PI,
		    e = 0,
		    a = this.context,
		    b = Api.settings;

		a.save()
		a.beginPath()
		a.arc(player.x, player.y, b.PLAYER_RADIUS + 3, d, e, !1)
		a.closePath();
		var f = a.createRadialGradient(player.x, player.y, 1, player.x, player.y, b.PLAYER_RADIUS + 6);
		
		f.addColorStop(0, "rgba(50, 50, 50, " + c + ")")
		f.addColorStop(1, "rgba(50, 50, 50, 0)")
		a.fillStyle = "rgba(239, 242, 248, 0.2)"
		a.fill()
		a.restore()

	    a.beginPath()
	    a.moveTo(player.x, player.y)
	    a.arc(player.x, player.y, b.FOV_RADIUS, -(player.viewAngle * Math.PI / 180) - .25 * Math.PI, -(player.viewAngle * Math.PI / 180) + .25 * Math.PI, !1)
	    a.closePath();
	    
	    var g = a.createRadialGradient(player.x, player.y, 1, player.x, player.y, b.FOV_RADIUS);
	    g.addColorStop(0, "rgba(" + b.FOV_COLOR_DARK + ", 0.33)")
	    g.addColorStop(2 / 3, "rgba(" + b.FOV_COLOR + ", 0.33)")
	    g.addColorStop(1, "rgba(" + b.FOV_COLOR + ", 0)")
	    a.fillStyle = "rgba(239, 242, 248, 0.2)"
	    a.fill()	
		
		a.beginPath()
		a.arc(player.x, player.y, b.PLAYER_RADIUS, d, e, !1)
		a.closePath()
		a.lineWidth = 2
		a.strokeStyle = "rgba(0, 0, 0, " + c + ")"
		a.stroke()
		a.fillStyle = "rgba(239, 242, 248, " + c + ")"
		a.fill()

		d = 1.5 * Math.PI
		e = d + 2 * Math.PI / 100 * player.health
		
		a.beginPath()
		a.moveTo(player.x, player.y)
		a.arc(player.x, player.y, b.PLAYER_RADIUS, d, e, !1)
		a.closePath()
		a.fillStyle = "rgba(" + b.TEAM_COLORS[player.team] + ", " + c + ")"
		a.fill()
		a.font = "bold 8px Arial"
		a.textAlign = "center"

		if (player.team == b.COUNTER_TERRORIST)
			a.strokeStyle = "rgba(255, 255, 255, " + c + ")"
		a.strokeText(player.name, player.x, player.y - 15)
		a.fillText(player.name, player.x, player.y - 15)
	};

	// The main game loop
	CanvasContext.prototype.animate = function (then) {
		var now = Date.now();
		var delta = now - then;
		var self = this;

		self.update(delta / 1000);
		self.render();

		// Request to do this again ASAP
		requestAnimationFrame(self.animate.bind(self, now));
	};

	// Game objects
	var player = new Player('Player', 180, 66, Api.settings.COUNTER_TERRORIST);	
	var map = window.Map = new Map(
		117,0,"de_dust2","maps/de_dust2.new.map","images/de_dust2.png",876,606,17985);

	new CanvasContext().create()
					   .setBackground()
				   	   .listen()
				   	   .animate(Date.now());

}(document, window, window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame || 
					window.msRequestAnimationFrame || 
					window.mozRequestAnimationFrame));