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
        var radius = CSMApi.Settings.PLAYER_RADIUS + 3;
        context.arc(p.x, p.y, radius, d, e, !1);
        context.closePath();
        context.stroke(); 
        context.fill();

        this.fillText()
    }

    isInBounds(point) {
        var p = this.position.point;
        return Math.sqrt((point.x-p.x)*(point.x-p.x) + (point.y-p.y)*(point.y-p.y)) <= CSMApi.Settings.PLAYER_RADIUS + 3
    }
}