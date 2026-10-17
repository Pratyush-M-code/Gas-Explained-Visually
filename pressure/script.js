function pressure_intro_sim(p) {
    let side

    p.setup = function () {
        side = getCanvasSize(400, 'intro_sim');
        p.createCanvas(side, side).parent('intro_sim');
        view = Visible('intro_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));
    }
}

function pressure_wall_sim(p) {
    let side

    p.setup = function () {
        side = getCanvasSize(400, 'wall_sim');
        p.createCanvas(side, side).parent('wall_sim');
        view = Visible('wall_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));
    }
}

function pressure_total_sim(p) {
    let side

    p.setup = function () {
        side = getCanvasSize(400, 'total_sim');
        p.createCanvas(side, side).parent('total_sim');
        view = Visible('total_sim')
    }

    p.draw = function () {
        if (!view.visible) return
        p.background(p.color('#a7a7a7'));
    }
}

new p5(pressure_intro_sim)
new p5(pressure_wall_sim)
new p5(pressure_total_sim)