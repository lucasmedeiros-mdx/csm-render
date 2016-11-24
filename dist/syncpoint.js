"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Syncpoint = function (_Shape) {
    _inherits(Syncpoint, _Shape);

    function Syncpoint(player, position, context, order) {
        _classCallCheck(this, Syncpoint);

        var _this = _possibleConstructorReturn(this, (Syncpoint.__proto__ || Object.getPrototypeOf(Syncpoint)).call(this, position, context, order));

        _this.player = player;
        return _this;
    }

    _createClass(Syncpoint, [{
        key: "draw",
        value: function draw() {
            var context = this.context,
                player = this.player,
                p = this.position.point,
                c = 1;

            this.drawFieldOfView();

            context.beginPath();
            context.fillStyle = "rgba(" + player.color + ", " + c + ")";
            context.strokeStyle = "black";
            context.lineWidth = 2;
            context.closePath();
            context.strokeRect(p.x - 8, p.y - 8, 16, 16);
            context.fillRect(p.x - 8, p.y - 8, 16, 16);

            this.fillText();
        }
    }, {
        key: "isInBounds",
        value: function isInBounds(point) {
            var p = this.position.point;
            return point.x >= p.x - 8 && point.x <= p.x + 8 && point.y >= p.y - 8 && point.y <= p.y + 8;
        }
    }]);

    return Syncpoint;
}(Shape);