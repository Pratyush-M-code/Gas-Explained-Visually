function boyle_law_sim(p) {
    let side, diameter, matter, view, selected, target;
    const pressure_readout = document.getElementById('boyle-law-pressure-readout')
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


        //slider
        side_volume = side / 10
        volume.max = Math.round(side_volume) // not actually volume but side length
        volume.min = Math.round(side_volume / 5)
        volume.value = (volume.min + volume.max) / 2
        volume.textContent = (volume.value * volume.max) + ' unit^2' // actually volume
        volume.addEventListener('input', () => {
            target = volume.value * volume.max
            volume_readout.textContent = target + ' unit^2'
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
            updatematter(i, matter, 0, 0, 1, 1, 1, diameter)
            checkcollision(matter, diameter)
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

new p5(boyle_law_sim);