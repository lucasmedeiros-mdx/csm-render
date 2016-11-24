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