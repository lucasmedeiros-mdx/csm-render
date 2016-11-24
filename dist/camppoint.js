"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camppoint = function (_Shape) {
    _inherits(Camppoint, _Shape);

    function Camppoint(player, position, context, order) {
        _classCallCheck(this, Camppoint);

        var _this = _possibleConstructorReturn(this, (Camppoint.__proto__ || Object.getPrototypeOf(Camppoint)).call(this, position, context, order));

        _this.player = player;
        return _this;
    }

    _createClass(Camppoint, [{
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
            context.lineTo(p.x, p.y - 12);
            context.lineTo(p.x + 12, p.y + 8);
            context.lineTo(p.x - 12, p.y + 8);
            context.closePath();
            context.stroke();
            context.fill();

            this.fillText();
        }
    }, {
        key: "isInBounds",
        value: function isInBounds(point) {
            var det = function det(p1, p2, p3) {
                return p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y);
            };

            var p = this.position.point,
                p1 = { x: p.x, y: p.y - 12 },
                p2 = { x: p.x + 12, y: p.y + 8 },
                p3 = { x: p.x - 12, y: p.y + 8 };

            return det(point, p1, p2) >= 0 && det(point, p2, p3) >= 0 && det(point, p3, p1) >= 0;
        }
    }]);

    return Camppoint;
}(Shape);