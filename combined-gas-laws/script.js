function boyle_law_sim(p) {
    let side, diameter, matter, view, selected, target, border;

    let state_pressure = { impulse: 0, frames: 0, pressureSum: 0, n: 0, iteration_counter: 30 };
    const pressure_readout = document.getElementById('boyle-law-pressure-readout')

    let min_side, currentWallX = 0
    const volume = document.getElementById('boyle-law-volume')
    const volume_readout = document.getElementById('boyle-law-volume-readout')


    p.setup = function () {
        side = getCanvasSize(400, 'boyle_law_sim');
        diameter = 15;
        selected = null

        p.createCanvas(side, side).parent('boyle_law_sim');
        matter = balls_init(60, side, 'boyle_law_sim');
        matter = balls_vrandom(matter, 120);
        view = Visible('boyle_law_sim');
        border = [side, side, 0, 0]
        target = 0

        //slider
        min_side = side / 3
        volume.max = Math.round(side * side)
        volume.min = Math.round(side * min_side)
        volume.value = volume.max
        volume_readout.textContent = volume.value / 10000 + ' unit^2'
        volume.addEventListener('input', () => {
            target = side - (volume.value / side)
            volume_readout.textContent = Math.round(volume.value / 10000) + ' unit^2'
            border = [side, side, target, 0]
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
        readoutPressure(matter, pressure_readout, state_pressure, side, diameter);
        currentWallX += Math.max(-(diameter / 2), Math.min(diameter / 2, target - currentWallX))
        border = [side, side, currentWallX, 0]

        for (let i of matter) {
            updatematter(i, matter, 0, 0, 1, 1, 1, diameter)
            checkcollision(matter, diameter)
        }

        for (let i of matter) {
            updateparticle(i, side, diameter, 0.8, border)
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

new p5(boyle_law_sim);