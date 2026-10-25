function sim_404(p) {
    let side, diameter, solid, selected

    p.setup = function () {
        // Setting up intial values
        el = document.getElementById('404')
        side = getCanvasSize(el.clientWidth, '404')
        diameter = 25
        selected = null

        // Setting up Canvas and Balls
        p.createCanvas(side, side).parent('404')
        solid = balls_init(64, side, '404', undefined, diameter / 2)
        solid = balls_vrandom(solid, 1000)
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
        p.background(p.color('#fffffff0'));

        for (let i of solid) {
            updatematter(i, solid, 0, 3, 1, 1, Infinity, diameter)
        }
        checkcollision(solid, diameter)

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

new p5(sim_404);