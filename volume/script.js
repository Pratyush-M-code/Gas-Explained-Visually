function vol_solid_sim(p) {

    let side, diameter, solid, selected, view

    p.setup = function () {
        // Setting up intial values
        side = getCanvasSize(400, 'solid_sim')
        diameter = 25
        selected = null

        // Setting up Canvas and Balls
        p.createCanvas(side, side).parent('solid_sim')
        solid = balls_init(64, side, 'solid_sim', undefined, diameter / 2)
        solid = balls_vrandom(solid, 100)
        view = Visible('solid_sim')
    }

    // For dragging
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
        if (!view.visible) return // Check for user view

        p.background(p.color('#a7a7a7'));

        for (let i of solid) {
            updatematter(i, solid, 0, 3, 0.9, 0.9, Infinity, diameter)
        }

        for (let i of solid) {
            updateparticle(i, side, diameter, 0.8)

            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

        // Drag Vector
        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.05, 1)
            p.stroke('black')
            drawVector(p, p.mouseX, p.mouseY, selected.x, selected.y)
        }
    }
}

function vol_liquid_sim(p) {

    let side, diameter, liquid, view, boxWidth, targetWidth;
    const slider = document.getElementById('liquid_width')
    const readout = document.getElementById('liquid_readout')

    p.setup = function () {
        //Setting Intial Values
        diameter = 8;
        view = Visible('liquid_sim')
        side = getCanvasSize(400, 'liquid_sim');

        p.createCanvas(side, side).parent('liquid_sim');
        liquid = balls_init(400, side, 'liquid_sim');

        //slider logic
        slider.min = Math.round(side * 0.4)
        slider.max = Math.round(side)
        slider.value = Math.round(side)
        readout.textContent = Math.round(side) + ' px'
        slider.addEventListener('input', () => {
            targetWidth = Number(slider.value)
            readout.textContent = targetWidth + ' px'
        })
        boxWidth = targetWidth = side
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        boxWidth = boxWidth + Math.max(-(diameter / 2), Math.min((diameter / 2), targetWidth - boxWidth))
        for (let check = 0; check < 2; check++) {
            checkcollision(liquid, diameter)
        }

        for (let i of liquid) {
            attractMouse(i, p.mouseX, p.mouseY, -250, -50)
            updatematter(i, liquid, 0.1, 0.05, 0.99, 0.9, 1, diameter)
        }

        for (let i of liquid) {
            updateparticle(i, side, diameter, 0.8, boxWidth)
            p.fill("black");
            p.noStroke();
            p.circle(i.x, i.y, diameter - 0.1)
        }

        p.stroke('#B7410E')
        p.strokeWeight(3)
        p.line(boxWidth, 0, boxWidth, side)
    }
}

function vol_gas_sim(p) {

    let side, diameter, gas, view, boxSize, targetSize;
    const slider = document.getElementById('gas_size')
    const readout = document.getElementById('gas_readout')

    p.setup = function () {
        //Setting Initial Vauls
        side = getCanvasSize(400, 'gas_sim');
        diameter = 5;
        view = Visible('gas_sim')

        p.createCanvas(side, side).parent('gas_sim');
        gas = balls_init(100, side, 'gas_sim');
        gas = balls_vrandom(gas, 200);

        //slider logic
        slider.min = Math.round(side * 0.4)
        slider.max = Math.round(side)
        slider.value = Math.round(side)
        readout.textContent = Math.round(side) + ' px'
        slider.addEventListener('input', () => {
            targetSize = Number(slider.value)
            readout.textContent = targetSize + ' px'
        })
        boxSize = targetSize = side
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        boxSize = boxSize + Math.max(-(diameter / 2), Math.min((diameter / 2), targetSize - boxSize))
        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatematter(i, gas, 0, 0, 1, 1, 1, diameter)
        }

        for (let i of gas) {
            updateparticle(i, boxSize, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

        p.stroke('#B7410E')
        p.strokeWeight(3)
        p.line(boxSize, 0, boxSize, boxSize)
        p.line(0, boxSize, boxSize, boxSize)
    }
}

new p5(vol_solid_sim);
new p5(vol_liquid_sim);
new p5(vol_gas_sim);