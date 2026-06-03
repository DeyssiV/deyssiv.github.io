const oceanCanvas = document.getElementById('ocean-canvas');
const octx = oceanCanvas.getContext('2d');

let bubblesEnabled = true;
let bubbles = [];

function resizeOcean() {
    oceanCanvas.width = window.innerWidth;
    oceanCanvas.height = window.innerHeight;
}

function createBubble(fromBottom = false) {
    return {
        x: Math.random() * oceanCanvas.width,
        y: fromBottom ? oceanCanvas.height + 10 : Math.random() * oceanCanvas.height,
        r: Math.random() * 4 + 1,
        speed: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
    };
}

function initBubbles() {
    bubbles = Array.from({ length: 60 }, () => createBubble());
}

function drawOcean() {
    const w = oceanCanvas.width, h = oceanCanvas.height;
    const scroll = window.scrollY / (document.body.scrollHeight - h);
    const topColor = `hsl(${200 + scroll * 10}, 70%, ${72 - scroll * 10}%)`;
const botColor = `hsl(${210 + scroll * 10}, 65%, ${55 - scroll * 8}%)`;
    const grad = octx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    octx.fillStyle = grad;
    octx.fillRect(0, 0, w, h);

    octx.save();
    for (let i = 0; i < 5; i++) {
        const x = (w * 0.15) + i * (w * 0.18);
        const rayGrad = octx.createLinearGradient(x, 0, x + 80, h * 0.7);
        rayGrad.addColorStop(0, 'rgba(0,180,220,0.04)');
        rayGrad.addColorStop(1, 'rgba(0,180,220,0)');
        octx.beginPath();
        octx.moveTo(x, 0);
        octx.lineTo(x + 80, h * 0.7);
        octx.lineTo(x - 20, h * 0.7);
        octx.closePath();
        octx.fillStyle = rayGrad;
        octx.fill();
    }
    octx.restore();

    if (bubblesEnabled) {
        bubbles.forEach((b, i) => {
            b.y -= b.speed;
            b.wobble += b.wobbleSpeed;
            b.x += Math.sin(b.wobble) * 0.4;
            if (b.y < -10) bubbles[i] = createBubble(true);
            octx.beginPath();
            octx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            octx.strokeStyle = `rgba(150,230,255,${b.opacity})`;
            octx.lineWidth = 0.8;
            octx.stroke();
            const hgl = octx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r);
            hgl.addColorStop(0, `rgba(255,255,255,${b.opacity * 0.6})`);
            hgl.addColorStop(1, 'rgba(255,255,255,0)');
            octx.fillStyle = hgl;
            octx.fill();
        });
    }
    requestAnimationFrame(drawOcean);
}

window.toggleBubbles = function () { bubblesEnabled = !bubblesEnabled; };

const fishCanvas = document.getElementById('fish-canvas');
const fctx = fishCanvas.getContext('2d');

const FISH = [
    { emoji: '🐠', x: 50,  y: 100, vx: 0.8,  vy: 0.2,  size: 28 },
    { emoji: '🐟', x: 200, y: 200, vx: -0.6, vy: 0.3,  size: 24 },
    { emoji: '🐡', x: 350, y: 150, vx: 0.5,  vy: -0.4, size: 26 },
    { emoji: '🦈', x: 100, y: 300, vx: 1.2,  vy: 0.1,  size: 32 },
    { emoji: '🐙', x: 280, y: 350, vx: -0.4, vy: -0.3, size: 30 },
    { emoji: '🦑', x: 400, y: 250, vx: 0.3,  vy: 0.6,  size: 26 },
    { emoji: '🐚', x: 60,  y: 380, vx: 0.2,  vy: -0.1, size: 22 },
];

let tankBubbles = Array.from({ length: 20 }, () => ({
    x: Math.random() * 480, y: Math.random() * 400,
    r: Math.random() * 3 + 1, speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.3 + 0.05, wobble: Math.random() * Math.PI * 2,
}));

