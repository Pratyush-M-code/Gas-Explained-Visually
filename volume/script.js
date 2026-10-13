function sketch1(p) {
    let side, diameter, liquid;

    p.setup = function () {
        side = getCanvasSize(400, 'canvas1');
        p.createCanvas(side, side).parent('canvas1');
        diameter = 8;
        liquid = balls_init(400, side);
    }

    p.draw = function () {
        p.background("black");
        checkcollision(liquid, diameter)

        for (let i of liquid) {
            repelMouse(i, p.mouseX, p.mouseY, 250, 50)
            updatefluid(i, liquid, 0.1, 0.1, 0.99)
            updateparticle(i, side, diameter)
            p.fill("white");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function sketch2(p) {
    let side, diameter, gas;

    p.setup = function () {
        side = getCanvasSize(400, 'canvas2');
        p.createCanvas(side, side).parent('canvas2');
        diameter = 5;
        gas = balls_init(100, side);
        gas = balls_vrandom(gas, 10);
    }

    p.draw = function () {
        p.background("black");
        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatefluid(i, gas, 0.001, 0.01, 1)
            updateparticle(i, side, diameter)
            p.fill("white");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

new p5(sketch1);
new p5(sketch2);