// Interactive Animations for Portfolio (Canvas background, Typing effect, Scroll reveals)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Interactive Canvas Particle Network Background
    initCanvasParticles();

    // 2. Initialize Hero Text Typing Rotator
    initTextRotator();

    // 3. Initialize Scroll Fade-In Intersection Observer
    initScrollReveal();
});

// Canvas Particle Network Background
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Responsive sizing
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        createParticles();
    });

    // Capture mouse positions
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object Structure
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4; // slow speeds
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            // Bounce off boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.x += this.vx;
            this.y += this.vy;

            // Interact with mouse position
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Mild attraction to mouse cursor representing connection/flow
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            const themeIsLight = document.body.classList.contains('light-theme');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = themeIsLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(56, 189, 248, 0.45)';
            ctx.fill();
        }
    }

    // Set particle density based on screen dimensions
    function createParticles() {
        particles = [];
        const particleCount = Math.floor((width * height) / 22000); // capped density
        const cappedCount = Math.min(Math.max(particleCount, 40), 90); // safe bounds
        
        for (let i = 0; i < cappedCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw links between nearby particles
    function connectParticles() {
        const themeIsLight = document.body.classList.contains('light-theme');
        const maxDist = 120;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    // Alpha opacity proportional to proximity
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = themeIsLight 
                        ? `rgba(2, 132, 199, ${opacity})` 
                        : `rgba(56, 189, 248, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

// Hero Rotator Typewriter Logic
function initTextRotator() {
    const roleSpan = document.getElementById('role-rotator');
    if (!roleSpan) return;

    const roles = JSON.parse(roleSpan.getAttribute('data-roles') || '[]');
    if (roles.length === 0) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster erase
        } else {
            roleSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing
        }

        // Handle states
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400; // pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter loop after loading animation ends
    setTimeout(type, 3000);
}

// Scroll Reveal observer
function initScrollReveal() {
    const sections = document.querySelectorAll('.fade-in-section');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // stop observing once element is visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}
