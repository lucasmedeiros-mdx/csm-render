class PlayerPosition {
    constructor(mapPoint, type, viewAngle) {
        this.point = mapPoint;
        this.viewAngle = viewAngle || 0;
        this.type = type;
    }

    updateAngle(position) {
        var deltaY = position.y - this.point.y;
        var deltaX = position.x - this.point.x;
        var theta = Math.atan2(-deltaY, deltaX)
        if (theta < 0) theta += 2 * Math.PI;
        var angle = theta * 180 / Math.PI;

        if (deltaX > 1 || deltaX < 0 || deltaY > 1 || deltaY < 0) {
            this.viewAngle = Math.abs(angle);            
        }
    }
}
