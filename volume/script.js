function sketch1(p) {
    p.setup = function () {
        let canvas1 = p.createCanvas(400, 400);
        canvas1.parent('canvas1');
    }

    const diameter = 20;
    let gas = balls_init(150, 400)

    p.draw = function () {
        p.background("black");

        for (let i of gas) {
            checkcollision(gas, diameter)
            updateliquid(i, gas, 0.1, 0.001, diameter)
            updateparticle(i, 400, diameter)
            p.fill("white");
            p.circle(i.x, i.y, diameter)
        }
    }
}

new p5(sketch1);

