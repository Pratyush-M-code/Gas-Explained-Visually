function sketch1(p) {
    p.setup = function () {
        let canvas1 = p.createCanvas(400, 400);
        canvas1.parent('canvas1');
    }
    p.draw = function () {
        p.background("black");
        function followMouse() {
            let x = p.mouseX;
            let y = p.mouseY;
            p.circle(x, y, 10);
        }
        followMouse();
        p.circle(200, 200, 10)
    }
}

new p5(sketch1);