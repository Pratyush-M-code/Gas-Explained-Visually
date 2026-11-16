function boyle_law_sim(p) {
    let side, diameter, matter, view, selected, target, border, plunger;

    let state_pressure = { impulse: 0, frames: 0, pressureSum: 0, n: 0, iteration_counter: 60, curveDrawn: false, minVolumeFrames: 0 };
    const pressure_readout = document.getElementById('boyle-law-pressure-readout')

    let min_side, currentWall = 0
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
            target = side - (volume.value / side);
        })

        //plunger
        plunger = initPlunger(side, 0, 0.001, 0, 0.9, false);

        //chart
        Plotly.newPlot('boyle_law_graph', [{
            x: [], y: [],
            type: 'scatter',
            mode: 'markers',
            marker: { color: '#B7410E' }
        }], {
            title: 'Pressure Vs Volume',
            xaxis: { title: 'Volume (unit²)' },
            yaxis: { title: 'Pressure (Pa)' }
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
        drawPlunger(p, side, plunger);

        border = updatePlunger(plunger, matter, side, diameter, 0.1, target);
        readoutPressure(matter, pressure_readout, state_pressure, side, diameter, border);

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

        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.01, 0.5)
            p.stroke('black')
            drawVector(p, p.mouseX, p.mouseY, selected.x, selected.y)
        }

        if (state_pressure.fresh) {
            state_pressure.fresh = false
            const vol_now = (side - plunger.position) * side / 10000
            Plotly.extendTraces('boyle_law_graph', { x: [[vol_now]], y: [[state_pressure.latest]] }, [0], 200)
        }

        if (volume.value == volume.min) {
            state_pressure.minVolumeFrames++
        } else {
            state_pressure.minVolumeFrames = 0
            state_pressure.curveDrawn = false
        }

        if (state_pressure.minVolumeFrames > 100 && !state_pressure.curveDrawn) {
            const graphDiv = document.getElementById('boyle_law_graph')
            if (graphDiv.data.length > 1) {
                Plotly.deleteTraces('boyle_law_graph', [1])
            }
            state_pressure.curveDrawn = true

            let v_arr = graphDiv.data[0].x
            let p_arr = graphDiv.data[0].y

            let kSum = 0
            for (let i = 0; i < v_arr.length; i++) {
                kSum += v_arr[i] * p_arr[i]
            }
            const k = kSum / v_arr.length

            v_arr = [], p_arr = []
            let stepper = 50
            for (let i = 0; i <= stepper; i++) {
                const v_imp = min_side * side / 10000 + (i / stepper) * ((side * side / 10000) - (min_side * side / 10000))
                v_arr.push(v_imp)
                p_arr.push(k / v_imp)
            }

            Plotly.addTraces('boyle_law_graph', {
                x: v_arr,
                y: p_arr,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#9c2f00', dash: 'dash' },
                name: 'Theoretical P·V = k'
            })
        }
    }
}

function charles_law_sim(p) {
    let side, diameter, matter, view, selected, target_temperature, current_temperature, border, plunger;

    const volume_readout = document.getElementById('charles-law-volume-readout')

    let T0, forceExt, startPos, state_temperature = { iteration: 0, iteration_counter: 60, minVolumeFrames: 0, curveDrawn: false }
    const temperature = document.getElementById('charles-law-temperature')
    const temperature_readout = document.getElementById('charles-law-temperature-readout')


    p.setup = function () {
        side = getCanvasSize(400, 'charles_law_sim');
        diameter = 5;
        selected = null

        p.createCanvas(side, side).parent('charles_law_sim');
        matter = balls_init(200, side, 'charles_law_sim')
        view = Visible('charles_law_sim');
        border = [side, side, 0, 0]

        //slider
        temperature.max = 15
        temperature.min = 2
        temperature.value = 5
        temperature.step = 0.05
        T0 = temperature.value * 20
        temperature_readout.textContent = T0 + ' K'
        target_temperature = parseFloat(temperature.value)
        current_temperature = target_temperature
        temperature.addEventListener('input', () => {
            target_temperature = temperature.value
            temperature_readout.textContent = target_temperature * 20 + ' K'
        })

        matter = balls_vrandom(matter, matter.length * T0)

        //plunger
        forceExt = 10
        startPos = 0.5
        plunger = initPlunger(side, startPos, 1, forceExt, 0.9, true)
        plunger.avgImpulse = forceExt

        //chart
        Plotly.newPlot('charles_law_graph', [{
            x: [], y: [],
            type: 'scatter',
            mode: 'markers',
            marker: { color: '#B7410E' }
        }], {
            title: 'Temperature Vs Volume',
            xaxis: { title: 'Volume (unit²)' },
            yaxis: { title: 'Temperature (K)' }
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

        current_temperature += (parseFloat(temperature.value) - current_temperature) * 0.02
        tempChange(matter, current_temperature * 20, 0.05);
        p.background(...bgTempChange(matter, 50));

        border = updatePlunger(plunger, matter, side, diameter, 0.05);
        drawPlunger(p, side, plunger);

        volume_readout.textContent = ((side - plunger.position) * side / 10000).toFixed(1) + ' unit^2'

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

        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.01, 0.5)
            p.stroke('black')
            drawVector(p, p.mouseX, p.mouseY, selected.x, selected.y)
        }

        if (state_temperature.fresh) {
            state_temperature.fresh = false
            const vol_now = (side - plunger.position) * side / 10000
            Plotly.extendTraces('charles_law_graph', { x: [[vol_now]], y: [[current_temperature * 20]] }, [0], 200)
        } else {
            state_temperature.iteration += 1
            if (state_temperature.iteration >= state_temperature.iteration_counter) {
                state_temperature.fresh = true
                state_temperature.iteration = 0
            }
        }

        if (temperature.value == temperature.min) {
            state_temperature.minVolumeFrames++
        } else {
            state_temperature.minVolumeFrames = 0
            state_temperature.curveDrawn = false
        }

        if (state_temperature.minVolumeFrames > 200 && !state_temperature.curveDrawn) {
            const graphDiv = document.getElementById('charles_law_graph')
            if (graphDiv.data.length > 1) {
                Plotly.deleteTraces('charles_law_graph', [1])
            }
            state_temperature.curveDrawn = true

            let v_arr = graphDiv.data[0].x
            let t_arr = graphDiv.data[0].y

            let kSum = 0
            for (let i = 0; i < v_arr.length; i++) {
                kSum += v_arr[i] / t_arr[i]
            }
            const k = kSum / v_arr.length

            const t_min = temperature.min * 20
            const t_max = temperature.max * 20

            v_arr = [], t_arr = []
            let stepper = 50
            for (let i = 0; i <= stepper; i++) {
                const t_imp = t_min + (i / stepper) * (t_max - t_min)
                t_arr.push(t_imp)
                v_arr.push(k * t_imp)
            }

            Plotly.addTraces('charles_law_graph', {
                x: v_arr,
                y: t_arr,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#9c2f00', dash: 'dash' },
                name: 'Theoretical V/T = k'
            })
        }

    }
}

