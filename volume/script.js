function sketch1(p) {
    p.setup = function () {
        let canvas1 = p.createCanvas(400, 400);
        canvas1.parent('canvas1');
    }

    const diameter = 8;
    let liquid = balls_init(400, 400)

    p.draw = function () {
        p.background("black");
        checkcollision(liquid, diameter)

        for (let i of liquid) {
            repelMouse(i, p.mouseX, p.mouseY, 250, 50)
            updatefluid(i, liquid, 0.1, 0.1, 0.99)
            updateparticle(i, 400, diameter)
            p.fill("white");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function sketch2(p) {
    p.setup = function () {
        let canvas2 = p.createCanvas(400, 400);
        canvas2.parent('canvas2');
    }

    const diameter = 5;
    let gas = balls_init(100, 400)
    gas = balls_vrandom(gas, 10)

    p.draw = function () {
        p.background("black");
        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatefluid(i, gas, 0.001, 0.01, 1)
            updateparticle(i, 400, diameter)
            p.fill("white");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

new p5(sketch1);
new p5(sketch2);
