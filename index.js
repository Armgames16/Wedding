// ===== BOT & CHAT CONFIG =====
const BOT_TOKEN = '8479935538:AAEBGHnXxTfC5A8M2bjR211GnFP_YKkHh_Q';
const CHAT_ID = '7466048596';

// ===== OPEN DOOR & PLAY MUSIC =====
document.getElementById('openBtn').onclick = () => {
    const door = document.getElementById('door');
    door.style.opacity = '0';
    setTimeout(() => door.style.display = 'none', 800);
    document.getElementById('bgMusic').play().catch(() => {});
};

// ===== CALENDAR =====
const calGrid = document.getElementById('calDays');
if (calGrid) {
    for (let d = 1; d <= 30; d++) {
        let cls = (d === 14) ? 'day wedding-day' : 'day';
        calGrid.innerHTML += `<div class="${cls}">${d}</div>`;
    }
}

// ===== COUNTDOWN =====
const targetDate = new Date("June 14, 2026 15:00:00");
setInterval(() => {
    const diff = targetDate - new Date();
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    if (diff <= 0) {
        timerEl.innerHTML = `<div style="font-size: 1.5rem; color: #00cae3; font-weight: bold;">💖 ՀԱՐՍԱՆԻՔԸ ՍԿՍՎԵԼ Է 💖</div>`;
    } else {
        const d = Math.floor(diff / 86400000).toString().padStart(2, '0');
        const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        timerEl.innerHTML = `
            <div class="time-unit"><span>${d}</span><div>օր</div></div>
            <div class="time-unit"><span>${h}</span><div>ժամ</div></div>
            <div class="time-unit"><span>${m}</span><div>րոպե</div></div>
            <div class="time-unit"><span>${s}</span><div>վրկ․</div></div>`;
    }
}, 1000);

// ===== RSVP MODAL & TELEGRAM =====
let currentStatus = "Այո";
const rsvpModal = document.getElementById('rsvpModal');
const showModalBtn = document.getElementById('showModalBtn');

showModalBtn.onclick = () => rsvpModal.style.display = 'flex';
document.getElementById('closeModalBtn').onclick = () => rsvpModal.style.display = 'none';

document.querySelectorAll('.option-box').forEach(b => {
    b.onclick = function () {
        document.querySelectorAll('.option-box').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        currentStatus = this.dataset.val;
        document.getElementById('countBox').style.display = (currentStatus === 'Այո') ? 'block' : 'none';
    };
});

const guestCounterEl = document.getElementById('guestCounter');
let savedGuests = parseInt(localStorage.getItem('guestCount') || '0');
guestCounterEl.textContent = `Արդեն հաստատել են ${savedGuests} հյուր`;

document.getElementById('sendBtn').onclick = function () {
    const btn = this;
    const name = document.getElementById('guestName').value.trim();
    if (!name) return alert("Անունը լրացրեք");

    const wish = document.getElementById('guestWish').value.trim();
    let count = (currentStatus === 'Այո') ? parseInt(document.getElementById('guestCount').value) || 0 : 0;

    if (currentStatus === 'Այո' && (count <= 0 || count > 15)) {
        return alert("Խնդրում ենք նշել հյուրերի ճիշտ քանակը (1-15)");
    }

    const msg = `💌 Հաստատում\n👤 Հյուր: ${name}\n✨ Կգա՞: ${currentStatus}\n👥 Քանակ: ${count}\n💌 Բարեմաղթանք: ${wish}`;
    btn.innerHTML = "Ուղարկվում է...";
    btn.disabled = true;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`)
        .then(() => {
            if (currentStatus === 'Այո') {
                savedGuests += count;
                localStorage.setItem('guestCount', savedGuests);
                guestCounterEl.textContent = `Արդեն հաստատել են ${savedGuests} հյուր`;
            }
            btn.innerHTML = "Ուղարկված է ✅";
            btn.style.background = "#4CAF50";
            setTimeout(() => {
                rsvpModal.style.display = 'none';
                btn.innerHTML = "Հաստատել";
                btn.disabled = false;
                btn.style.background = "";
            }, 2000);
        })
        .catch(() => {
            alert("Սխալ, փորձեք նորից");
            btn.disabled = false;
            btn.innerHTML = "Հաստատել";
        });
};

// ===== SCROLL OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show-btn'); });
});
observer.observe(showModalBtn);

// ===== MUSIC TOGGLE =====
const musicToggleBtn = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
musicToggleBtn.onclick = () => {
    if (bgMusic.paused) { bgMusic.play(); } else { bgMusic.pause(); }
};

function createHeart() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart"; // Սա պետք է 100% համընկնի CSS-ի դասի հետ
    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.position = "fixed";
    heart.style.bottom = "-50px";

    container.appendChild(heart);

    setTimeout(() => { heart.remove(); }, 8000);
}
setInterval(createHeart, 500);

function createHeart() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart";

    const types = ["💍"];
    heart.innerHTML = types[Math.floor(Math.random() * types.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (4 + Math.random() * 4) + "s";
    heart.style.opacity = Math.random() * 0.5 + 0.5; // Որ շատ թափանցիկ չլինեն

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Սկսել սրտիկները
setInterval(createHeart, 400);

