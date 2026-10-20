function phase_transition_sim(p) {
    let side, diameter, matter, view, selected;
    const temp = document.getElementById('temp-phase-transition')
    const temp_readout = document.getElementById('temp-phase-transition-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'phase_transition_sim');
        p.createCanvas(side, side).parent('phase_transition_sim');
        diameter = 15;
        matter = balls_init(40, side, 'phase_transition_sim');
        matter = balls_vrandom(matter, 0);
        view = Visible('phase_transition_sim')
        selected = null

        //slider
        temp.min = 0
        temp.max = 100
        temp.value = 50
        temp_readout.textContent = temp.value + ' K'
        temp.addEventListener('input', () => {
            temp_readout.textContent = temp + ' K'
        })
    }

    p.mousePressed = function () {
        for (let i of matter) {
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
        for (let i of matter) {
            i.oldVx = i.vx;
            i.oldVy = i.vy;
        }

        let attraction = 10
        let KE = 1.5 * temp.value
        for (let i of matter) {
            updatematter(i, matter, 0, 1, 0.98, 0.999, 3, diameter)
        }
        for (let i of matter) {
            updateparticle(i, side, diameter, 0.8)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.01, 0.5)
            p.stroke('black')
            p.line(selected.x, selected.y, p.mouseX, p.mouseY)
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
new p5(temp_change_sim);