function resizeFishTank() {
    const tank = document.querySelector('.hero-fish-tank');
    if (!tank) return;
    fishCanvas.width = tank.clientWidth;
    fishCanvas.height = tank.clientHeight;
}

function drawFishTank() {
    const w = fishCanvas.width, h = fishCanvas.height;
    fctx.clearRect(0, 0, w, h);
    const wg = fctx.createLinearGradient(0, 0, 0, h);
    wg.addColorStop(0, 'rgba(0,50,80,0.3)');
    wg.addColorStop(1, 'rgba(0,20,40,0.6)');
    fctx.fillStyle = wg;
    fctx.fillRect(0, 0, w, h);
    fctx.fillStyle = 'rgba(10,40,30,0.6)';
    fctx.fillRect(0, h * 0.85, w, h * 0.15);
    fctx.fillStyle = 'rgba(0,180,120,0.3)';
    for (let i = 0; i < 8; i++) {
        const gx = 30 + i * (w / 7);
        const gh = 15 + Math.sin(i * 1.3) * 10;
        fctx.beginPath();
        fctx.ellipse(gx, h * 0.85, 4, gh, 0, Math.PI, 0);
        fctx.fill();
    }
    tankBubbles.forEach((b, i) => {
        b.y -= b.speed; b.wobble += 0.02; b.x += Math.sin(b.wobble) * 0.3;
        if (b.y < -5) tankBubbles[i] = { ...b, x: Math.random() * w, y: h + 5, speed: Math.random() * 0.5 + 0.2 };
        fctx.beginPath();
        fctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        fctx.strokeStyle = `rgba(150,230,255,${b.opacity})`;
        fctx.lineWidth = 0.7;
        fctx.stroke();
    });
    FISH.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if (f.x < 0 || f.x > w - f.size) f.vx *= -1;
        if (f.y < 0 || f.y > h * 0.82 - f.size) f.vy *= -1;
        fctx.save();
        fctx.font = `${f.size}px serif`;
        if (f.vx < 0) { fctx.scale(-1, 1); fctx.fillText(f.emoji, -f.x - f.size, f.y + f.size); }
        else { fctx.fillText(f.emoji, f.x, f.y + f.size); }
        fctx.restore();
    });
    const shimmer = fctx.createLinearGradient(0, 0, 0, 30);
    shimmer.addColorStop(0, 'rgba(0,200,255,0.06)');
    shimmer.addColorStop(1, 'rgba(0,200,255,0)');
    fctx.fillStyle = shimmer;
    fctx.fillRect(0, 0, w, 30);
    requestAnimationFrame(drawFishTank);
}

function animateSkills() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.width + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bar').forEach(bar => observer.observe(bar));
}

window.handleSubmit = function (e) {
    e.preventDefault();
    const msg = document.getElementById('form-msg');
    msg.textContent = '🐠 Message received! Thanks for reaching out.';
    msg.className = 'form-message success';
    e.target.reset();
    setTimeout(() => { msg.textContent = ''; msg.className = 'form-message'; }, 5000);
};

function setupNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.style.background = window.scrollY > 60 ? 'rgba(4,8,15,0.95)' : 'rgba(4,8,15,0.7)';
    }, { passive: true });
}

function setupFadeIn() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('section, .project-card, .skill-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

document.addEventListener('click', e => {
    if (['A','BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    for (let i = 0; i < 6; i++) {
        bubbles.push({
            x: e.clientX + (Math.random() - 0.5) * 20,
            y: e.clientY + window.scrollY,
            r: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.04 + 0.01,
        });
    }
});

window.addEventListener('load', () => {
    resizeOcean(); initBubbles(); requestAnimationFrame(drawOcean);
    resizeFishTank(); requestAnimationFrame(drawFishTank);
    animateSkills(); setupNavbar(); setupFadeIn();
});

window.addEventListener('resize', () => { resizeOcean(); resizeFishTank(); });
