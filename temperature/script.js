function phase_transition_sim(p) {
    let side, diameter, matter, view;
    const temp = document.getElementById('temp-phase-transition')

    p.setup = function () {
        side = getCanvasSize(400, 'phase_transition_sim');
        p.createCanvas(side, side).parent('phase_transition_sim');
        diameter = 5;
        matter = balls_init(100, side, 'phase_transition_sim');
        matter = balls_vrandom(matter, 200);
        view = Visible('phase_transition_sim')
    }

    p.draw = function () {
        if (!view.visible) return

        p.background(p.color('#a7a7a7'));

        checkcollision(matter, diameter)

        for (let i of matter) {
            updatefluid(i, matter, diameter, 0, 0.01, 1)
            updateparticle(i, side, diameter, 1)
            p.fill("black");
            p.noStroke()
            p.circle(i.x, i.y, diameter - 0.1)
        }
    }
}

new p5(phase_transition_sim);