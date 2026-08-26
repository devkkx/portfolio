# Premium Java Full Stack & Software Engineering Portfolio

A premium, modern, and highly professional multi-page portfolio website for **Kshirod Kumar Sahoo**, Software Engineer and Java Full Stack Developer. Built to showcase backend engineering prowess, radar signal mathematics, and full-stack architecture paradigms to recruiters and technical evaluators.

---

## Technical Stack & Architecture

This application is designed as a modular static frontend structure that easily integrates with a backend router or API server:

* **Core Structure**: Semantic HTML5 & Vanilla ES6+ JavaScript.
* **Styling Layer**: Modern CSS3 using HSL custom variables for unified dark/light themes. Includes dynamic backdrop filters (glassmorphism), keyframe micro-animations, and viewport scroll tracking.
* **Interactions Canvas**: Optimized double-buffered 2D canvas loops utilizing `requestAnimationFrame` for interactive particle networks and real-time radar Plan Position Indicator (PPI) sweeps.
* **Accessibility (a11y)**: Built with screen reader semantic containers, accessible button attributes (`aria-expanded`, `aria-label`), keyboard-navigable links, and contrasting text values meeting WCAG AA requirements.
* **SEO Optimization**: Unique meta headings, description tags, and open-graph schemas configured for search engine crawling.

---

## Directory Structure

```text
/portfolio
│
├── index.html                  # Home page / Hero & Highlights
├── about.html                  # Profile narrative & Developer Journey
├── skills.html                 # Technical skills context-of-use grid
├── experience.html             # Detailed work timeline & certifications
├── projects.html               # Project Showcase catalog
├── education.html              # Academic milestones & grades
├── contact.html                # Contact links & validated feedback form
├── 404.html                    # Custom shell terminal 404 page
│
├── projects/
│   ├── vartalaap.html          # VartAlaap detailed project documentation & SVG diagram
│   └── radar-tracker.html      # Radar Data Tracker documentation & live Canvas sweep
│
├── css/
│   ├── style.css               # Core styling tokens, layouts, colors, theme states
│   ├── responsive.css          # Device breakpoints & collapsible mobile sidebar
│   └── animations.css          # Custom floaters, radar blinks, typing cursor keyframes
│
├── js/
│   ├── main.js                 # Global loading manager, theme toggles, mobile triggers
│   ├── animations.js           # Canvas background network & typing rotations logic
│   └── projects.js             # Radar simulation and VartAlaap demo controls
│
└── assets/
    ├── images/                 # Placeholder images / Screenshots
    ├── icons/                  # SVG graphical components
    └── certificates/           # Academic credential images
```

---

## Interactive Engineering Features

### 1. Developer Terminal Loader
Upon first launch, a monospace console loader simulates initialization steps (`SYSTEM OK`, `PORTFOLIO RUNNING`).
* *Optimization*: Once loaded, this state is recorded in `sessionStorage` to prevent wait delays during page-to-page navigation within the same session.

### 2. Canvas Node Network
An interactive canvas particle system draws dynamic nodes and lines that react to cursor movement. The particle density is dynamically capped to keep layout drawing efficient and avoid CPU lag.

### 3. VartAlaap SVG Architecture Flow
Under `projects/vartalaap.html`, clicking different chat channels dynamically triggers WebSocket routing visual updates across SVG node elements, explaining the client-server message flow.

### 4. Interactive Radar PPI Sweep Simulation
Under `projects/radar-tracker.html`, a green radial sweep is rendered inside a canvas block:
* Concentric range rings and bearing ticks.
* Target dots are smoothed and mapped with heading vectors based on simulated Kalman kinematics.
* Clicking on the scope injects new moving targets in real-time.
* Toggle buttons can filter target paths (simulating Kalman state estimations) or inject noise.

---

## Getting Started

### Local Setup
Since the website is modular, you can open and run it locally without dependencies:
1. Clone or download this project folder.
2. Double-click `index.html` to open it in a web browser, or use a local development server.

### Local Dev Server (Recommended)
To run with hot-reload or serve over a local address, you can use `http-server` or `Live Server` in VS Code:
```bash
# Install static server globally
npm install -g http-server

# Run from portfolio directory
cd portfolio
http-server -p 8080
```
Then navigate to `http://localhost:8080` in your browser.
