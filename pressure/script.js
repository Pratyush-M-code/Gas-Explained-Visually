function pressure_intro_sim(p) {
    let side, shape, view;

    p.setup = async function () {
        side = getCanvasSize(400, 'intro_sim');
        p.createCanvas(side, side, p.WEBGL).parent('intro_sim');
        view = Visible('intro_sim')

        //3d shape logic
        shape = await p.loadModel('../shared/assets/3d-intro-sim.obj', true)
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));
        p.orbitControl();

        p.scale(side / 400)
        p.ambientLight(110)
        p.directionalLight(255, 255, 255, 0.4, 0.6, -1);
        p.noStroke()
        p.fill("#B7410E")
        p.model(shape)
    }
}

function pressure_wall_sim(p) {
    let side, view, diameter, gas;

    p.setup = function () {
        side = getCanvasSize(400, 'wall_sim');
        p.createCanvas(side, side).parent('wall_sim');
        view = Visible('wall_sim')

        diameter = 10;
        gas = balls_init(70, side, 'wall_sim');
        gas = balls_vrandom(gas, 200);
        view = Visible('wall_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));

        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatefluid(i, gas, diameter, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            if (Math.abs(i.vy) < Math.abs(i.vx) && i.vx > 0) {
                p.fill("black");
                p.noStroke()
            }
            else {
                p.fill("#7b7b7b");
                p.noStroke()
            }

            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function pressure_total_sim(p) {
    let side, view;

    p.setup = function () {
        side = getCanvasSize(400, 'total_sim');
        p.createCanvas(side, side).parent('total_sim');
        view = Visible('total_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));
    }
}

new p5(pressure_intro_sim)
new p5(pressure_wall_sim)
new p5(pressure_total_sim)