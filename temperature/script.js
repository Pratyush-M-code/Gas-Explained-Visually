function phase_transition_sim(p) {
    let side, diameter, matter, view, selected;
    const temp = document.getElementById('temp-phase-transition')
    const temp_readout = document.getElementById('temp-phase-transition-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'phase_transition_sim');
        diameter = 15;
        selected = null

        p.createCanvas(side, side).parent('phase_transition_sim');
        matter = balls_init(60, side, 'phase_transition_sim', diameter, diameter / 2);
        matter = balls_vrandom(matter, 0);
        view = Visible('phase_transition_sim')

        //slider
        temp.min = 0
        temp.max = 200
        temp.value = 20
        temp_readout.textContent = temp.value + ' K'
        temp.addEventListener('input', () => {
            temp_readout.textContent = temp.value + ' K'
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

        const T = Math.max(3 * (temp.value / 100) ** 2, 0.01)
        thermostat(matter, T, 0.05, 1)

        for (let i of matter) {
            updatematter(i, matter, 0.05, 1, 1, 1, 2, diameter)
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
            drawVector(p, p.mouseX, p.mouseY, selected.x, selected.y)
        }
    }
}

function internal_energy_sim(p) {
    let side, diameter, matter, view, selected;
    const temp = document.getElementById('temp-internal-energy')
    const internal_energy_readout = document.getElementById('internal_energy_readout')
    const temp_readout = document.getElementById('temp_internal_energy_readout')

    p.setup = function () {
        side = getCanvasSize(400, 'internal_energy_sim');
        diameter = 5;
        selected = null

        p.createCanvas(side, side).parent('internal_energy_sim');
        matter = balls_init(100, side, 'internal_energy_sim');
        matter = balls_vrandom(matter, 200);
        view = Visible('internal_energy_sim')

        //slider
        temp.min = 0
        temp.max = 200
        temp.value = 20
        temp_readout.textContent = temp.value + ' K'
        temp.addEventListener('input', () => {
            temp_readout.textContent = temp.value + ' K'
        })

    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(matter, diameter)
        tempChange(matter, temp.value / 10, 0.3)

        let ie = 0
        for (const p of matter) {
            ie += (p.vx * p.vx + p.vy * p.vy) / 2
        }
        internal_energy_readout.textContent = ie

        for (let i of matter) {
            updatematter(i, matter, 0, 0, 1, 1, 1, diameter)
        }

        for (let i of matter) {
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function temp_change_sim(p) {
    let side, diameter, matter, view, current_temp = 0;
    const temp = document.getElementById('temp-change')
    let temp_readout = document.getElementById('temp-change-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'temp_change_sim');
        diameter = 5;
        view = Visible('temp_change_sim')

        temp.min = 0
        temp.max = 200
        temp.value = 20
        current_temp = Number(temp.value) / 40

        p.createCanvas(side, side).parent('temp_change_sim');
        matter = balls_init(100, side, 'temp_change_sim');
        matter = balls_vrandom(matter, matter.length * current_temp)   // start at the slider's T

        temp_readout.textContent = temp.value + ' K'
        temp.addEventListener('input', () => {
            temp_readout.textContent = temp.value + ' K'
        })
    }

    p.draw = function () {
        if (!view.visible) return

        checkcollision(matter, diameter)

        current_temp += (((Number(temp.value) / 40) - current_temp) / 5)
        tempChange(matter, current_temp, 0.3)          // once per frame, not per particle

        for (let i of matter) {
            updatematter(i, matter, 0, 0, 1, 1, 1, diameter)
        }
        p.background(...bgTempChange(matter, 5))       // after the update, before drawing

        for (let i of matter) {
            updateparticle(i, side, diameter, 1);
            p.fill("black");
            p.noStroke();
            p.circle(i.x, i.y, diameter - 0.1);
        }
    }
}

new p5(phase_transition_sim);
new p5(internal_energy_sim);
new p5(temp_change_sim);