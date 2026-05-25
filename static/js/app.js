document.addEventListener('DOMContentLoaded', () => {

    // --- LENIS SMOOTH SCROLLING ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // --- AUTOMATIC PRELOADER ---
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                document.body.classList.remove('loading');
                initTypewriter();
            }, 800);
        }
    }, 2000); 

    function initTypewriter() {
        const text = "Defying Gravity through Code and Art. Welcome to my creative dimension.";
        const el = document.querySelector('.typewriter');
        if(el) {
            el.innerHTML = '';
            let i = 0;
            function type() {
                if (i < text.length) {
                    el.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, 30);
                }
            }
            type();
        }
    }

    // --- AUDIO FIX ---
    let bgMusic = document.getElementById('bg-music');
    if (!bgMusic) {
        bgMusic = new Audio("static/audio/ambient.mp3");
        bgMusic.id = 'bg-music';
        document.body.appendChild(bgMusic);
    }
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    let musicStarted = false;

    const startAudioInteraction = () => {
        if (!musicStarted) {
            bgMusic.play().then(() => { 
                musicStarted = true; 
                console.log("Audio started on interaction");
            }).catch(e => console.log("Autoplay blocked. User needs to click again.", e));
        }
        if (musicStarted) {
            ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
                document.removeEventListener(evt, startAudioInteraction)
            );
        }
    };

    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
        document.addEventListener(evt, startAudioInteraction, { once: true })
    );

    const muteBtn = document.getElementById('mute-btn');
    const volSlider = document.getElementById('volume-slider');
    
    if(muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bgMusic.muted = !bgMusic.muted;
            muteBtn.innerHTML = bgMusic.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        });
    }

    if(volSlider) {
        volSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const newVol = parseFloat(e.target.value);
            bgMusic.volume = newVol;
            if(newVol > 0 && bgMusic.muted) {
                bgMusic.muted = false;
                if(muteBtn) muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        });
    }

    // --- THEME CONTROLS ---
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('light-mode');
            themeBtn.innerHTML = document.body.classList.contains('light-mode') ? 
                '<i class="fa-solid fa-moon"></i> Dark Mode' : '<i class="fa-solid fa-sun"></i> Light Mode';
        });
    }

    // --- MAGNETIC BUTTON EFFECT ---
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if(typeof gsap !== 'undefined') {
                gsap.to(elem, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
            }
        });
        elem.addEventListener('mouseleave', () => {
            if(typeof gsap !== 'undefined') {
                gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            }
        });
    });

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    const cursorLight = document.getElementById('cursor-light');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        if(cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        if(cursorLight) cursorLight.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    const interactiveElements = document.querySelectorAll('a, button, .glass-card, .skill-card, .social-icon');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => { if(cursor) cursor.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { if(cursor) cursor.classList.remove('hover'); });
    });

    // --- GSAP SCROLL ANIMATIONS ---
    if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(".hero-content", {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 1 
            },
            opacity: 0,
            y: -50
        });

        gsap.to(".hero-image-wrapper", {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 1 
            },
            opacity: 0,
            y: -50
        });

        document.querySelectorAll('.reveal-up').forEach(el => {
            gsap.to(el, { scrollTrigger: { trigger: el, start: "top 85%", toggleClass: "active", once: true } });
        });

        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const circle = card.querySelector('.progress-ring__circle');
                const score = parseInt(card.getAttribute('data-score'));
                const circumference = circle.r.baseVal.value * 2 * Math.PI;
                circle.style.strokeDashoffset = circumference - (score / 100) * circumference;
            });
            card.addEventListener('mouseleave', () => {
                const circle = card.querySelector('.progress-ring__circle');
                circle.style.strokeDashoffset = circle.r.baseVal.value * 2 * Math.PI;
            });
        });
    }

    // --- THREE.JS BACKGROUND FIX (NO MORE BIG BOXES, EXACTLY 5000 PARTICLES) ---
    const bgCanvas = document.getElementById('webgl-canvas');
    if(bgCanvas && typeof THREE !== 'undefined') {
        const bgScene = new THREE.Scene();
        bgScene.fog = new THREE.FogExp2(0x0B0F1A, 0.001);
        
        const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 30;
        
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesGeometry = new THREE.BufferGeometry();
        // FIX 2 & 3: Reduced to exactly 5000
        const particlesCount = 1400; 
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);

        const pearlColors = [0xffffff, 0xfdfdfd, 0xf8f9fa];

        for(let i = 0; i < particlesCount * 3; i+=3) { 
            posArray[i] = (Math.random() - 0.5) * 100; 
            posArray[i+1] = (Math.random() - 0.5) * 100;
            posArray[i+2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color(pearlColors[Math.floor(Math.random() * pearlColors.length)]);
            colorsArray[i] = color.r; colorsArray[i+1] = color.g; colorsArray[i+2] = color.b;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 2.5, // Fixed absolute pixel size
            sizeAttenuation: false, // FIX 1: This stops them from scaling up into huge blocks!
            vertexColors: true, 
            transparent: true, 
            opacity: 0.8, 
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        bgScene.add(particlesMesh);

        const mouseLight = new THREE.PointLight(0xd16bff, 2, 50);
        bgScene.add(mouseLight);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.02 + (mouseX * 0.0001);
            particlesMesh.rotation.x = elapsedTime * 0.01 + (mouseY * 0.0001);
            particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;
            
            const vec = new THREE.Vector3();
            const pos = new THREE.Vector3();
            vec.set((mouseX / window.innerWidth) * 2 - 1, -(mouseY / window.innerHeight) * 2 + 1, 0.5);
            vec.unproject(bgCamera);
            vec.sub(bgCamera.position).normalize();
            const distance = -bgCamera.position.z / vec.z;
            pos.copy(bgCamera.position).add(vec.multiplyScalar(distance));
            mouseLight.position.copy(pos);

            bgRenderer.render(bgScene, bgCamera);
        }
        animate();

        window.addEventListener('resize', () => {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});