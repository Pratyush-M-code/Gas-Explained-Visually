function sketch1(p) {
    p.setup = function () {
        let canvas1 = p.createCanvas(400, 400);
        canvas1.parent('canvas1');
    }

    let gas = balls_init(100, 400)

    p.draw = function () {
        p.background("black");

        for (let i of gas) {
            p.circle(i.x, i.y, 10)
        }
        p.circle(200, 200, 10)
    }
}

new p5(sketch1);

