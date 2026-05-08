document.addEventListener('DOMContentLoaded', () => {

    // ── Loading Screen ──
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 1000);
        }, 1800);
    });

    // ── Cursor Glow ──
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top  = e.clientY + 'px';
    });

    // ── Theme Toggle ──
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = themeToggle.querySelector('i');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
    });

    // ── Music ──
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic     = document.getElementById('bg-music');
    const musicIcon   = musicToggle.querySelector('i');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        isPlaying ? bgMusic.pause() : bgMusic.play();
        isPlaying = !isPlaying;
        musicIcon.classList.toggle('fa-spin', isPlaying);
    });

    // ── Music Visualizer Bars ──
    const barsContainer = document.querySelector('.bars');
    for (let i = 0; i < 24; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '20%';
        barsContainer.appendChild(bar);
    }

    (function animateBars() {
        if (isPlaying) {
            document.querySelectorAll('.bar').forEach(bar => {
                bar.style.height = (Math.random() * 75 + 15) + '%';
            });
        }
        requestAnimationFrame(animateBars);
    })();

    // ── Floating Petals ──
    const petalsContainer = document.getElementById('petals-container');
    const petalStyle = document.createElement('style');
    petalStyle.innerHTML = `
        @keyframes fall {
            0%   { transform: translateY(-10vh) rotate(0deg) translateX(0); }
            50%  { transform: translateY(55vh) rotate(360deg) translateX(30px); }
            100% { transform: translateY(110vh) rotate(720deg) translateX(-20px); }
        }`;
    document.head.appendChild(petalStyle);

    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 14 + 8;
        petal.style.cssText = `
            left: ${Math.random() * 100}vw;
            width: ${size}px; height: ${size}px;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: fall ${Math.random() * 12 + 10}s linear forwards;
        `;
        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 22000);
    }
    setInterval(createPetal, 600);

    // ── Floating Hearts (Love Section) ──
    const heartsContainer = document.getElementById('floating-hearts');
    const heartEmojis = ['❤️','💕','💖','💗','💓','🌸','✨'];

    function createFloatingHeart() {
        const h = document.createElement('div');
        h.className = 'fheart';
        h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        const size = Math.random() * 1.5 + 0.8;
        h.style.cssText = `
            left: ${Math.random() * 100}%;
            bottom: 0;
            font-size: ${size}rem;
            animation: floatHeart ${Math.random() * 6 + 6}s ease-in forwards;
            animation-delay: ${Math.random() * 3}s;
        `;
        heartsContainer.appendChild(h);
        setTimeout(() => h.remove(), 12000);
    }

    // Only animate when section is visible
    const loveSection = document.getElementById('love-mom');
    let heartInterval = null;
    const loveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heartInterval = setInterval(createFloatingHeart, 400);
            } else {
                clearInterval(heartInterval);
            }
        });
    }, { threshold: 0.3 });
    loveObserver.observe(loveSection);

    // ── Typing Quotes ──
    const quotes = [
        "A mother's arms are more comforting than anyone else's.",
        "God could not be everywhere, and therefore he made mothers.",
        "Life doesn't come with a manual, it comes with a mother.",
        "A mother is she who can take the place of all others but whose place no one else can take.",
        "Successful mothers are not the ones that have never struggled. They are the ones that never give up."
    ];
    const authors = ["Princess Diana", "Rudyard Kipling", "Unknown", "Cardinal Mermillod", "Sharon Jaynes"];

    let quoteIndex = 0;
    const typingEl = document.getElementById('typing-quote');
    const authorEl = document.getElementById('quote-author');

    function typeQuote() {
        const quote  = quotes[quoteIndex];
        typingEl.textContent = '';
        authorEl.textContent = '';
        let i = 0;
        function type() {
            if (i < quote.length) {
                typingEl.textContent += quote[i++];
                setTimeout(type, 45);
            } else {
                authorEl.textContent = `— ${authors[quoteIndex]}`;
                setTimeout(() => {
                    quoteIndex = (quoteIndex + 1) % quotes.length;
                    typeQuote();
                }, 3500);
            }
        }
        type();
    }
    typeQuote();

    // ── Scroll Reveal (Timeline only now) ──
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
    );
    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

    // ── PHOTO ALBUM ──
    const pages    = Array.from(document.querySelectorAll('.book-page'));
    const prevBtn  = document.getElementById('album-prev');
    const nextBtn  = document.getElementById('album-next');
    const counter  = document.getElementById('album-counter');
    const total    = pages.length; // cover + 6 photos + back = 8
    let current    = 0; // 0 = cover visible, 1 = page1 flipped, etc.

    // Set initial z-indexes so cover is on top
    function setZIndexes() {
        pages.forEach((p, i) => {
            // Pages not yet flipped sit on top in reverse order
            // Pages already flipped sit below
            if (i < current) {
                p.style.zIndex = i + 1;
            } else {
                p.style.zIndex = total - i;
            }
        });
    }

    function updateCounter() {
        if (current === 0)          counter.textContent = 'Cover';
        else if (current === total) counter.textContent = 'The End';
        else                        counter.textContent = `Page ${current} / ${total - 1}`;
    }

    function updateButtons() {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total;
    }

    function goNext() {
        if (current >= total) return;
        pages[current].classList.add('flipped');
        current++;
        setZIndexes();
        updateCounter();
        updateButtons();
    }

    function goPrev() {
        if (current <= 0) return;
        current--;
        pages[current].classList.remove('flipped');
        setZIndexes();
        updateCounter();
        updateButtons();
    }

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    // Tap on book also goes next
    document.getElementById('album-book').addEventListener('click', goNext);

    // Swipe support for mobile
    let touchStartX = 0;
    document.getElementById('album-book').addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.getElementById('album-book').addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (dx < -40) goNext();
        else if (dx > 40) goPrev();
    }, { passive: true });

    // Init
    setZIndexes();
    updateCounter();
    updateButtons();

    // ── Hero Parallax ──
    const heroTitle = document.querySelector('.hero-title');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth  / 2 - e.pageX) / 30;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
        heroTitle.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        heroTitle.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    // ── Surprise & Confetti ──
    const surpriseBtn     = document.getElementById('surprise-btn');
    const surpriseOverlay = document.getElementById('surprise-overlay');
    const closeOverlay    = document.querySelector('.close-overlay');
    const canvas          = document.getElementById('confetti-canvas');
    const ctx             = canvas.getContext('2d');
    let confettiParticles = [];

    surpriseBtn.addEventListener('click', () => {
        surpriseOverlay.classList.add('visible');
        if (!isPlaying) { bgMusic.play(); isPlaying = true; musicIcon.classList.add('fa-spin'); }
        startConfetti();
    });

    closeOverlay.addEventListener('click', () => surpriseOverlay.classList.remove('visible'));

    surpriseOverlay.addEventListener('click', (e) => {
        if (e.target === surpriseOverlay) surpriseOverlay.classList.remove('visible');
    });

    function startConfetti() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        confettiParticles = Array.from({ length: 180 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 9 + 4,
            color: `hsl(${Math.random() * 60 + 320}, 80%, 65%)`,
            speed: Math.random() * 3 + 1.5,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            shape: Math.random() > 0.5 ? 'circle' : 'rect'
        }));
        updateConfetti();
    }

    function updateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 1.5;
            p.angle += p.spin;
            if (p.y > canvas.height) p.y = -20;
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            }
            ctx.restore();
        });
        if (surpriseOverlay.classList.contains('visible')) requestAnimationFrame(updateConfetti);
    }
});
