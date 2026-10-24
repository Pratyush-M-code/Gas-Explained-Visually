function pressure_intro_sim(p) {
    let side, shape, view

    p.setup = async function () {
        //Setting up Initail values
        side = getCanvasSize(400, 'intro_sim')
        view = Visible('intro_sim')
        //3d shape logic
        shape = await p.loadModel('../shared/assets/3d-intro-sim.obj', true)

        p.createCanvas(side, side, p.WEBGL).parent('intro_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        if (!shape) return

        p.background(p.color('#a7a7a7'));
        p.orbitControl();

        p.scale(side / 400)
        p.ambientLight(110)
        p.directionalLight(255, 255, 255, 0.4, 0.6, -1);
        p.noStroke()
        p.fill("#B7410E")
        p.model(shape)
    }
}

function pressure_wall_sim(p) {
    let side, view, diameter, gas, force = 0, pressure = 0, impulse = 0, frameCount = 0;
    const frameCounter = 60
    const pressure_readout = document.getElementById('pressure_readout')
    const force_readout = document.getElementById('force_readout')
    const area_readout = document.getElementById('area_readout')

    //graph stuff
    let history = [], readings = 0, pressureSum = 0, avgPressure = 0;
    const history_len = 60 //max history readings on graph
    const graph = document.getElementById('pressure_graph')
    const graphContext = graph.getContext('2d')
    const avg_readout = document.getElementById('pressure_avg_readout');


    p.setup = function () {
        // Setting up Initial Conditions
        side = getCanvasSize(400, 'wall_sim');
        view = Visible('wall_sim')
        diameter = 10;

        p.createCanvas(side, side).parent('wall_sim');
        gas = balls_init(70, side, 'wall_sim');
        gas = balls_vrandom(gas, 200);
        area_readout.textContent = side + ' px'

        graph.width = side
        graph.height = 160 //change dis
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));

        checkcollision(gas, diameter)

        for (let i of gas) {
            attractMouse(i, p.mouseX, p.mouseY, 100, 50)
            updatematter(i, gas, 0, 0, 1, 1, 1, diameter)

            if (i.x + i.vx + diameter / 2 > side) {
                impulse += 2 * Math.abs(i.vx);
            }
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

        //pressure logic takes reading every 60 frams
        if (++frameCount >= frameCounter) {
            force = impulse / frameCount;
            pressure = force / side;
            force_readout.textContent = force.toFixed(2)
            pressure_readout.textContent = pressure.toFixed(4)

            history.push(pressure);                           // + graph data
            if (history.length > history_len) history.shift();
            readings++;
            pressureSum += pressure;
            avgPressure = pressureSum / readings;             // + running average
            avg_readout.textContent = avgPressure.toFixed(4);
            drawGraph();

            impulse = 0;
            frameCount = 0;
        }
    }

    function drawGraph() {
        const w = graph.width, h = graph.height, L = 52, B = 24, T = 8, R = 8;
        const top = Math.max(...history, avgPressure) * 1.2 || 1;
        const X = i => L + i * (w - L - R) / (history_len - 1);
        const Y = v => h - B - (v / top) * (h - B - T);

        graphContext.fillStyle = '#a7a7a7';
        graphContext.fillRect(0, 0, w, h);

        const g = graphContext;
        g.strokeStyle = g.fillStyle = 'black'; g.lineWidth = 1; g.font = '10px IBM Plex Mono';
        g.beginPath(); g.moveTo(L, T); g.lineTo(L, h - B); g.lineTo(w - R, h - B); g.stroke();
        g.textAlign = 'right';[0, top / 2, top].forEach(v => g.fillText(v.toFixed(3), L - 4, Y(v) + 3));  // y tick labels
        g.textAlign = 'center';[0, 30, 60].forEach(s => g.fillText(s, X(s * (history_len - 1) / 60), h - B + 12)); // x tick labels
        g.fillText('Time (s)', (L + w) / 2, h - 2);                                                 // x title
        g.save(); g.translate(8, h / 2); g.rotate(-Math.PI / 2); g.fillText('Pressure', 0, 0); g.restore();  // y title

        // pressure line (solid)
        graphContext.strokeStyle = '#B7410E';
        graphContext.lineWidth = 2;
        graphContext.setLineDash([]);
        graphContext.beginPath();
        history.forEach((v, i) => i ? graphContext.lineTo(X(i), Y(v)) : graphContext.moveTo(X(i), Y(v)));
        graphContext.stroke()

        // average pressure (dashed)
        graphContext.strokeStyle = '#9c2f00';
        graphContext.lineWidth = 1.5;
        graphContext.setLineDash([6, 4]);
        graphContext.beginPath();
        graphContext.moveTo(L, Y(avgPressure));
        graphContext.lineTo(w - R, Y(avgPressure));
        graphContext.stroke();
        graphContext.setLineDash([]);
    }
}

