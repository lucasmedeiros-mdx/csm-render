"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Waypoint = function (_Shape) {
    _inherits(Waypoint, _Shape);

    function Waypoint(player, position, context, order) {
        _classCallCheck(this, Waypoint);

        var _this = _possibleConstructorReturn(this, (Waypoint.__proto__ || Object.getPrototypeOf(Waypoint)).call(this, position, context, order));

        _this.player = player;
        return _this;
    }

    _createClass(Waypoint, [{
        key: "draw",
        value: function draw() {
            var player = this.player,
                p = this.position.point,
                context = this.context,
                c = 1,
                d = 2 * Math.PI,
                e = 2 * d;

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")";
            context.strokeStyle = "black";
            context.lineWidth = 2;
            var radius = Api.settings.PLAYER_RADIUS + 3;
            context.arc(p.x, p.y, radius, d, e, !1);
            context.closePath();
            context.stroke();
            context.fill();

            this.fillText();
        }
    }, {
        key: "isInBounds",
        value: function isInBounds(point) {
            var p = this.position.point;
            return Math.sqrt((point.x - p.x) * (point.x - p.x) + (point.y - p.y) * (point.y - p.y)) <= Api.settings.PLAYER_RADIUS + 3;
        }
    }]);

    return Waypoint;
}(Shape);