function gay_lussac_law_sim(p) {
    let side, diameter, matter, view, selected, target, border;

    let state_pressure = { impulse: 0, frames: 0, pressureSum: 0, n: 0, iteration_counter: 30 };
    const pressure_readout = document.getElementById('gay-lussac-law-pressure-readout')

    let T0, state_temperature = { iteration: 0, iteration_counter: 60, minVolumeFrames: 0, curveDrawn: false }
    const temperature = document.getElementById('gay-lussac-law-temperature')
    const temperature_readout = document.getElementById('gay-lussac-law-temperature-readout')


    p.setup = function () {
        side = getCanvasSize(400, 'gay_lussac_law_sim');
        diameter = 5;
        selected = null

        p.createCanvas(side, side).parent('gay_lussac_law_sim');
        matter = balls_init(200, side, 'gay_lussac_law_sim')
        view = Visible('gay_lussac_law_sim');
        border = [side, side, 0, 0]
        target = 0

        //slider
        temperature.max = 15
        temperature.min = 2
        temperature.value = 5
        temperature.step = 0.05
        T0 = temperature.value * 20
        temperature_readout.textContent = T0 + ' K'
        target_temperature = parseFloat(temperature.value)
        current_temperature = target_temperature
        temperature.addEventListener('input', () => {
            target_temperature = temperature.value
            temperature_readout.textContent = target_temperature * 20 + ' K'
        })

        matter = balls_vrandom(matter, matter.length * T0)

        //chart
        Plotly.newPlot('gay_lussac_law_graph', [{
            x: [], y: [],
            type: 'scatter',
            mode: 'markers',
            marker: { color: '#B7410E' }
        }], {
            title: 'Temperature Vs Pressure',
            xaxis: { title: 'Pressure (Pa)' },
            yaxis: { title: 'Temperature (K)' }
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

        current_temperature += (parseFloat(temperature.value) - current_temperature) * 0.02
        tempChange(matter, current_temperature * 20, 0.05);
        p.background(...bgTempChange(matter, 50));

        readoutPressure(matter, pressure_readout, state_pressure, side, diameter, border);

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

        if (selected) {
            applyForce(selected, p.mouseX, p.mouseY, diameter, 0.01, 0.5)
            p.stroke('black')
            drawVector(p, p.mouseX, p.mouseY, selected.x, selected.y)
        }

        if (state_temperature.fresh) {
            state_temperature.fresh = false
            Plotly.extendTraces('gay_lussac_law_graph', { x: [[state_pressure.latest]], y: [[current_temperature * 20]] }, [0], 200)
        } else {
            state_temperature.iteration += 1
            if (state_temperature.iteration >= state_temperature.iteration_counter) {
                state_temperature.fresh = true
                state_temperature.iteration = 0
            }
        }

        if (temperature.value == temperature.min) {
            state_temperature.minVolumeFrames++
        } else {
            state_temperature.minVolumeFrames = 0
            state_temperature.curveDrawn = false
        }

        if (state_temperature.minVolumeFrames > 200 && !state_temperature.curveDrawn) {
            const graphDiv = document.getElementById('gay_lussac_law_graph')
            if (graphDiv.data.length > 1) {
                Plotly.deleteTraces('gay_lussac_law_graph', [1])
            }
            state_temperature.curveDrawn = true

            let p_arr = graphDiv.data[0].x
            let t_arr = graphDiv.data[0].y

            let kSum = 0
            for (let i = 0; i < p_arr.length; i++) {
                kSum += p_arr[i] / t_arr[i]
            }
            const k = kSum / p_arr.length

            const t_min = temperature.min * 20
            const t_max = temperature.max * 20

            p_arr = [], t_arr = []
            let stepper = 50
            for (let i = 0; i <= stepper; i++) {
                const t_imp = t_min + (i / stepper) * (t_max - t_min)
                t_arr.push(t_imp)
                p_arr.push(k * t_imp)
            }

            Plotly.addTraces('gay_lussac_law_graph', {
                x: p_arr,
                y: t_arr,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#9c2f00', dash: 'dash' },
                name: 'Theoretical P/T = k'
            })
        }

    }
}

new p5(gay_lussac_law_sim);
new p5(charles_law_sim);
new p5(boyle_law_sim);