function getCanvasSize(maxSize, containerId) {
    const container = document.getElementById(containerId);
    let available
    if (container && container.clientWidth > 0) {
        available = container.clientWidth
    }
    else {
        available = window.innerWidth * 0.9
    }
    return Math.min(maxSize, available);
}

function balls_init(n_balls, canvas_size, containerId) {

    const container = document.getElementById(containerId)
    let available
    if (container && container.clientWidth > 0) {
        available = container.clientWidth
    }
    else {
        available = window.innerWidth * 0.9
    }
    proportional_balls = (n_balls * available) / 400
    n_balls = Math.min(n_balls, proportional_balls)

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

function balls_block(n_balls, canvas_size, containerId, diameter) {

    const container = document.getElementById(containerId)
    let available
    if (container && container.clientWidth > 0) {
        available = container.clientWidth
    }
    else {
        available = window.innerWidth * 0.9
    }
    proportional_balls = (n_balls * available) / 400
    n_balls = Math.min(n_balls, proportional_balls)

    let particles = [];
    const rows = Math.ceil(n_balls / Math.sqrt(n_balls))
    const spacing = Math.round(diameter * 1.25)
    let space = (n_balls / rows) * spacing
    let posx = (canvas_size - space) / 2
    let index = 0
    for (let x = 0; x < rows; x++) {
        posx = posx + spacing
        let posy = (canvas_size - space) / 2
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

function balls_vrandom(particles, KE) {
    let total = 0;

    for (let p of particles) {
        p.vx = Math.random() * 2 - 1;
        p.vy = Math.random() * 2 - 1;

        total += p.vx * p.vx + p.vy * p.vy;
    }

    if (total === 0 || particles.length === 0) return;

    let scale = Math.sqrt((2 * KE) / total);

    for (let p of particles) {
        p.vx *= scale;
        p.vy *= scale;
    }
    return particles;
}

function updateparticle(element, canvas_size, diameter, elasticity) {
    element.x += element.vx
    element.y += element.vy
    if (element.x > canvas_size - diameter / 2) {
        element.x = canvas_size - diameter / 2;
        element.vx *= -elasticity;
    }
    if (element.x < diameter / 2) {
        element.x = diameter / 2;
        element.vx *= -elasticity;
    }
    if (element.y < diameter / 2) {
        element.y = diameter / 2;
        element.vy *= -elasticity;
    }
    if (element.y > canvas_size - diameter / 2) {
        element.y = canvas_size - diameter / 2;
        element.vy *= -elasticity;
    }
}

function checkcollision(particleList, diameter) {
    for (let a = 0; a < particleList.length; a++) {
        for (let b = a + 1; b < particleList.length; b++) {
            let element = particleList[a];
            let j = particleList[b];

            let dx = j.x - element.x;
            let dy = j.y - element.y;
            let dist = Math.sqrt(dx * dx + dy * dy)

            if (j === element) continue
            if (dist <= diameter && dist > 0) {
                let nx = dx / dist; //normal vectors
                let ny = dy / dist;

                let overlap = diameter - dist; //check how much they overlap
                element.x -= nx * overlap / 2;
                element.y -= ny * overlap / 2;
                j.x += nx * overlap / 2;
                j.y += ny * overlap / 2;

                let tx = -ny //tangent
                let ty = nx

                let rvx = j.vx - element.vx;
                let rvy = j.vy - element.vy;

                let vn = rvx * nx + rvy * ny;

                if (vn >= 0) continue;

                element.vx += vn * nx;
                element.vy += vn * ny;

                j.vx -= vn * nx;
                j.vy -= vn * ny;
            }
        }
    }
}

function updatefluid(element, fluid, gravity, attraction, retardation) {
    //gravity
    element.vy += gravity

    //attraction
    for (let j of fluid) {
        if (j === element) continue;

        let dx = j.x - element.x;
        let dy = j.y - element.y;
        let distance = Math.sqrt(dx * dx + dy * dy)
        let angle = Math.atan2(dy, dx)

        if (distance === 0) continue;

        let force = attraction / (distance * distance)
        element.vx = element.vx + (force * Math.cos(angle))
        element.vy = element.vy + (force * Math.sin(angle))
    }

    //energy loss
    element.vx *= retardation;
    element.vy *= retardation;
}

function updatesolid(element, solid, gravity, attraction, equilibriumDistance, retardation, side, diameter) {
    //gravity
    element.vy += gravity

    //attraction
    for (let j of solid) {
        if (j === element) continue;

        let dx = j.x - element.x;
        let dy = j.y - element.y;
        let distance = Math.sqrt(dx * dx + dy * dy)
        let attractionDistance = 1.5 * (equilibriumDistance + diameter)
        let angle = Math.atan2(dy, dx)
        const r0 = diameter + equilibriumDistance
        let force = 0

        if (distance === 0) continue;

        if (distance < attractionDistance) {
            force = attraction * (distance - r0) / (distance * distance);
            if (distance < r0) force *= 3;
        }
        element.vx = element.vx + (force * Math.cos(angle))
        element.vy = element.vy + (force * Math.sin(angle))
    }


    //speed bump
    let speed = Math.hypot(element.vx, element.vy);
    if (speed > 4) {
        element.vx *= 4 / speed;
        element.vy *= 4 / speed;
    }

    //energy loss
    for (let j of solid) {
        if (j === element) continue;
        let dx = j.x - element.x, dy = j.y - element.y;
        if (dx * dx + dy * dy < 39 * 39) {
            element.vx += (j.oldVx - element.oldVx) * (1 - retardation);
            element.vy += (j.oldVy - element.oldVy) * (1 - retardation);
        }
    }
}

function repelMouse(element, mouseX, mouseY, repelForce, repelDistance) {
    let dx = mouseX - element.x;
    let dy = mouseY - element.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0 && distance < repelDistance) {
        let angle = Math.atan2(dy, dx);
        let force = repelForce / Math.max((distance * distance), 25);
        element.vx -= force * Math.cos(angle);
        element.vy -= force * Math.sin(angle);
    }
}

function attractMouse(element, mouseX, mouseY, attractForce, attractDistance) {
    let dx = mouseX - element.x;
    let dy = mouseY - element.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0 && distance < attractDistance) {
        let angle = Math.atan2(dy, dx);
        let force = attractForce / Math.max((distance * distance), 25);
        element.vx += force * Math.cos(angle);
        element.vy += force * Math.sin(angle);
    }
}

function mouseInteract(element, mouseX, mouseY, diameter) {
    let dx = element.x - mouseX
    let dy = element.y - mouseY
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < (diameter / 2)) {
        return true
    }
    else {
        return false
    }
}

function applyForce(element, mouseX, mouseY, diameter, forceMultiplier, maxForce) {
    let dx = mouseX - element.x
    let dy = mouseY - element.y
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance >= diameter / 2) {
        let angle = Math.atan2(dy, dx);
        let force = Math.min(forceMultiplier * distance, maxForce);
        element.vx += force * Math.cos(angle);
        element.vy += force * Math.sin(angle);
    }
}