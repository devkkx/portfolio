// Project Specific Interactions (Filters, Chat Mockups, Radar Canvas Sweep)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Projects Filter Logic (on projects.html)
    initProjectFilters();

    // 2. Interactive VartAlaap Chat Mockup Logic (on vartalaap.html)
    initVartAlaapMock();

    // 3. Interactive Radar PPI Sweep Simulation (on radar-tracker.html)
    initRadarSimulation();
});

// 1. Project Category Filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat.includes(category)) {
                    card.style.display = 'block';
                    // subtle fade-in transition
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 2. Interactive VartAlaap Live Demo Flow
function initVartAlaapMock() {
    const modeButtons = document.querySelectorAll('.vartalaap-mode-btn');
    const mockDisplay = document.getElementById('vartalaap-mock-display');
    const archNodes = document.querySelectorAll('.arch-node');

    if (!mockDisplay) return;

    // Data for different mockup modes
    const modeData = {
        work: {
            title: "Work Channel Active",
            chat: `[Client-1]: Pull request #42 compiled successfully.<br>
                   [Manager]: Excellent! Let's deploy to staging server.<br>
                   <span class="system-msg">[WebSocket] Broadcast sent to 5 subscribers.</span>`,
            node: "spring-boot"
        },
        personal: {
            title: "Personal Chat Active",
            chat: `[Kshirod]: Hey! Are we meeting up for the hackathon prep?<br>
                   [Friend]: Yes, I'm online. Let's start coding in 10 minutes.<br>
                   <span class="system-msg">[WebSocket] Message latency: 12ms.</span>`,
            node: "websocket-conn"
        },
        study: {
            title: "Study Group Active",
            chat: `[Student-A]: Does anyone have notes on Kalman Filtering?<br>
                   [Student-B]: Check the Radar project documentation. It's detailed.<br>
                   <span class="system-msg">[WebSocket] Shared document loaded.</span>`,
            node: "database"
        },
        ai: {
            title: "AI Co-pilot Active",
            chat: `[Kshirod]: Generate a Spring Boot configuration snippet.<br>
                   [VartAlaap AI]: Here is your configuration: @SpringBootApplication...<br>
                   <span class="system-msg">[AI Integration] Response generated in 420ms.</span>`,
            node: "ai-engine"
        }
    };

    // Mode buttons click listener
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active style
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.getAttribute('data-mode');
            const data = modeData[mode];

            if (data) {
                // Update terminal text
                mockDisplay.querySelector('.mock-channel-title').textContent = data.title;
                mockDisplay.querySelector('.mock-chat-window').innerHTML = data.chat;

                // Highlight corresponding node in SVG diagram
                archNodes.forEach(node => {
                    node.classList.remove('highlight');
                    if (node.getAttribute('id') === data.node) {
                        node.classList.add('highlight');
                    }
                });
            }
        });
    });
}

