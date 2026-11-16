function vol_sim(p) {

    let side, diameter, solid, view

    p.setup = function () {
        // Setting up intial values
        el = document.getElementById('volume_sim')
        side = getCanvasSize(el.clientWidth, 'volume_sim')
        diameter = 25

        // Setting up Canvas and Balls
        p.createCanvas(side, side).parent('volume_sim')
        solid = balls_init(64, side, 'volume_sim', undefined, diameter / 2)
        solid = balls_vrandom(solid, 100)
        view = Visible('volume_sim')
    }

    p.draw = function () {
        if (!view.visible) return // Check for user view

        p.background(p.color('#a7a7a7'));

        for (let i of solid) {
            updatematter(i, solid, 0, 3, 0.9, 0.9, Infinity, diameter)
        }
        checkcollision(solid, diameter)

        for (let i of solid) {
            updateparticle(i, side, diameter, 0.8)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

    }
}

function pressure_sim(p) {
    let side, view, diameter, gas

    p.setup = function () {
        // Setting up Initial Conditions
        el = document.getElementById('pressure_sim')
        side = getCanvasSize(el.clientWidth, 'pressure_sim')
        view = Visible('pressure_sim')
        diameter = 10;

        p.createCanvas(side, side).parent('pressure_sim');
        gas = balls_init(70, side, 'pressure_sim');
        gas = balls_vrandom(gas, 200);
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));

        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatematter(i, gas, 0, 0, 1, 1, 1, diameter)
        }

        for (let i of gas) {
            updateparticle(i, side, diameter, 1)

            if (Math.abs(i.vy) < Math.abs(i.vx) && i.vx > 0) {
                p.fill("#000000");
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

function temperature_sim(p) {
    let side, diameter, matter, view, tempvalue = 0;

    p.setup = function () {
        el = document.getElementById('temperature_sim')
        side = getCanvasSize(el.clientWidth, 'temperature_sim')
        diameter = 15;
        selected = null

        p.createCanvas(side, side).parent('temperature_sim');
        matter = balls_init(60, side, 'temperature_sim', diameter, diameter / 2);
        matter = balls_vrandom(matter, 0);
        view = Visible('temperature_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        const T = Math.max(3 * (tempvalue / 100) ** 2, 0.01)
        thermostat(matter, T, 0.05, 1)
        tempvalue = (tempvalue > 200) ? (0) : (tempvalue + 0.25)

        for (let i of matter) {
            updatematter(i, matter, 0.05, 1, 1, 1, 2, diameter)
        }

        for (let i of matter) {
            updateparticle(i, side, diameter, 0.8)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

function combined_gas_sim(p) {
    let side, diameter, matter, view, selected, current_temperature, border, plunger;

    let T0, forceExt, startPos, state_temperature = { iteration: 0, iteration_counter: 60, minVolumeFrames: 0, curveDrawn: false }
    const temperature = {}

    p.setup = function () {
        el = document.getElementById('combined_gas_sim')
        side = getCanvasSize(el.clientWidth, 'combined_gas_sim');
        diameter = 5;
        selected = null

        p.createCanvas(side, side).parent('combined_gas_sim');
        matter = balls_init(200, side, 'combined_gas_sim')
        view = Visible('combined_gas_sim');
        border = [side, side, 0, 0]

        //slider
        temperature.max = 15
        temperature.min = 5
        temperature.value = 10
        temperature.step = 0.05
        T0 = temperature.value * 20
        current_temperature = temperature.value

        matter = balls_vrandom(matter, matter.length * T0)

        //plunger
        plunger = initPlunger(side, 0.45, 1, 13, 0.9, true)
        plunger.avgImpulse = 183
    }

    p.draw = function () {
        if (!view.visible) return

        temperature.value = 10 + 5 * Math.sin(p.frameCount * 0.0075)
        current_temperature += (parseFloat(temperature.value) - current_temperature) * 0.02
        tempChange(matter, current_temperature * 20, 0.05);
        p.background(p.color('#a7a7a7'));

        border = updatePlunger(plunger, matter, side, diameter, 0.1);
        drawPlunger(p, side, plunger);


        for (let i of matter) {
            updatematter(i, matter, 0, 0, 1, 1, 1, diameter)
        }
        checkcollision(matter, diameter)

        for (let i of matter) {
            updateparticle(i, side, diameter, 1, border)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

    }
}

new p5(vol_sim)
new p5(pressure_sim)
new p5(temperature_sim)
new p5(combined_gas_sim)