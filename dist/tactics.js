"use strict";

(function (document, w, requestAnimationFrame) {

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
        get: function get(url, success) {

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = function () {
                if (this.status >= 200) {
                    success(this.response);
                }
            };

            request.send();
        },
        throttle: function throttle(func, interval) {
            var lastCall = 0;
            return function () {
                var now = Date.now();
                if (lastCall + interval < now) {
                    lastCall = now;
                    return func.apply(this, arguments);
                }
            };
        }
    };

    var DOMHelper = {
        appendCanvas: function appendCanvas(canvas) {
            document.body.appendChild(canvas);
        },
        setBackground: function setBackground(canvas, image) {
            canvas.style.backgroundImage = 'url(' + map.image + ')';
        },
        showFps: Api.throttle(function (fps) {
            fps = isFinite(fps) ? fps : 60;
            fps = Math.round(fps * 10) / 10;
            document.querySelector('#fps').innerHTML = fps + ' fps';
        }, 250)
    };

    // Game objects
    var players = [new Player('Player 1', [new PlayerPosition(new MapPoint(180, 66), Api.settings.EnumShape.Waypoint)], Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[0]), new Player('Player 2', [new PlayerPosition(new MapPoint(210, 66), Api.settings.EnumShape.Syncpoint)], Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[1]), new Player('Player 3', [new PlayerPosition(new MapPoint(240, 66), Api.settings.EnumShape.Waitpoint)], Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[2]), new Player('Player 4', [new PlayerPosition(new MapPoint(310, 66), Api.settings.EnumShape.Waypoint), new PlayerPosition(new MapPoint(270, 66), Api.settings.EnumShape.Camppoint)], Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[3]), new Player('Player 5', [new PlayerPosition(new MapPoint(310, 66), Api.settings.EnumShape.Syncpoint)], Api.settings.COUNTER_TERRORIST, Api.settings.PLAYER_COLORS[4])];

    var map = window.Map = new Map("de_dust2", "images/de_dust2.mask.png", "images/de_dust2.png", 876, 606);

    new CanvasContext().create().setBackground().loadData(players).listen().animate(Date.now());
})(document, window, window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
});