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
for (let d = 1; d <= 30; d++) {
    let cls = (d === 14) ? 'day wedding-day' : 'day';
    calGrid.innerHTML += `<div class="${cls}">${d}</div>`;
}

// ===== COUNTDOWN =====
const targetDate = new Date("June 14, 2026 15:00:00");
setInterval(() => {
    const diff = targetDate - new Date();
    const timerEl = document.getElementById('timer');
    if (diff <= 0) {
        timerEl.innerHTML = `<div style="font-size: 1.5rem; color: var(--blue); font-weight: bold;">💖 ՀԱՐՍԱՆԻՔԸ ՍԿՍՎԵԼ Է 💖</div>`;
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

// ===== RSVP MODAL =====
let status = "Այո";
const rsvpModal = document.getElementById('rsvpModal');
const showModalBtn = document.getElementById('showModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

showModalBtn.onclick = () => rsvpModal.style.display = 'flex';
closeModalBtn.onclick = () => rsvpModal.style.display = 'none';

document.querySelectorAll('.option-box').forEach(b => {
    b.onclick = function () {
        document.querySelectorAll('.option-box').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        status = this.dataset.val;
        document.getElementById('countBox').style.display = (status === 'Այո') ? 'block' : 'none';
    };
});

// ===== GUEST COUNTER INIT =====
const guestCounterEl = document.getElementById('guestCounter');
let savedGuests = parseInt(localStorage.getItem('guestCount') || '0');
guestCounterEl.textContent = `Արդեն հաստատել են ${savedGuests} հյուր`;

document.getElementById('sendBtn').onclick = function () {
    const btn = this;
    const name = document.getElementById('guestName').value.trim();
    if (!name) return alert("Անունը լրացրեք");

    const wish = document.getElementById('guestWish').value.trim();
    let count = (status === 'Այո') ? parseInt(document.getElementById('guestCount').value) || 0 : 0;

    // Ստուգում, որ «Այո» դեպքում՝ նվազագույն 1 և առավելագույն 15
    if (status === 'Այո') {
        if (count <= 0) {
            return alert("Խնդրում ենք նշել հյուրերի քանակը");
        }
        if (count > 15) {
            return alert("Մեկ անձից հնարավոր չէ հաստատել 15-ից ավելի հյուր");
        }
    }

    const msg = `💌 Հաստատում\n👤 Հյուր: ${name}\n✨ Կգա՞: ${status}\n👥 Քանակ: ${count}\n💌 Բարեմաղթանք: ${wish}`;

    btn.innerHTML = "Ուղարկվում է...";
    btn.disabled = true;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`)
        .then(() => {
            const prev = parseInt(localStorage.getItem('guestCount') || '0');
            const total = prev + count;
            localStorage.setItem('guestCount', total);
            guestCounterEl.textContent = `Արդեն հաստատել են ${total} հյուր`;


            btn.innerHTML = "Ուղարկված է ✅";
            btn.style.background = "#4CAF50";
            setTimeout(() => {
                rsvpModal.style.display = 'none';
                btn.innerHTML = `<div class="triangle-icon"></div> Հաստատել`;
                btn.disabled = false;
                btn.style.background = "";
            }, 2000);
        })
        .catch(() => {
            btn.innerHTML = `<div class="triangle-icon"></div> Հաստատել`;
            btn.disabled = false;
            alert("Սխալ, փորձեք նորից");


        });
};
// ===== SHOW RSVP BUTTON WHEN SCROLL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show-btn');
    });
});
observer.observe(showModalBtn);

// ===== INITIAL COUNTBOX DISPLAY =====
document.getElementById('countBox').style.display = (status === 'Այո') ? 'block' : 'none';

// ===== ESC CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        rsvpModal.style.display = 'none';
    }
});

document.querySelectorAll('.option-box').forEach(b => {
    b.onclick = function () {
        document.querySelectorAll('.option-box').forEach(x => x.classList.remove('active'));
        this.classList.add('active');

        const status = this.dataset.val;

        document.getElementById('countBox').style.display =
            (status === 'Այո') ? 'block' : 'none';
    };
});

const musicToggleBtn = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

musicToggleBtn.onclick = () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggleBtn.textContent = "🎵";
    } else {
        bgMusic.pause();
        musicToggleBtn.textContent = "🎵";
    }
};
