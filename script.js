function enviarWhatsApp() {
    const nome    = document.getElementById("inputNome").value.trim();
    const email   = document.getElementById("inputEmail").value.trim();
    const servico = document.getElementById("inputServico").value.trim();

    // Validação básica
    if (!nome) {
        alert("Por favor, informe seu nome.");
        return;
    }
    if (!email) {
        alert("Por favor, informe seu e-mail.");
        return;
    }
    if (!servico) {
        alert("Por favor, selecione um serviço.");
        return;
    }

    const mensagem = `Olá! Eu sou ${nome}, vim pelo seu portfólio e queria um ${servico}. Como funciona?`;

    const numeroWpp = "5519999867459"; // 55 + DDD + número
    const url = `https://wa.me/${19999867459}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}


// ===== PARTICLES =====
const cv = document.getElementById('cv');
const cx = cv.getContext('2d');
let W = cv.width = window.innerWidth;
let H = cv.height = window.innerHeight;
window.addEventListener('resize', () => {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
});

let mx = -999, my = -999;
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

const pts = [];
for (let i = 0; i < 65; i++) {
    pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.4,
        op: Math.random() * 0.4 + 0.08,
        c: Math.random() > 0.5 ? '168,85,247' : '192,38,211'
    });
}

function frame() {
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(${p.c},${p.op})`;
        cx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 100) {
                cx.beginPath();
                cx.moveTo(pts[i].x, pts[i].y);
                cx.lineTo(pts[j].x, pts[j].y);
                cx.strokeStyle = `rgba(124,58,237,${(100 - d) / 100 * 0.08})`;
                cx.lineWidth = 0.5;
                cx.stroke();
            }
        }
        const dm = Math.hypot(pts[i].x - mx, pts[i].y - my);
        if (dm < 130) {
            cx.beginPath();
            cx.moveTo(pts[i].x, pts[i].y);
            cx.lineTo(mx, my);
            cx.strokeStyle = `rgba(192,38,211,${(130 - dm) / 130 * 0.16})`;
            cx.lineWidth = 0.5;
            cx.stroke();
        }
    }
    requestAnimationFrame(frame);
}
frame();

// ===== CURSOR =====
const c1 = document.getElementById('cur');
const c2 = document.getElementById('cur2');
let fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
    c1.style.left = e.clientX + 'px';
    c1.style.top = e.clientY + 'px';
    mx = e.clientX;
    my = e.clientY;
});

function animC() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    c2.style.left = fx + 'px';
    c2.style.top = fy + 'px';
    requestAnimationFrame(animC);
}
animC();

document.querySelectorAll('a,button,.srv-card,.pf-card,.dep-card,.proc-step,.tb').forEach(el => {
    el.addEventListener('mouseenter', () => c1.style.transform = 'translate(-50%,-50%) scale(1.7)');
    el.addEventListener('mouseleave', () => c1.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ===== NAV =====
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => navEl.classList.toggle('scrolled', window.scrollY > 50));
document.getElementById('hbg').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open')));

// ===== TYPING — GLITCH NEON =====
const words = [
    'Desenvolvedor Web',
    'Criador de Landing Pages',
    'Designer de Experiências',
    'Especialista em Conversão',
    'Seu Parceiro Digital'
];
let wi = 0;
const tyEl = document.getElementById('typingText');
const glitchChars = '!!!!!!!!!!';

// Mostra o primeiro texto imediatamente
tyEl.textContent = words[0];

function glitchSwap() {
    const nextIndex = (wi + 1) % words.length;
    const newWord = words[nextIndex];
    let iteration = 0;
    const maxIter = 18;

    const interval = setInterval(() => {
        tyEl.textContent = newWord
            .split('')
            .map((char, i) => {
                if (char === ' ') return ' ';
                if (i < iteration) return newWord[i];
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');

        iteration++;

        if (iteration > maxIter) {
            clearInterval(interval);
            tyEl.textContent = newWord;
            wi = nextIndex;
        }
    }, 45);
}

// Troca a cada 3.5 segundos
setInterval(glitchSwap, 3500);

// ===== COUNTERS =====
const cObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const t = setInterval(() => {
            cur += target / 60;
            if (cur >= target) {
                cur = target;
                clearInterval(t);
            }
            el.textContent = Math.floor(cur) + (target === 100 ? '%' : '+');
        }, 22);
        cObs.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n').forEach(el => cObs.observe(el));

// ===== SKILL BARS =====
const skObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.sk-fill').forEach(b => {
            b.style.width = b.dataset.width + '%';
        });
    });
}, { threshold: 0.3 });
const skSec = document.getElementById('skills');
if (skSec) skObs.observe(skSec);

// ===== REVEAL =====
const rvObs = new IntersectionObserver(es => {
    es.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('on'), i * 70);
        rvObs.unobserve(e.target);
    });
}, { threshold: 0.07 });
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el => rvObs.observe(el));

// ===== PORTFOLIO FILTER =====
document.querySelectorAll('.fb').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        document.querySelectorAll('.pf-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.93)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s, transform 0.4s';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 260);
        });
    });
});

// ===== 3D TILT =====
document.querySelectorAll('.srv-card,.pf-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = (e.clientY - r.top - r.height / 2) / r.height * -7;
        const ry = (e.clientX - r.left - r.width / 2) / r.width * 7;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ===== FORM =====
function sendForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.fsub');
    btn.textContent = '✅ Mensagem enviada! Falarei com você em breve.';
    btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = '🚀 Enviar e Começar Projeto';
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
    }, 4500);
}