// 3. Interactive Radar PPI Canvas Sweep Simulation
function initRadarSimulation() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = 500);
    let height = (canvas.height = 500);
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = width / 2 - 20;

    let sweepAngle = 0;
    const sweepSpeed = 0.015; // Sweep speed rads/frame
    
    // Core radar state objects: targets
    // Each target: x, y in polar (radius, angle), lifetime, history, velocity, label
    let targets = [
        { r: maxRadius * 0.4, theta: 0.5, size: 4, label: "TGT-01", history: [], vr: -0.2, vtheta: 0.002 },
        { r: maxRadius * 0.7, theta: 2.1, size: 5, label: "TGT-02", history: [], vr: 0.1, vtheta: -0.001 },
        { r: maxRadius * 0.85, theta: 4.5, size: 4, label: "TGT-03", history: [], vr: -0.4, vtheta: 0.003 }
    ];

    let noiseEnabled = true;
    let trackFilter = "kalman"; // kalman vs raw

    // User Interaction: click radar to inject target
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Convert cartesian mouse coordinate back to polar relative to center
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const r = Math.hypot(dx, dy);

        if (r < maxRadius) {
            let theta = Math.atan2(dy, dx);
            if (theta < 0) theta += Math.PI * 2;

            // Generate random speed and direction
            const vr = (Math.random() - 0.5) * 0.6;
            const vtheta = (Math.random() - 0.5) * 0.004;
            const targetId = `INJ-${Math.floor(Math.random() * 90 + 10)}`;

            targets.push({
                r: r,
                theta: theta,
                size: 5,
                label: targetId,
                history: [],
                vr: vr,
                vtheta: vtheta,
                alpha: 0 // hidden until sweep hits
            });

            // Log target insertion in UI status box if exists
            logRadarEvent(`Target ${targetId} injected at R:${Math.round(r)}px \u03B8:${Math.round(theta * 57.3)}°`);
        }
    });

    // Control buttons hooks
    const btnNoise = document.getElementById('radar-toggle-noise');
    if (btnNoise) {
        btnNoise.addEventListener('click', () => {
            noiseEnabled = !noiseEnabled;
            btnNoise.classList.toggle('btn-primary');
            btnNoise.classList.toggle('btn-secondary');
            logRadarEvent(noiseEnabled ? "Adaptive Noise Floor: OFF (Raw Video mode)" : "Adaptive Noise Floor: ON (CFAR Thresholding Active)");
        });
    }

    const btnFilter = document.getElementById('radar-toggle-filter');
    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            trackFilter = trackFilter === 'kalman' ? 'raw' : 'kalman';
            btnFilter.textContent = trackFilter === 'kalman' ? "Tracking Mode: Kalman Filter" : "Tracking Mode: Raw Detections";
            logRadarEvent(trackFilter === 'kalman' ? "Kalman state estimator covariance initialized." : "Displaying un-smoothed measurements.");
        });
    }

    function logRadarEvent(text) {
        const consoleEl = document.getElementById('radar-event-log');
        if (!consoleEl) return;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        consoleEl.innerHTML = `[${time}] ${text}<br>` + consoleEl.innerHTML;
    }

    // Main Draw functions
    function drawRadarGrid() {
        const themeIsLight = document.body.classList.contains('light-theme');
        const gridColor = themeIsLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(74, 222, 128, 0.1)';
        const textColor = themeIsLight ? '#0f172a' : '#4ade80';

        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        ctx.font = '9px Fira Code, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Range rings
        for (let i = 1; i <= 4; i++) {
            const r = (maxRadius / 4) * i;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
            // Range marker text
            ctx.fillText(`${i * 25}%`, cx + 15, cy - r - 5);
        }

        // Bearing crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxRadius, cy);
        ctx.lineTo(cx + maxRadius, cy);
        ctx.moveTo(cx, cy - maxRadius);
        ctx.lineTo(cx, cy + maxRadius);
        ctx.stroke();

        // Degrees marks around edge
        for (let angle = 0; angle < 360; angle += 30) {
            const rad = (angle * Math.PI) / 180;
            const x = cx + maxRadius * Math.cos(rad);
            const y = cy + maxRadius * Math.sin(rad);
            
            ctx.fillText(`${angle}°`, cx + (maxRadius + 12) * Math.cos(rad), cy + (maxRadius + 12) * Math.sin(rad));
        }
    }

    function drawNoise() {
        if (!noiseEnabled) return;
        ctx.fillStyle = 'rgba(74, 222, 128, 0.035)';
        for (let i = 0; i < 40; i++) {
            const r = Math.random() * maxRadius;
            const theta = Math.random() * Math.PI * 2;
            const nx = cx + r * Math.cos(theta);
            const ny = cy + r * Math.sin(theta);
            ctx.fillRect(nx, ny, 1, 1);
        }
    }

    function updateAndDrawTargets() {
        const themeIsLight = document.body.classList.contains('light-theme');
        const targetColor = themeIsLight ? '#16a34a' : '#4ade80';
        const rawColor = '#ef4444';

        targets.forEach(t => {
            // Update physics kinematics
            t.r += t.vr;
            t.theta = (t.theta + t.vtheta) % (Math.PI * 2);
            if (t.theta < 0) t.theta += Math.PI * 2;

            // Bounce targets off radar edges
            if (t.r > maxRadius || t.r < 10) {
                t.vr *= -1;
            }

            // Detect if sweep line passes target angle
            // SweepAngle is current angle, check if target falls in sweep beam width
            const angleDiff = Math.abs(t.theta - sweepAngle);
            const relativeDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
            
            if (relativeDiff < 0.02) {
                t.alpha = 1.0; // Flash full bright
                
                // Add current location to target track history
                t.history.push({ x: t.r * Math.cos(t.theta), y: t.r * Math.sin(t.theta), timestamp: Date.now() });
                if (t.history.length > 5) t.history.shift();
            } else {
                // Slowly decay brightness of target display
                t.alpha = Math.max(t.alpha - 0.003, 0);
            }

            if (t.alpha > 0) {
                // Cartesian coordinates
                const tx = cx + t.r * Math.cos(t.theta);
                const ty = cy + t.r * Math.sin(t.theta);

                // Render history trail (dots connecting)
                if (trackFilter === "kalman") {
                    ctx.strokeStyle = `rgba(74, 222, 128, ${t.alpha * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    t.history.forEach((pt, idx) => {
                        const hx = cx + pt.x;
                        const hy = cy + pt.y;
                        if (idx === 0) ctx.moveTo(hx, hy);
                        else ctx.lineTo(hx, hy);
                    });
                    ctx.stroke();
                }

                // Main Target Plot symbol
                ctx.fillStyle = trackFilter === "kalman" 
                    ? `rgba(74, 222, 128, ${t.alpha})` 
                    : `rgba(239, 68, 68, ${t.alpha})`;
                
                ctx.beginPath();
                if (trackFilter === "kalman") {
                    // Draw square/box for high-confidence tracked target
                    ctx.rect(tx - t.size/2, ty - t.size/2, t.size, t.size);
                } else {
                    // Raw measurements: circles/crosses representing unprocessed signals
                    ctx.arc(tx, ty, t.size - 1, 0, Math.PI * 2);
                }
                ctx.fill();

                // Vector heading line (predicted state vector from velocity covariance)
                if (trackFilter === "kalman" && t.history.length > 1) {
                    ctx.strokeStyle = `rgba(74, 222, 128, ${t.alpha * 0.7})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    // project motion vector forward
                    const vectorScale = 40;
                    const vx = (t.vr * Math.cos(t.theta) - t.r * t.vtheta * Math.sin(t.theta)) * vectorScale;
                    const vy = (t.vr * Math.sin(t.theta) + t.r * t.vtheta * Math.cos(t.theta)) * vectorScale;
                    ctx.lineTo(tx + vx, ty + vy);
                    ctx.stroke();
                }

                // Target label tag text
                ctx.fillStyle = `rgba(74, 222, 128, ${t.alpha * 0.85})`;
                ctx.font = '8px Fira Code, monospace';
                ctx.fillText(t.label, tx + 10, ty - 5);
            }
        });
    }

    function drawSweepLine() {
        const themeIsLight = document.body.classList.contains('light-theme');
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweepAngle);

        // Sweep fade gradient beam
        const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, maxRadius);
        if (themeIsLight) {
            sweepGrad.addColorStop(0, 'rgba(2, 132, 199, 0.15)');
            sweepGrad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');
        } else {
            sweepGrad.addColorStop(0, 'rgba(74, 222, 128, 0.2)');
            sweepGrad.addColorStop(1, 'rgba(74, 222, 128, 0.0)');
        }

        // Draw sweep wedge
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Sweep wedge represents ~6 degrees width
        ctx.arc(0, 0, maxRadius, -0.1, 0);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Direct sharp line at heading front
        ctx.strokeStyle = themeIsLight ? 'rgba(2, 132, 199, 0.6)' : 'rgba(74, 222, 128, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxRadius, 0);
        ctx.stroke();

        ctx.restore();

        // Increment rotation
        sweepAngle = (sweepAngle + sweepSpeed) % (Math.PI * 2);
    }

    // Animation Loop
    function runRadarLoop() {
        ctx.clearRect(0, 0, width, height);

        // Black screen representing oscilloscope tube background
        const themeIsLight = document.body.classList.contains('light-theme');
        ctx.fillStyle = themeIsLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(3, 7, 18, 0.85)';
        ctx.fillRect(0, 0, width, height);

        // Draw circles & crosshairs
        drawRadarGrid();

        // Draw random background targets/noise returns
        drawNoise();

        // Sweep line drawing
        drawSweepLine();

        // Update target positions, checking sweep collisions, displaying returns
        updateAndDrawTargets();

        requestAnimationFrame(runRadarLoop);
    }

    runRadarLoop();
}
