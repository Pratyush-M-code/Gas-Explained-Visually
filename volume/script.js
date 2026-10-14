function solid(p) {
    let side, diameter, solid, selected;

    p.setup = function () {
        side = getCanvasSize(400, 'solid');
        p.createCanvas(side, side).parent('solid');
        diameter = 25;
        solid = balls_block(64, side, diameter);
        solid = balls_vrandom(solid, 100);
        selected = null
    }

    p.mousePressed = function () {
        for (let i of solid) {
            if (mouseInteract(i, p.mouseX, p.mouseY, diameter)) {
                selected = i
                break
            }
        }
    }

    p.mouseReleased = function () {
        if (selected) {
            selected = null
        }
    }

    p.draw = function () {
        p.background(p.color('#a7a7a7'));
        for (let i of solid) {
            i.oldVx = i.vx;
            i.oldVy = i.vy;
        }

        for (let i of solid) {
            updatesolid(i, solid, 0, 40, 1, 0.99, side, diameter)
        }
        for (let i of solid) {
            updateparticle(i, side, diameter)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.1, 2)
            p.stroke('black')
            p.line(selected.x, selected.y, p.mouseX, p.mouseY)
        }
    }
}

function sketch1(p) {
    let side, diameter, liquid;

    p.setup = function () {
        side = getCanvasSize(400, 'canvas1');
        p.createCanvas(side, side).parent('canvas1');
        diameter = 8;
        liquid = balls_init(400, side);
    }

    p.draw = function () {
        p.background(p.color('#a7a7a7'));
        checkcollision(liquid, diameter)

        for (let i of liquid) {
            repelMouse(i, p.mouseX, p.mouseY, 250, 50)
            updatefluid(i, liquid, 0.1, 0.1, 0.99)
            updateparticle(i, side, diameter)
            p.fill("black");
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
        p.background(p.color('#a7a7a7'));
        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatefluid(i, gas, 0, 0.01, 1)
            updateparticle(i, side, diameter)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

new p5(solid);
new p5(sketch1);
new p5(sketch2);