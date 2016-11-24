"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerPosition = function () {
    function PlayerPosition(mapPoint, type, viewAngle) {
        _classCallCheck(this, PlayerPosition);

        this.point = mapPoint;
        this.viewAngle = viewAngle || 0;
        this.type = type;
    }

    _createClass(PlayerPosition, [{
        key: "updateAngle",
        value: function updateAngle(position) {
            var deltaY = position.y - this.point.y;
            var deltaX = position.x - this.point.x;
            var theta = Math.atan2(-deltaY, deltaX);
            if (theta < 0) theta += 2 * Math.PI;
            var angle = theta * 180 / Math.PI;

            if (deltaX > 1 || deltaX < 0 || deltaY > 1 || deltaY < 0) {
                this.viewAngle = Math.abs(angle);
            }
        }
    }]);

    return PlayerPosition;
}();