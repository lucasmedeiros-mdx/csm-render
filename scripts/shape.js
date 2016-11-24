class Shape {
    constructor(position, context, text) {            
        this.context = context;
        this.text = text;
        this.position = position;
    }

    fillText() {
        var context = this.context,
            p = this.position.point;

        context.fillStyle = "black";
        context.font = '12px Arial';
        context.fillText(this.text, p.x - 4, p.y + 4);
    }

    drawFieldOfView() {
        var a = this.context,
            b = CSMApi.Settings,
            pos = this.position,
            p = this.position.point;

        a.beginPath()
        a.moveTo(p.x, p.y)
        a.arc(p.x, 
              p.y, 
              b.FOV_RADIUS, 
              -(pos.viewAngle * Math.PI / 180) - .25 * Math.PI, 
              -(pos.viewAngle * Math.PI / 180) + .25 * Math.PI, 
              !1)            

        var g = a.createRadialGradient(p.x, p.y, 1, p.x, p.y, b.FOV_RADIUS);
        g.addColorStop(0, "rgba(" + b.FOV_COLOR_DARK + ", 0.33)")
        g.addColorStop(2 / 3, "rgba(" + b.FOV_COLOR + ", 0.33)")
        g.addColorStop(1, "rgba(" + b.FOV_COLOR + ", 0)")
        a.closePath()
        a.fillStyle = "rgba(239, 242, 248, 0.2)"
        a.fill()
    }
}