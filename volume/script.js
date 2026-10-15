function vol_solid_sim(p) {
    let side, diameter, solid, selected, view;

    p.setup = function () {
        side = getCanvasSize(400, 'solid_sim');
        p.createCanvas(side, side).parent('solid_sim');
        diameter = 25;
        solid = balls_block(64, side, 'solid_sim', diameter);
        solid = balls_vrandom(solid, 100);
        selected = null
        view = Visible('solid_sim')
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
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));
        for (let i of solid) {
            i.oldVx = i.vx;
            i.oldVy = i.vy;
        }

        for (let i of solid) {
            updatesolid(i, solid, 0, 60, 1, 0.95, side, diameter)
        }
        for (let i of solid) {
            updateparticle(i, side, diameter, 0.8)
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

function vol_liquid_sim(p) {
    let side, diameter, liquid, view;

    p.setup = function () {
        side = getCanvasSize(400, 'liquid_sim');
        p.createCanvas(side, side).parent('liquid_sim');
        diameter = 8;
        liquid = balls_init(400, side, 'liquid_sim');
        view = Visible('liquid_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));
        checkcollision(liquid, diameter)

        for (let i of liquid) {
            repelMouse(i, p.mouseX, p.mouseY, 250, 50)
            updatefluid(i, liquid, 0.1, 0.1, 0.99)
            updateparticle(i, side, diameter, 0.8)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function vol_gas_sim(p) {
    let side, diameter, gas, view;

    p.setup = function () {
        side = getCanvasSize(400, 'gas_sim');
        p.createCanvas(side, side).parent('gas_sim');
        diameter = 5;
        gas = balls_init(100, side, 'gas_sim');
        gas = balls_vrandom(gas, 10);
        view = Visible('gas_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));
        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatefluid(i, gas, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

new p5(vol_solid_sim);
new p5(vol_liquid_sim);
new p5(vol_gas_sim);