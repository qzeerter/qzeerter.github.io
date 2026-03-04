console.log('%c > SYSTEM ONLINE \n%c Code by qzeerter', 'color: #ff4d4d; font-size: 18px; font-weight: bold;', 'color: #88888e; font-size: 12px;');

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('preloader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
        document.body.classList.add('loaded');
    }, 1600);
});

const musicWidget = document.getElementById('music-widget');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const playIcon = document.getElementById('play-icon');
const progressFill = document.getElementById('progress-fill');

if (musicWidget && playBtn && stopBtn && playIcon && progressFill) {
    const audio = new Audio('music.mp3');
    audio.loop = true;
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'fa-solid fa-play';
            musicWidget.style.opacity = '0.7';
        } else {
            audio.play();
            playIcon.className = 'fa-solid fa-pause';
            musicWidget.style.opacity = '1';
        }
        isPlaying = !isPlaying;
    });

    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playIcon.className = 'fa-solid fa-play';
        musicWidget.style.opacity = '0.7';
        progressFill.style.width = '0%';
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const p = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${p}%`;
        }
    });
}

const syncClock = () => {
    const d = new Date();
    const el = document.getElementById('clock');
    if (el) el.textContent = d.toLocaleTimeString('ru-RU', { hour12: false });

    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');
    
    if (statusText && statusDot) {

        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const ownerTime = new Date(utc + (3600000 * 3)); 
        const h = ownerTime.getHours();

        if (h >= 8 && h < 24) {
            statusText.textContent = "ACTIVE";
            statusDot.style.backgroundColor = "#00ff88";
            statusDot.style.boxShadow = "0 0 6px #00ff88";
        } else {
            statusText.textContent = "OFFLINE";
            statusDot.style.backgroundColor = "#666";
            statusDot.style.boxShadow = "none";
        }
    }
};
setInterval(syncClock, 1000);
syncClock();

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
    }
    if (outline) {
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 150, fill: "forwards" });
    }
});

document.querySelectorAll('.social-btn, .music-widget').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        if (outline) outline.setAttribute('style', 'width: 60px; height: 60px; background-color: rgba(255, 77, 77, 0.1);');
        btn.style.transition = 'transform 0.1s ease-out';
    });
    
    btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.1}px, ${(e.clientY - r.top - r.height/2) * 0.1}px) scale(1.02)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        if (outline) outline.setAttribute('style', 'width: 36px; height: 36px; background-color: transparent;');
        btn.style.transform = 'translate(0px, 0px) scale(1)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
});

const card = document.getElementById('card');
document.addEventListener('mousemove', (e) => {
    if (!card) return;
    card.style.transform = `rotateY(${(window.innerWidth / 2 - e.pageX) / 40}deg) rotateX(${(window.innerHeight / 2 - e.pageY) / 40}deg)`;
});
document.addEventListener('mouseleave', () => {
    if (!card) return;
    card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    setTimeout(() => { card.style.transition = 'none'; }, 600);
});

window.copyEmail = () => {
    const txt = document.getElementById('email-text');
    if (!txt) return;
    navigator.clipboard.writeText(txt.innerText);
    
    const ico = document.getElementById('copy-icon');
    if (ico) {
        ico.className = 'fa-solid fa-check copy-icon';
        ico.style.color = '#ff4d4d'; 
        setTimeout(() => {
            ico.className = 'fa-regular fa-copy copy-icon';
            ico.style.color = 'rgba(255,255,255,0.2)';
        }, 2000);
    }
}

const cvs = document.getElementById('bg-canvas');
if (cvs) {
    const ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    let parts = [];
    let mx = null, my = null;

    window.addEventListener('mousemove', (e) => { mx = e.x; my = e.y; });
    window.addEventListener('resize', () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; spawn(); });

    class P {
        constructor(x, y, dx, dy, s) { this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.s = s; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI*2); ctx.fillStyle = 'rgba(255, 50, 50, 0.6)'; ctx.fill(); }
        upd() {
            if (this.x > cvs.width || this.x < 0) this.dx = -this.dx;
            if (this.y > cvs.height || this.y < 0) this.dy = -this.dy;
            this.x += this.dx; this.y += this.dy; this.draw();
        }
    }

    const spawn = () => {
        parts = [];
        for (let i = 0; i < (cvs.height * cvs.width) / 8000; i++) {
            let s = Math.random() * 1.5 + 0.5;
            parts.push(new P(
                Math.random() * (innerWidth - s*4) + s*2, 
                Math.random() * (innerHeight - s*4) + s*2, 
                Math.random() - 0.5, Math.random() - 0.5, s
            ));
        }
    }

    const render = () => {
        requestAnimationFrame(render);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        parts.forEach(p => p.upd());
        
        for (let a = 0; a < parts.length; a++) {
            for (let b = a; b < parts.length; b++) {
                let d = (parts[a].x - parts[b].x)**2 + (parts[a].y - parts[b].y)**2;
                if (d < 25000) {
                    ctx.strokeStyle = `rgba(255, 77, 77, ${(1 - d/25000) * 0.25})`; 
                    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(parts[a].x, parts[a].y); ctx.lineTo(parts[b].x, parts[b].y); ctx.stroke();
                }
            }
            if (mx && my) {
                let dMouse = Math.sqrt((mx - parts[a].x)**2 + (my - parts[a].y)**2);
                if (dMouse < 180) {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${1 - dMouse/180})`;
                    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(parts[a].x, parts[a].y); ctx.lineTo(mx, my); ctx.stroke();
                }
            }
        }
    }
    spawn(); render();
}

const tracker = document.getElementById("blob");
if (tracker) {
    let bx = window.innerWidth/2, by = window.innerHeight/2;
    let cx = bx, cy = by;
    window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
    
    const trackBlob = () => {
        bx += (cx - bx) * 0.08; by += (cy - by) * 0.08;
        tracker.style.transform = `translate(calc(${bx}px - 30vw), calc(${by}px - 30vw))`;
        requestAnimationFrame(trackBlob);
    }
    trackBlob();
}

