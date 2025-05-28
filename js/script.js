document.addEventListener('DOMContentLoaded', () => {

    // 0) gerekli buton/element referansları
    const brokenHeart = document.getElementById('broken-heart');
    const visibilityBtn = document.getElementById('toggle-visibility');
    const controls = document.querySelectorAll('#controls > .ctrl-btn:not(#toggle-visibility):not(#basketball):not(#broken-heart)');
    const msgEl = document.getElementById('message');
    const goBackBtn = document.getElementById('go-back');
    const sliderBtn = document.getElementById('heart-slider-btn');
    const sliderModal = document.getElementById('heart-slider-modal');
    const sliderClose = document.getElementById('slider-close');

    // Slider aç/kapa
    sliderBtn.addEventListener('click', () => {
        sliderModal.classList.remove('hidden');
    });
    sliderClose.addEventListener('click', () => {
        sliderModal.classList.add('hidden');
    });
    sliderModal.addEventListener('click', e => {
        if (e.target === sliderModal) sliderModal.classList.add('hidden');
    });

    const style = document.createElement('style');
    style.textContent = `
  @keyframes grow-forever {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(50);
      opacity: 1;
    }
  }
  .color-heart {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    animation: grow-forever 5s linear forwards;
    transform-origin: center center;
  }
`;
    document.head.appendChild(style);

    // 2) Harf harf yazı efekti (reveal)
    if (msgEl) {
        const message = "";
        msgEl.innerHTML = '';
        message.split('').forEach(ch => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.classList.add('char');
            msgEl.appendChild(span);
        });
        let idx = 0;
        (function reveal() {
            const chars = msgEl.querySelectorAll('.char');
            if (idx < chars.length) {
                chars[idx].classList.add('visible');
                idx++;
                setTimeout(reveal, 100);
            }
        })();
    }

    // 3) “Geri Dön” butonu
    goBackBtn?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    // 4) kırık kalbe tıklayınca: normal kalbe dön + ortada büyüyen kalp + mesaj
    if (brokenHeart) {
        brokenHeart.addEventListener('click', () => {
            // Kırık kalbi tamir et
            brokenHeart.textContent = '💖';


            // Ekrana ortalanmış bir mesaj ekle
            const msg = document.createElement('div');
            msg.textContent = 'seni seviyorum';
            Object.assign(msg.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -150%)',
                background: 'rgba(255,255,255,0.9)',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.6rem',
                fontFamily: 'var(--ff-base)',
                color: 'var(--clr-text)',
                zIndex: 9999,
            });
            document.body.appendChild(msg);

            // Ortada büyüyen kalp
            const growHeart = document.createElement('div');
            growHeart.textContent = '💜🤍';
            Object.assign(growHeart.style, {
                position: 'fixed',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(2)',
                fontSize: '4rem',
                zIndex: 10000,
                transition: 'transform 1s ease-out',
                zIndex: 9998,
            });
            document.body.appendChild(growHeart);

            // Bir frame sonra ölçeği büyüt
            requestAnimationFrame(() => {
                growHeart.style.transform = 'translate(-50%, -50%) scale(6)';
            });

            // 2 saniye sonra temizle ve sayfa değiştir
            setTimeout(() => {
                msg.remove();
                growHeart.remove();
                window.location.href = 'index2.html';
            }, 3000);
        });
    }
    // 5) Kontrolleri gizle/göster
    let controlsVisible = true;
    visibilityBtn?.addEventListener('click', () => {
        controlsVisible = !controlsVisible;

        // a) Diğer ctrl-btn’leri gizle/göster
        controls.forEach(btn => {
            btn.style.display = controlsVisible ? 'flex' : 'none';
        });

        // b) Göz ikonu metnini değiştir
        const icon = visibilityBtn.querySelector('.material-icons');
        if (icon) icon.textContent = controlsVisible ? 'visibility' : 'visibility_off';

        // c) Kırık kalp butonunu gizle/göster
        brokenHeart?.classList.toggle('hidden', controlsVisible);

        // d) Basketbol butonunu yalnızca “gizle” modunda göster
        const basketballBtn = document.getElementById('basketball');
        if (basketballBtn) {
            basketballBtn.style.display = controlsVisible ? 'none' : 'inline-flex';
        }
        // g) Start Game butonunu yalnızca “gizle” modunda göster
        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.style.display = controlsVisible ? 'none' : 'inline-flex';
        }
        // e) Dropdown elemanlarını seç (bunları başta tanımlamamışsın)
        const songList = document.getElementById('song-list');
        const dropdown = document.querySelector('.dropdown');

        // f) Şarkı seçme dropdown’unu kapat ve listeyi gizle
        if (songList) {
            songList.classList.add('hidden');
        }
        if (dropdown) {
            dropdown.setAttribute('aria-expanded', 'false');
        }
    });
    // 6) Yüzen mesajlar
    (function floatingText() {
        const messages = [
            "Beni Cok Mutlu Ediyorsun🤍", "BESMENUURRR 😺💜", "Sarılmak İstiyorum 🐣",
            "Korsan baba bey🩵",
        ];
        setInterval(() => {
            const msg = document.createElement('div');
            msg.className = 'floating-message';
            msg.textContent = messages[Math.floor(Math.random() * messages.length)];
            msg.style.position = 'fixed';
            msg.style.backgroundColor = `hsl(${Math.random() * 360},80%,80%)`;
            msg.style.opacity = 1;
            msg.style.pointerEvents = 'none';
            document.body.appendChild(msg);
            const w = msg.offsetWidth, h = msg.offsetHeight;
            msg.style.left = `${Math.random() * (window.innerWidth - w)}px`;
            msg.style.top = `${Math.random() * (window.innerHeight - h)}px`;
            setTimeout(() => msg.remove(), 3000);
        }, 1800);
    })();

    // 7) Modal & Fotoğraf slider
    const introModal = document.getElementById('intro-modal');
    const staticPhoto = document.querySelector('.static-photo');
    const photoPaths = [

    ];
    let photoIndex = 0;
    function updatePhoto() {
        if (staticPhoto) staticPhoto.src = photoPaths[photoIndex];
    }
    updatePhoto();
    introModal?.classList.remove('hidden');
    document.getElementById('show-photo')?.addEventListener('click', () => {
        photoIndex = 0; updatePhoto(); introModal.classList.remove('hidden');
    });
    document.getElementById('prev-photo')?.addEventListener('click', () => {
        photoIndex = (photoIndex - 1 + photoPaths.length) % photoPaths.length; updatePhoto();
    });
    document.getElementById('next-photo')?.addEventListener('click', () => {
        photoIndex = (photoIndex + 1) % photoPaths.length; updatePhoto();
    });
    document.getElementById('close-btn')?.addEventListener('click', () => {
        introModal.classList.add('hidden');
    });
    const infooBtn = document.getElementById('infoo');
    const infoBox = document.getElementById('info-box');

    infooBtn.addEventListener('click', () => {
        infoBox.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
        if (!infooBtn.contains(e.target) && !infoBox.contains(e.target)) {
            infoBox.classList.remove('visible');
        }
    });

    // 8) Tema sistemi
    const themes = ['dark', 'white'];
    let currentTheme = 0;
    function applyTheme(t) {
        const root = document.documentElement;
        const vars = {
            dark: ['#1e1b2e', '#0f0c1a', '#8e44ad', '#5e3370', 'black', '#8e44ad', '#f1e9ff', '#5e3370'],
            white: [
                '#ffffff', // --clr-bg-light: Saf beyaz arka plan
                '#fce4ec', // --clr-bg-dark: Açık pembe (light rose)
                '#ff99c8', // --clr-primary: Tatlı pastel pembe
                '#ff5ca1', // --clr-secondary: Lavanta-mor tonu
                '#333333', // --clr-text: Gül kurusu metin (pastel kontrast)
                '#fff0f5', // --clr-btn-bg: İnci pembesi buton arka planı
                '#ff69b4', // --clr-btn-text: Buton yazısı için pembe-mor karışımı
                '#ffd1e8'  // --clr-btn-hover: Parlak şeftali pembe hover
            ]
        }[t];
        ['--clr-bg-light', '--clr-bg-dark', '--clr-primary', '--clr-secondary', '--clr-text', '--clr-btn-bg', '--clr-btn-text', '--clr-btn-hover']
            .forEach((p, i) => root.style.setProperty(p, vars[i]));
        const body = document.body;
        if (t === 'white') {
            body.classList.add('glitter-bg');
            body.classList.add('hk-theme');
        } else {
            body.classList.remove('glitter-bg');
            body.classList.remove('hk-theme');
        }
    }
    applyTheme(themes[currentTheme]);
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        currentTheme = (currentTheme + 1) % themes.length;
        applyTheme(themes[currentTheme]);
    });
    document.getElementById('theme-toggle').addEventListener('click', () => {
        // Body'e uygulanan tema sınıfını toggle et
        document.body.classList.toggle('white-theme');

        // Info box içeriğini değiştir
        const infoBox = document.getElementById('info-box');
        if (document.body.classList.contains('white-theme')) {
            infoBox.innerHTML = `
                <ul>
                    <li>Beyaz ve Pembe (Simli) :)</li>
                </ul>
            `;
        } else {
            infoBox.innerHTML = `
                <ul>
                    <li>Moru Seviyorum (Temayi Degistir :3)</li>
                </ul>
            `;
        }
    });
    // 9) Şarkı seçimi
    const songSelect = document.getElementById('song-select');
    const songList = document.getElementById('song-list');
    const songLabel = document.getElementById('song-select-label');
    const bgMusic = document.getElementById('bg-music');
    songSelect?.addEventListener('click', () => {
        const dd = songSelect.closest('.dropdown');
        const open = dd.getAttribute('aria-expanded') === 'true';
        dd.setAttribute('aria-expanded', String(!open));
        songList.classList.toggle('hidden');
    });
    songList?.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            const src = e.target.getAttribute('data-src');
            if (bgMusic && src) { bgMusic.src = src; bgMusic.play().catch(() => { }); }
            if (songLabel) songLabel.textContent = e.target.textContent;
            songList.classList.add('hidden');
            songSelect.closest('.dropdown')?.setAttribute('aria-expanded', 'false');
        }
    });

    // 10) Aşk sözü butonu
    document.getElementById('quote-btn')?.addEventListener('click', () => {
        const quotes = [
            "Aşk, ruhun melodisidir.", "Seninle her an bir ömre bedel.",
            "Kalbim, senin adını fısıldar.", "Gözlerinde kaybolmak, en tatlı masal.",
            "Seni sevmek, hayatın en güzel yanı."
        ];
        const q = document.createElement('div');
        q.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        Object.assign(q.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'rgba(0,0,0,0.7)', color: '#fff',
            padding: '1rem 1.5rem', fontFamily: "'Pacifico',cursive",
            fontSize: '1.2rem', borderRadius: '0.75rem', zIndex: '1200', textAlign: 'center'
        });
        document.body.appendChild(q);
        setTimeout(() => q.remove(), 3000);
    });

    // 11) Scroll ile “surprise”
    window.addEventListener('scroll', () => {
        const surprise = document.getElementById('surprise');
        if (surprise && !surprise.classList.contains('show') &&
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            surprise.classList.add('show');
        }
    });

});
document.getElementById("basketball")?.addEventListener("click", () => {
    window.location.href = "oyun.html";
});
const startBtn = document.getElementById('start-game');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        window.location.href = 'oyun2.html';
    });
}
function addMiniHearts() {
    const container = document.querySelector('.message-area');

    // Her biri { size(px), x-offset(px), y-offset(px) }
    const configs = [
        { size: 50, x: 120, y: -100 },   // üst sağ mini kalp
        { size: 35, x: -140, y: 120 }    // alt sol mini kalp
    ];

    configs.forEach(cfg => {
        const mini = document.createElement('div');
        mini.classList.add('mini-heart');

        // boyutu piksel olarak ayarla
        mini.style.width = `${cfg.size}px`;
        mini.style.height = `${cfg.size}px`;

        // container'in ortasından cfg.x, cfg.y kadar kaydır
        mini.style.left = `calc(60% + ${cfg.x}px)`;
        mini.style.top = `calc(55% + ${cfg.y}px)`;

        // translate ile tam ortalamayı koru
        mini.style.transform += ' translate(-50%, -50%)';

        container.appendChild(mini);
    });
}

document.addEventListener('DOMContentLoaded', addMiniHearts);