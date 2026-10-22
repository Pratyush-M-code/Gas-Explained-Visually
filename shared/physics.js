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

function Visible(containerId) {
    const userViewing = { visible: true }
    let element = document.getElementById(containerId)
    if (element && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            userViewing.visible = entries[0].isIntersecting
        }).observe(element)
    }
    return userViewing
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
    let proportional_balls = n_balls * ((available / 400) ** 2)
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
    const proportional_balls = (n_balls * available ** 2) / (400 ** 2)
    n_balls = Math.min(n_balls, proportional_balls)

    let particles = [];
    const rows = Math.ceil(n_balls / Math.sqrt(n_balls))
    const spacing = Math.round(diameter * 1.25)
    let space = (n_balls / rows) * spacing
    let posx = (canvas_size - (rows - 1) * spacing) / 2 - spacing
    let index = 0
    for (let x = 0; x < rows; x++) {
        posx = posx + spacing
        let posy = (canvas_size - (rows - 1) * spacing) / 2 - spacing
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
    let total = 0, avgx = 0, avgy = 0;

    for (let p of particles) {
        p.vx = Math.random() * 2 - 1;
        p.vy = Math.random() * 2 - 1;

        total += p.vx * p.vx + p.vy * p.vy;
        avgx += p.vx
        avgy += p.vy
    }

    const n = particles.length;
    avgx /= n; avgy /= n;
    for (let p of particles) {
        p.vx -= avgx;
        p.vy -= avgy;
    }
    total -= n * (avgx * avgx + avgy * avgy);

    if (total === 0 || particles.length === 0) return;

    let scale = Math.sqrt((2 * KE) / total);

    for (let p of particles) {
        p.vx *= scale;
        p.vy *= scale;
    }
    return particles;
}

function updateparticle(element, canvas_size, diameter, elasticity, wallposX = canvas_size, wall0Y = 0) {
    element.x += element.vx
    element.y += element.vy
    if (element.x > wallposX - diameter / 2) {
        element.x = wallposX - diameter / 2;
        element.vx *= -elasticity;
    }
    if (element.x < diameter / 2) {
        element.x = diameter / 2;
        element.vx *= -elasticity;
    }
    if (element.y < wall0Y + (diameter / 2)) {
        element.y = wall0Y + (diameter / 2);
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

function updatefluid(element, fluid, diameter, gravity, attraction, retardation) {
    //gravity
    element.vy += gravity

    //attraction + repulsion
    for (let j of fluid) {
        if (j === element) continue;

        let dx = j.x - element.x;
        let dy = j.y - element.y;
        let distance = Math.sqrt(dx * dx + dy * dy)

        if (distance === 0) continue;

        if (distance > diameter) {
            let force = attraction / Math.max(distance * distance, 64)
            element.vx = element.vx + (force * (dx / distance))
            element.vy = element.vy + (force * (dy / distance))
        }
        if (distance < diameter) {
            let force = -(attraction / 2) / Math.max(distance * distance, 64)
            element.vx = element.vx + (force * (dx / distance))
            element.vy = element.vy + (force * (dy / distance))
        }
    }

    //energy loss
    element.vx *= retardation;
    element.vy *= retardation;
}

function updatematter(element, matter, gravity, attractive_coeff, relativeSlowing, retardation, maxForce, diameter) {
    //gravity
    element.vy += gravity

    //attraction by Lennard-Jones Potential
    let E = attractive_coeff; //Depth of potential well so attraction
    let s = (diameter * 1.25) / Math.pow(2, 1 / 6);
    let equilibriumDistance = Math.pow((2 * (s ** 6)), 1 / 6)
    let distance_cutoff_sq = (2.5 * s) ** 2
    for (let j of matter) {
        let dx = j.x - element.x;
        let dy = j.y - element.y;
        let distance_sq = dx * dx + dy * dy;
        if (distance_sq === 0 || distance_sq > distance_cutoff_sq) {
            continue
        }
        let distance_clamp_sq = Math.max(distance_sq, (s ** 2))
        let force = 24 * E * (2 * (s * s / distance_clamp_sq) ** 6 - (s * s / distance_clamp_sq) ** 3) / distance_clamp_sq
        const distance = Math.sqrt(distance_sq)
        if (Math.abs(force * distance) > maxForce) force = Math.sign(force) * maxForce / distance

        element.vx -= force * dx
        element.vy -= force * dy
    }

    // relative energy loss
    const relative_energy = Math.pow(2, 1 / 6) * s
    for (let j of matter) {
        if (j === element) continue
        const dx = j.x - element.x
        const dy = j.y - element.y
        if (dx * dx + dy * dy < (1.5 * relative_energy) ** 2) {
            element.vx += (j.oldVx - element.oldVx) * (1 - relativeSlowing)
            element.vy += (j.oldVy - element.oldVy) * (1 - relativeSlowing)
        }
    }

    //energy loss
    element.vx *= retardation;
    element.vy *= retardation;
}

//[Brownian motion of Multiple particle](https://paleodyn.uni-bremen.de/study/Dyn2/dyn2script_SCM.pdf)
function random_motion() { //to duplicate normal distribution
    let a = 1 - Math.random()
    let b = Math.random()
    let Box_Muller = Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b); //makes normal distribution
    return Box_Muller
}
function thermostat(particles, temp_target, friction_strength, time_step) {
    const decay = 1 - friction_strength * time_step
    const noise = Math.sqrt(temp_target * (1 - decay ** 2))
    for (const k of particles) {
        k.vx = k.vx * decay + noise * random_motion();
        k.vy = k.vy * decay + noise * random_motion();
    }
}

function tempChange(particles, temp_target, strength) {
    let ke = 0
    for (const p of particles) {
        ke += (p.vx * p.vx + p.vy * p.vy) / 2
    }

    const temp_now = Math.max(ke / particles.length, 1e-6)
    const scale = 1 + strength * (Math.sqrt(temp_target / temp_now) - 1)

    for (const p of particles) {
        p.vx *= scale
        p.vy *= scale
    }
}

function bgTempChange(particles, strength) {
    let ke = 0
    let old_ke = 0
    for (const p of particles) ke += (p.vx * p.vx + p.vy * p.vy) / 2
    const temp_now = Math.max(ke / particles.length, 1e-6)
    for (const p of particles) old_ke += (p.oldVx * p.oldVx + p.oldVy * p.oldVy) / 2
    const temp_old = Math.max(old_ke / particles.length, 1e-6)

    let temp_diff = Math.abs(temp_now - temp_old)
    let heating = ((temp_now - temp_old) > 0) ? 1 : 0
    let baseColor = [167, 167, 167]

    if (heating === 1) {
        const change = 88 * Math.tanh(strength * temp_diff / temp_old)
        baseColor = [167 + change, 167, 167]
    }
    if (heating === 0) {
        const change = 88 * Math.tanh(strength * temp_diff / temp_old)
        baseColor = [167, 167, 167 + change]
    }

    return baseColor
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

function attractMouse(element, mouseX, mouseY, attractForce, attractDistance, maxAttraction = 25) {
    let dx = mouseX - element.x;
    let dy = mouseY - element.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0 && distance < attractDistance) {
        let angle = Math.atan2(dy, dx);
        let force = attractForce / Math.max((distance * distance), maxAttraction);
        element.vx += force * Math.cos(angle);
        element.vy += force * Math.sin(angle);
    }
}

function mouseInteract(element, mouseX, mouseY, diameter) {
    let dx = element.x - mouseX
    let dy = element.y - mouseY
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < diameter) {
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