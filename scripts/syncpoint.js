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