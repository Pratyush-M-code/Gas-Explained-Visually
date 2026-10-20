function phase_transition_sim(p) {
    let side, diameter, matter, view;
    const temp = document.getElementById('temp-phase-transition')
    const temp_readout = document.getElementById('temp-phase-transition-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'phase_transition_sim');
        p.createCanvas(side, side).parent('phase_transition_sim');
        diameter = 5;
        matter = balls_init(100, side, 'phase_transition_sim');
        matter = balls_vrandom(matter, 200);
        view = Visible('phase_transition_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(matter, diameter)

        for (let i of matter) {
            updatefluid(i, matter, diameter, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function internal_energy_sim(p) {
    let side, diameter, matter, view;
    const temp = document.getElementById('temp-internal-energy')
    const internal_energy_readout = document.getElementById('internal_energy_readout')
    const temp_readout = document.getElementById('temp_internal_energy_readout')

    p.setup = function () {
        side = getCanvasSize(400, 'internal_energy_sim');
        p.createCanvas(side, side).parent('internal_energy_sim');
        diameter = 5;
        matter = balls_init(100, side, 'internal_energy_sim');
        matter = balls_vrandom(matter, 200);
        view = Visible('internal_energy_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(matter, diameter)

        for (let i of matter) {
            updatefluid(i, matter, diameter, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function temp_change_sim(p) {
    let side, diameter, matter, view;
    const temp = document.getElementById('temp-change')
    let temp_readout = document.getElementById('temp-change-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'temp_change_sim');
        p.createCanvas(side, side).parent('temp_change_sim');
        diameter = 5;
        matter = balls_init(100, side, 'temp_change_sim');
        matter = balls_vrandom(matter, 200);
        view = Visible('temp_change_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(matter, diameter)

        for (let i of matter) {
            updatefluid(i, matter, diameter, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}


new p5(phase_transition_sim);
new p5(internal_energy_sim);
new p5(phase_transition_sim);