function balls_init(n_balls, canvas_size) {
    let particles = [];
    const rows = Math.ceil(n_balls / Math.sqrt(n_balls))
    const spacing = Math.round(canvas_size / (rows + 1))
    let posx = 0
    let index = 0
    for (let x = 0; x < rows; x++) {
        posx = posx + spacing
        let posy = 0
        for (let y = 0; y < rows; y++) {
            posy = posy + spacing
            particles.push({ x: posx, y: posy, vx: 0, vy: 0 })
            index = index + 1
            if (index >= n_balls) {
                return particles
            }
        }
        if (index >= n_balls) {
            return particles
        }
    }
    return particles
}

function updateliquid(element, liquid, gravity, attraction, diameter) {
    element.vy = gravity

    for (let j in liquid) {
        if (Math.round(Math.sqrt((element.x - j.x) ** 2 - (element.y - j.y) ** 2)) <= diameter) {
            //to do
        }
    }
}