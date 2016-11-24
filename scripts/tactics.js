(function(document, CSMApi, requestAnimationFrame) {

    CSMApi.EnumShape = {
        Waypoint: 1,
        Syncpoint: 2,
        Waitpoint: 3,
        Camppoint: 4
    };

    CSMApi.Settings = {
        ACTIVE_MENU: false,
        PLAYER_RADIUS: 5,
        FOV_RADIUS: 45,
        NO_TEAM: 0,
        TERRORIST: 1, 
        COUNTER_TERRORIST: 2, 
        FOV_COLOR_DARK: "140, 190, 140", 
        FOV_COLOR: "200, 250, 200", 
        TEAM_COLORS: ["69, 69, 69", "255, 63, 0", "75, 148, 221"],
        PLAYER_COLORS: ["138, 223, 125", "222, 79, 58", "238, 233, 32", "98, 177, 242", "242, 165, 60"]            
    };


    var Api = {
        data: {
            positions: [],
            shapes: [],
            map: new Map("de_dust2","images/de_dust2.mask.png","images/de_dust2.png",876,606)
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

    var DOMHelper = {
        appendCanvas: function(canvas) {
            document.body.appendChild(canvas);
        },
        appendChild: function(element) {
            document.querySelector('#container').appendChild(element);
        },
        destroyActiveMenus: function()  {
            var menus = document.querySelectorAll('.menu-context');
            for (var i = 0, element; element = menus[i]; i++) {
                if (element.offsetParent !== null) element.parentNode.removeChild(element);
            }
        },
        setContextMenu: function(menuContextOptions, position) {
            var menu = document.createElement('ul');
            menu.className = 'menu-context';

            for (var option of menuContextOptions) {
                var child = document.createElement('li');
                child.innerHTML = option.text;
                if (option.onclick) child.addEventListener('click', option.onclick, false);
                menu.appendChild(child)
            }

            menu.style.display = 'block';
            menu.style.left = position.x + 8 + 'px';
            menu.style.top = position.y - 2 + 'px';

            DOMHelper.appendChild(menu);
        },
        setBackground: function(canvas, image) {
            canvas.style.backgroundImage = 'url(' + Api.data.map.image + ')';
        },
        showFps: Api.throttle(function(fps) {
            fps = isFinite(fps) ? fps : 60;
            fps = Math.round(fps * 10) / 10;
            document.querySelector('#fps').innerHTML = fps + ' fps';            
        }, 250)
    };

    class CanvasContext {
        constructor() {
            this.canvas = null;
            this.context = null;
            this.maskContext = null;
            this.mousePosition = null;        
            this.bgImage = null;
            // Handle keyboard controls
            this.keysDown = {};
        }

        create() {
            var self = this;
            self.canvas = document.createElement("canvas");
            self.context = self.canvas.getContext("2d");
            self.canvas.width = Api.data.map.width;
            self.canvas.height = Api.data.map.height;
            self.canvas.setAttribute('tabindex', 1);
            DOMHelper.appendCanvas(self.canvas);
            return self;
        }

        getScenarioPointRGB(point) {
            var data = this.maskContext.getImageData(point.x,point.y,1,1).data;
            var rgb = ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
            return rgb;        
        }

        isValidPoint(point) {
            return this.getScenarioPointRGB(point) != '000000';        
        }

        loadData(players, positions, shapes) {

            if (positions == null) throw new Error("Positions not found");
            if (shapes == null) throw new Error("Shapes not found");

            for (var player of players) {
                var counter = 1;
                for (var position of player.positions) {
                    positions.push(position);
                    shapes.push(CSMApi.ShapeFactory.createShape({
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

        listen() {
            var self = this;
            var mouseAngleLocked = true;
            var dragged = false;
            var activeElement = null;
            var activeAngleElement = null;

            var setMousePosition = function(evt) {
                if (activeAngleElement && !dragged) {
                    activeAngleElement.position.updateAngle(getMousePosition(evt));
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
                var isInBounds = self.isValidPoint(pos);            

                if (isInBounds) {
                    shape.position.point = new MapPoint(pos.x, pos.y, shape.position.point.under);
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
                        activeElement = shape;                    
                        dragged = false;
                        mouseAngleLocked = true;                        
                        if (e.which !== 3) activeAngleElement = activeElement;
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
                Api.data.shapes.push(CSMApi.ShapeFactory.createShape({
                    context: self.context, 
                    player: player, 
                    position: playerPosition, 
                    shapeType: playerPosition.type,
                    text: player.positions.length
                }));

                DOMHelper.destroyActiveMenus();
            }

            self.canvas.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                var position = getMousePosition(e);

                var isInBounds = self.isValidPoint(position);
                if (!isInBounds) return;

                DOMHelper.destroyActiveMenus();

                var menuContextOptions = [{
                    text: 'Create Waypoint',
                    onclick: () => bindCreateShape(position, CSMApi.EnumShape.Waypoint)
                }, {
                    text: 'Create Syncpoint',
                    onclick: () => bindCreateShape(position, CSMApi.EnumShape.Syncpoint)
                }, {
                    text: 'Create Waitpoint',
                    onclick: () => bindCreateShape(position, CSMApi.EnumShape.Waitpoint)
                }, {
                    text: 'Create Camppoint',
                    onclick: () => bindCreateShape(position, CSMApi.EnumShape.Camppoint)
                }];

                DOMHelper.setContextMenu(menuContextOptions, position);

            }, false);

            self.canvas.addEventListener('click', DOMHelper.destroyActiveMenus, false);

            self.canvas.addEventListener('mousemove', function(evt) {
                if (activeElement) {
                    move(getMousePosition(evt));
                    dragged = true;
                    
                } else if (!mouseAngleLocked) {
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

        setBackground() {
            var self = this;
            DOMHelper.setBackground(self.canvas, Api.data.map.image);

            var canvas = document.createElement('canvas');
            canvas.width = Api.data.map.width;
            canvas.height = Api.data.map.height;
            var context = canvas.getContext('2d');

            self.bgImage = new Image();
            self.bgImage.onload = function() {
                context.drawImage(self.bgImage, 0, 0);
                Api.data.map.loaded = true;
            }
            self.bgImage.src = Api.data.map.imageMask;
            self.maskContext = context;
            return self;
        }

        // Update game objects
        update(modifier) {

        }

        // Draw everything
        render() {
            if (!Api.data.map.loaded) return;
            
            var self = this;
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);        

            for (var shape of Api.data.shapes) {
                shape.draw();
            }
        }

        // The main game loop
        animate(then) {
            var now = Date.now();
            var delta = now - then;
            var self = this;

            var modifier = delta / 1000;
            self.update(modifier);
            self.render();

            var fps = 1 / modifier;
            DOMHelper.showFps(fps);

            // Request to do this again ASAP
            requestAnimationFrame(self.animate.bind(self, now));
        }
    }

    // Game objects
    var players = [
        new Player('Player 1', [new PlayerPosition(new MapPoint(180, 66), CSMApi.EnumShape.Waypoint)], 
            CSMApi.Settings.COUNTER_TERRORIST, CSMApi.Settings.PLAYER_COLORS[0]),
        new Player('Player 2', [new PlayerPosition(new MapPoint(210, 66), CSMApi.EnumShape.Syncpoint)], 
            CSMApi.Settings.COUNTER_TERRORIST, CSMApi.Settings.PLAYER_COLORS[1]),
        new Player('Player 3', [new PlayerPosition(new MapPoint(240, 66), CSMApi.EnumShape.Waitpoint)], 
            CSMApi.Settings.COUNTER_TERRORIST, CSMApi.Settings.PLAYER_COLORS[2]),
        new Player('Player 4', [new PlayerPosition(new MapPoint(270, 96), CSMApi.EnumShape.Waypoint),
                                new PlayerPosition(new MapPoint(270, 66), CSMApi.EnumShape.Camppoint)], 
            CSMApi.Settings.COUNTER_TERRORIST, CSMApi.Settings.PLAYER_COLORS[3]),
        new Player('Player 5', [new PlayerPosition(new MapPoint(310, 66), CSMApi.EnumShape.Syncpoint)], 
            CSMApi.Settings.COUNTER_TERRORIST, CSMApi.Settings.PLAYER_COLORS[4])
    ];

    new CanvasContext().create()
                       .setBackground()
                       .loadData(players, Api.data.positions, Api.data.shapes)
                       .listen()
                       .animate(Date.now());

}(document, window.CSMApi || (window.CSMApi = {}), 
                    window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function(callback) {
                        window.setTimeout(callback, 1000 / 60);
                    }));