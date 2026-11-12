function template_sim(p) {
    let side, diameter, matter, view, selected;
    const temp = document.getElementById('template')
    const temp_readout = document.getElementById('template-readout')

    p.setup = function () {
        side = getCanvasSize(400, 'template_sim');
        diameter = 15;
        selected = null

        p.createCanvas(side, side).parent('template_sim');
        matter = balls_init(60, side, 'template_sim', diameter, diameter / 2);
        matter = balls_vrandom(matter, 0);
        view = Visible('template_sim')

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

new p5(template_sim);