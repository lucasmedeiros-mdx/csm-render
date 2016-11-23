(function(document, w, requestAnimationFrame) {

    var Api = {
        data: {
            positions: [],
            shapes: []
        },
        settings: {
            ACTIVE_MENU: false,
            PLAYER_RADIUS: 5,
            FOV_RADIUS: 45,
            NO_TEAM: 0,
            TERRORIST: 1, 
            COUNTER_TERRORIST: 2, 
            FOV_COLOR_DARK: "140, 190, 140", 
            FOV_COLOR: "200, 250, 200", 
            TEAM_COLORS: ["69, 69, 69", "255, 63, 0", "75, 148, 221"],
            PLAYER_COLORS: ["138, 223, 125", "222, 79, 58", "238, 233, 32", "98, 177, 242", "242, 165, 60"],
            EnumShape: {
                Waypoint: 1,
                Syncpoint: 2,
                Waitpoint: 3,
                Camppoint: 4
            }
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

    var MapPoint = function(x, y, under) {
        this.x = x;
        this.y = y;
        this.under = under;
    }

    MapPoint.prototype.near = function(a) {
        return a.y <= this.y + 2 && this.y <= a.y && a.x <= this.x + 2 && 
               this.x <= a.x && this.under == a.under;
    }

    var PlayerPosition = function(mapPoint, type, viewAngle) {
        this.point = mapPoint;
        this.viewAngle = viewAngle || 0;
        this.type = type;
    }

    PlayerPosition.prototype.updateAngle = function(position) {
        var deltaY = position.y - this.point.y;
        var deltaX = position.x - this.point.x;
        var theta = Math.atan2(-deltaY, deltaX)
        if (theta < 0) theta += 2 * Math.PI;
        var angle = theta * 180 / Math.PI;

        if (deltaX > 1 || deltaX < 0 || deltaY > 1 || deltaY < 0) {
            this.viewAngle = Math.abs(angle);            
        }
    };    

    var ShapeFactory = {
        createShape: function(shapeRequest) {
            switch(shapeRequest.shapeType) {
                case Api.settings.EnumShape.Waypoint:
                    return new Waypoint(shapeRequest.player, shapeRequest.position, 
                                        shapeRequest.context, shapeRequest.text);
                case Api.settings.EnumShape.Syncpoint:
                    return new Syncpoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
                case Api.settings.EnumShape.Camppoint:
                    return new Camppoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
                case Api.settings.EnumShape.Waitpoint:
                    return new Waitpoint(shapeRequest.player, shapeRequest.position, 
                                         shapeRequest.context, shapeRequest.text);
            }
        }
    }

    var Map = function(a, b, c, d, e, f, g, h) {
        this.x = a;
        this.y = b;
        this.name = c;
        this.image = e;
        this.imageMask = d;
        this.width = f;
        this.height = g;
        this.pointCount = h;
        this.points = [];
        this.loaded = !1;        
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

    var Player = function(name, positions, team, color) {
        this.name = name;
        this.health = 100;
        this.positions = positions || [];
        this.color = color;
        this.team = team;
        this.viewAngle = 0;
    };

    class Shape {
        constructor(position, context, text) {            
            this.context = context;
            this.text = text;
            this.position = position;
        }

        fillText() {
            var context = this.context,
                p = this.position.point;

            context.fillStyle = "black";
            context.font = '12px Arial';
            context.fillText(this.text, p.x - 4, p.y + 4);
        }

        drawFieldOfView() {
            var a = this.context,
                b = Api.settings,
                pos = this.position,
                p = this.position.point;

            a.beginPath()
            a.moveTo(p.x, p.y)
            a.arc(p.x, 
                  p.y, 
                  b.FOV_RADIUS, 
                  -(pos.viewAngle * Math.PI / 180) - .25 * Math.PI, 
                  -(pos.viewAngle * Math.PI / 180) + .25 * Math.PI, 
                  !1)            

            var g = a.createRadialGradient(p.x, p.y, 1, p.x, p.y, b.FOV_RADIUS);
            g.addColorStop(0, "rgba(" + b.FOV_COLOR_DARK + ", 0.33)")
            g.addColorStop(2 / 3, "rgba(" + b.FOV_COLOR + ", 0.33)")
            g.addColorStop(1, "rgba(" + b.FOV_COLOR + ", 0)")
            a.closePath()
            a.fillStyle = "rgba(239, 242, 248, 0.2)"
            a.fill()
        }

    }

    class Waypoint extends Shape {
        constructor(player, position, context, order) {            
            super(position, context, order);
            this.player = player;
        }

        draw() {
            var player = this.player,
                p = this.position.point,
                context = this.context,
                c = 1,
                d = 2 * Math.PI,
                e = 2 * d

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")"
            context.strokeStyle = "black";
            context.lineWidth = 2
            var radius = Api.settings.PLAYER_RADIUS + 3;
            context.arc(p.x, p.y, radius, d, e, !1);
            context.closePath();
            context.stroke(); 
            context.fill();

            this.fillText()
        }

        isInBounds(point) {
            var p = this.position.point;
            return Math.sqrt((point.x-p.x)*(point.x-p.x) + (point.y-p.y)*(point.y-p.y)) <= Api.settings.PLAYER_RADIUS + 3
        }
    }

    class Syncpoint extends Shape {
        constructor(player, position, context, order) {
            super(position, context, order);
            this.player = player;
        }

        draw() {
            var context = this.context,
                player = this.player,
                p = this.position.point,
                c = 1;

            this.drawFieldOfView();

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")"
            context.strokeStyle = "black";
            context.lineWidth = 2
            context.closePath()
            context.strokeRect(p.x - 8, p.y - 8, 16, 16)
            context.fillRect(p.x - 8, p.y - 8, 16, 16);
            
            this.fillText()
        }

        isInBounds(point) {
            var p = this.position.point;
            return point.x >= p.x - 8 &&
                   point.x <= p.x + 8 &&
                   point.y >= p.y - 8 &&
                   point.y <= p.y + 8;
        }
    }

    class Camppoint extends Shape {
        constructor(player, position, context, order) {
            super(position, context, order);
            this.player = player;
        }

        draw() {
            var context = this.context,
                player = this.player,
                p = this.position.point,
                c = 1;

            this.drawFieldOfView();

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")"
            context.strokeStyle = "black";
            context.lineWidth = 2
            context.lineTo(p.x, p.y - 12);
            context.lineTo(p.x + 12, p.y + 8);
            context.lineTo(p.x - 12, p.y + 8);
            context.closePath();
            context.stroke(); 
            context.fill();

            this.fillText();
        }

        isInBounds(point) {
            var det = function(p1, p2, p3) {
                return p1.x*(p2.y-p3.y)+p2.x*(p3.y-p1.y)+p3.x*(p1.y-p2.y);
            }

            var p = this.position.point,
                p1 = {x: p.x, y: p.y - 12},
                p2 = {x: p.x + 12, y: p.y + 8},
                p3 = {x: p.x - 12, y: p.y + 8};

            return det(point, p1, p2) >= 0 && det(point, p2, p3) >= 0 && det(point, p3, p1) >= 0;

        }
    }

    class Waitpoint extends Shape {
        constructor(player, position, context, order) {
            super(position, context, order);
            this.player = player;
        }

        draw() {
            var context = this.context,
                player = this.player,
                p = this.position.point,
                c = 1;        

            this.drawFieldOfView();

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")"
            context.strokeStyle = "black";
            context.lineWidth = 2
            context.lineTo(p.x, p.y + 12);
            context.lineTo(p.x + 12, p.y - 8);
            context.lineTo(p.x - 12, p.y - 8);
            context.closePath();
            context.stroke(); 
            context.fill();

            this.fillText()
        }

        isInBounds(point) {

            var det = function(p1, p2, p3) {
                return p1.x*(p2.y-p3.y)+p2.x*(p3.y-p1.y)+p3.x*(p1.y-p2.y);
            }

            var p = this.position.point,
                p1 = {x: p.x, y: p.y + 12},
                p2 = {x: p.x + 12, y: p.y - 8},
                p3 = {x: p.x - 12, y: p.y - 8};

            return det(point, p1, p2) <= 0 && det(point, p2, p3) <= 0 && det(point, p3, p1) <= 0;
        }
    }

    var CanvasContext = function() {
        this.canvas = null;
        this.context = null;
        this.maskContext = null;
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

    CanvasContext.prototype.getScenarioPointRGB = function(point) {
        var data = this.maskContext.getImageData(point.x,point.y,1,1).data;
        var rgb = ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
        return rgb;        
    }


    CanvasContext.prototype.isValid = function(point) {
        return this.getScenarioPointRGB(point) != '000000';        
    }

    CanvasContext.prototype.loadData = function(players) {

        if (Api.data.positions == null) throw new Error("Positions not found");
        if (Api.data.shapes == null) throw new Error("Shapes not found");

        for (var player of players) {
            var counter = 1;
            for (var position of player.positions) {
                Api.data.positions.push(position);
                Api.data.shapes.push(ShapeFactory.createShape({
                    context: this.context, 
                    player: player, 
                    position: position, 
                    shapeType: position.type,
                    text: counter++
                }));
            }
        }
        return this;
    }

    CanvasContext.prototype.listen = function() {
        var self = this;
        var mouseAngleLocked = true;
        var dragged = false;
        var activeElement = null;
        var activeAngleElement = null;

        var setMousePosition = function(position) {
            if (activeAngleElement && !dragged) {
                activeAngleElement.position.updateAngle(position);
            }
        }

        var getMousePosition = function(evt) {
            var rect = self.canvas.getBoundingClientRect();
            var mousePosition = {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            }
            return mousePosition;
        }

        var move = function(pos) {
            var shape = activeElement;
            var isInBounds = self.isValid(pos);            

            if (isInBounds) {
                shape.position.point = new MapPoint(pos.x, pos.y, shape.position.point.under);
            }
        }

        var destroyActiveMenus = function()  {
            var menus = document.querySelectorAll('.menu-context');
            for (var i = 0, element; element = menus[i]; i++) {
                if (element.offsetParent !== null) element.parentNode.removeChild(element);
            }
        }        

        self.canvas.addEventListener('keydown', function (e) {
            self.keysDown[e.keyCode] = true;
        }, false);

        self.canvas.addEventListener('keyup', function (e) {
            delete self.keysDown[e.keyCode];
        }, false);

        self.canvas.addEventListener('mousedown', function(e){
            var pos = getMousePosition(e);

            for (var shape of Api.data.shapes) {
                var isInBounds = shape.isInBounds(pos);

                if (isInBounds) {
                    activeElement = activeAngleElement = shape;
                    dragged = false;
                    mouseAngleLocked = true;
                    break;
                }
            }
        }, false);

        var bindCreateShape = function(position, enumShape) {
            var player = players[0];

            var playerPosition = new PlayerPosition(
                new MapPoint(position.x, position.y), enumShape);
            player.positions.push(playerPosition);

            Api.data.positions.push(playerPosition);
            Api.data.shapes.push(ShapeFactory.createShape({
                context: self.context, 
                player: player, 
                position: playerPosition, 
                shapeType: playerPosition.type,
                text: player.positions.length
            }));

            destroyActiveMenus();
        }

        self.canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            var position = getMousePosition(e);

            var isInBounds = self.isValid(position);
            if (!isInBounds) return;

            destroyActiveMenus();

            var menu = document.createElement('ul');
            menu.className = 'menu-context';

            var menuContextOptions = [{
                text: 'Create Waypoint',
                onclick: () => bindCreateShape(position, Api.settings.EnumShape.Waypoint)
            }, {
                text: 'Create Syncpoint',
                onclick: () => bindCreateShape(position, Api.settings.EnumShape.Syncpoint)
            }, {
                text: 'Create Waitpoint',
                onclick: () => bindCreateShape(position, Api.settings.EnumShape.Waitpoint)
            }, {
                text: 'Create Camppoint',
                onclick: () => bindCreateShape(position, Api.settings.EnumShape.Camppoint)
            }];

            for (var option of menuContextOptions) {
                var child = document.createElement('li');
                child.innerHTML = option.text;
                if (option.onclick) child.addEventListener('click', option.onclick, false);
                menu.appendChild(child)
            }

            menu.style.display = 'block';
            menu.style.left = position.x + 8 + 'px';
            menu.style.top = position.y - 2 + 'px';

            document.querySelector('#container').appendChild(menu);    
        }, false);

        self.canvas.addEventListener('click', destroyActiveMenus, false);

        self.canvas.addEventListener('mousemove', function(evt) {
            if (activeElement) {
                move(getMousePosition(evt));
                dragged = true                

            } else if (!mouseAngleLocked && !dragged) {
                setMousePosition(evt);
            }
        }, false);

        self.canvas.addEventListener('mouseup', function(e){            
            activeElement = null;
            mouseAngleLocked = !mouseAngleLocked;

            if (mouseAngleLocked) activeAngleElement = null;
        }, false);

        return self;
    }

    CanvasContext.prototype.setBackground = function() {
        var self = this;
        self.canvas.style.backgroundImage = 'url(' + map.image + ')';

        var canvas = document.createElement( 'canvas' );
        canvas.width = map.width;
        canvas.height = map.height;
        var context = canvas.getContext('2d');

        self.bgImage = new Image();
        self.bgImage.onload = function() {
            context.drawImage( self.bgImage, 0, 0 );
        }
        self.bgImage.src = map.imageMask;
        self.maskContext = context;
        return self;
    };

    // Update game objects
    CanvasContext.prototype.update = function (modifier) {

    };

    // Draw everything
    CanvasContext.prototype.render = function () {
        var self = this;
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);        

        for (var shape of Api.data.shapes) {
            shape.draw();
        }

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
    var players = [
        new Player('Player 1', [new PlayerPosition(new MapPoint(180, 66), Api.settings.EnumShape.Waypoint)], 
            Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[0]),
        new Player('Player 2', [new PlayerPosition(new MapPoint(210, 66), Api.settings.EnumShape.Syncpoint)], 
            Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[1]),
        new Player('Player 3', [new PlayerPosition(new MapPoint(240, 66), Api.settings.EnumShape.Waitpoint)], 
            Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[2]),
        new Player('Player 4', [new PlayerPosition(new MapPoint(310, 66), Api.settings.EnumShape.Waypoint),
                                new PlayerPosition(new MapPoint(270, 66), Api.settings.EnumShape.Camppoint)], 
            Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[3]),
        new Player('Player 5', [new PlayerPosition(new MapPoint(310, 66), Api.settings.EnumShape.Syncpoint)], 
            Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[4])
    ];

    var map = window.Map = new Map(
        117,0,"de_dust2","images/de_dust2.mask.png","images/de_dust2.png",876,606,17985);

    new CanvasContext().create()
                       .setBackground()
                       .loadData(players)
                       .listen()
                       .animate(Date.now());

}(document, window, window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function(callback) {
                        window.setTimeout(callback, 1000 / 60);
                    }));