function pressure_total_sim(p) {
    let side, diameter, gas, view, force = 0, frames = 0, impulse = 0, pressure = 0, n, pressureSum, avgPressure;
    const frameCounter = 15;
    const total_pressure_readout = document.getElementById('total_pressure_readout')
    const avg_total_pressure_readout = document.getElementById('avg_total_pressure_readout')

    p.setup = function () {
        // Setting up Initial Values
        side = getCanvasSize(400, 'total_sim');
        view = Visible('total_sim')
        diameter = 8;
        n = 0
        pressureSum = 0

        p.createCanvas(side, side).parent('total_sim');
        gas = balls_init(100, side, 'total_sim');
        gas = balls_vrandom(gas, 200);
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(gas, diameter)

        for (let i of gas) {
            updatematter(i, gas, 0, 0, 1, 1, 1, diameter)

            impulse += (i.x + i.vx + diameter / 2 > side) ? (2 * Math.abs(i.vx)) : 0
            impulse += (i.x + i.vx + diameter / 2 < 0) ? (2 * Math.abs(i.vx)) : 0
            impulse += (i.y + i.vy + diameter / 2 > side) ? (2 * Math.abs(i.vy)) : 0
            impulse += (i.y + i.vy + diameter / 2 < 0) ? (2 * Math.abs(i.vy)) : 0
        }

        for (let i of gas) {
            updateparticle(i, side, diameter, 1)

            if (p.mouseIsPressed) {
                attractMouse(i, p.mouseX, p.mouseY, 100, 200, 25)
            }

            let colour_ball = " "

            if (Math.abs(i.vx) > Math.abs(i.vy) && i.vx < 0) {
                colour_ball = "red"
            }
            else if (Math.abs(i.vx) > Math.abs(i.vy) && i.vx > 0) {
                colour_ball = "blue"
            }
            else if (Math.abs(i.vy) > Math.abs(i.vx) && i.vy < 0) {
                colour_ball = "green"
            }
            else if (Math.abs(i.vy) > Math.abs(i.vx) && i.vy > 0) {
                colour_ball = "yellow"
            }
            else {
                colour_ball = "black"
            }

            p.fill(colour_ball)
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }

        p.strokeWeight(7)
        p.stroke("red");
        p.line(0, 0, 0, side)
        p.stroke("blue");
        p.line(side, 0, side, side)
        p.stroke("green");
        p.line(0, 0, side, 0)
        p.stroke("yellow");
        p.line(0, side, side, side)

        //output
        if (++frames >= frameCounter) {
            force = impulse / frames;
            pressure = force / (4 * side);
            total_pressure_readout.textContent = pressure.toFixed(4)

            impulse = 0; frames = 0; pressureSum += pressure; n++;
            avgPressure = pressureSum / n;
            avg_total_pressure_readout.textContent = avgPressure.toFixed(4);
        }
    }
}

new p5(pressure_intro_sim)
new p5(pressure_wall_sim)
new p5(pressure_total_sim)