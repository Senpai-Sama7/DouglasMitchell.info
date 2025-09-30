'use strict';

// Conscious Network Hub - Immersive Experience Controller
class ConsciousNetworkHub {
  constructor() {
    this.currentChamber = 0;
    this.totalChambers = 5;
    this.isAnimating = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.initializeSystem();
  }

  initializeSystem() {
    // Initialize GSAP with performance settings
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      duration: this.reducedMotion ? 0.01 : 0.8,
      ease: "power2.out"
    });

    // Initialize components
    this.initializeCursor();
    this.initializeNavigation();
    this.initializePixelConstellation();
    this.initializeCinematicTransitions();
    this.initializeInteractions();
    
    // Start the experience
    this.activateConsciousness();
  }

  // Custom Cursor System
  initializeCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.querySelector('.cursor-magnetic');
    const trail = document.querySelector('.cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Magnetic attraction to interactive elements
    document.querySelectorAll('button, .method-card, .mastery-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Smooth cursor animation
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      trailX += (mouseX - trailX) * 0.05;
      trailY += (mouseY - trailY) * 0.05;

      gsap.set(cursor, { x: cursorX, y: cursorY });
      gsap.set(trail, { x: trailX, y: trailY });

      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  // Radial Navigation System
  initializeNavigation() {
    const navNodes = document.querySelectorAll('.nav-node');
    const progressFill = document.querySelector('.progress-fill');

    navNodes.forEach((node, index) => {
      node.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.navigateToChamber(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      
      if (e.key === 'ArrowRight' && this.currentChamber < this.totalChambers - 1) {
        this.navigateToChamber(this.currentChamber + 1);
      } else if (e.key === 'ArrowLeft' && this.currentChamber > 0) {
        this.navigateToChamber(this.currentChamber - 1);
      }
    });

    this.updateNavigation();
  }

  navigateToChamber(chamberIndex) {
    if (chamberIndex === this.currentChamber || this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentChamber = chamberIndex;
    
    const corridor = document.querySelector('.corridor-container');
    const translateX = -chamberIndex * 100;
    
    gsap.to(corridor, {
      x: `${translateX}vw`,
      duration: this.reducedMotion ? 0.01 : 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        this.isAnimating = false;
        this.activateChamberAnimations(chamberIndex);
      }
    });

    this.updateNavigation();
    this.updateProgress();
  }

  updateNavigation() {
    const navNodes = document.querySelectorAll('.nav-node');
    navNodes.forEach((node, index) => {
      node.classList.toggle('active', index === this.currentChamber);
    });
  }

  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((this.currentChamber + 1) / this.totalChambers) * 100;
    
    gsap.to(progressFill, {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power2.out"
    });
  }

  // Pixel Constellation (Three.js)
  initializePixelConstellation() {
    if (!window.THREE || this.reducedMotion) return;

    const canvas = document.getElementById('constellation-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      alpha: true,
      antialias: window.devicePixelRatio < 2 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system
    const particlesCount = window.innerWidth < 768 ? 300 : 800;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Network constellation formation
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Electric blue to emerald gradient
      const mixFactor = Math.random();
      colors[i3] = mixFactor * 0.0 + (1 - mixFactor) * 0.06; // R
      colors[i3 + 1] = mixFactor * 0.83 + (1 - mixFactor) * 0.72; // G
      colors[i3 + 2] = mixFactor * 1.0 + (1 - mixFactor) * 0.51; // B

      sizes[i] = Math.random() * 2 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle rotation
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      
      // Mouse influence
      particles.rotation.x += mouseY * 0.0002;
      particles.rotation.y += mouseX * 0.0002;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Performance optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(animate);
      }
    });

    this.constellationRenderer = renderer;
    this.constellationScene = { scene, camera, particles };
  }

  // Cinematic Transitions
  initializeCinematicTransitions() {
    if (this.reducedMotion) return;

    // Set initial states
    gsap.set('.title-fragment', { y: '100%', opacity: 0 });
    gsap.set('.subtitle-line', { x: '-100%', opacity: 0 });
    gsap.set('.status-item', { scale: 0, opacity: 0 });
    gsap.set('.pixel-constellation', { opacity: 0, scale: 0.8 });
  }

  activateConsciousness() {
    if (this.reducedMotion) {
      // Immediate reveal for reduced motion
      gsap.set('.title-fragment, .subtitle-line, .status-item, .pixel-constellation', {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1
      });
      return;
    }

    const tl = gsap.timeline();
    
    // Consciousness title reveal
    tl.to('.title-fragment', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2
    })
    .to('.subtitle-line', {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1
    }, "-=0.6")
    .to('.pixel-constellation', {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: "power2.inOut"
    }, "-=1")
    .to('.status-item', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.8");
  }

  activateChamberAnimations(chamberIndex) {
    if (this.reducedMotion) return;

    const chamber = document.querySelector(`[data-chamber="${chamberIndex}"]`);
    const cards = chamber.querySelectorAll('.mastery-card, .justice-card, .method-card, .topology-card');
    
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { 
          y: 50, 
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        }
      );
    }
  }

  // Interactive Behaviors
  initializeInteractions() {
    // Card hover effects
    document.querySelectorAll('.mastery-card, .method-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (this.reducedMotion) return;
        
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        if (this.reducedMotion) return;
        
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // Status indicator animations
    document.querySelectorAll('.status-indicator, .pulse-dot').forEach(indicator => {
      if (!this.reducedMotion) {
        gsap.to(indicator, {
          scale: 1.2,
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    });

    // Tech tag hover effects
    document.querySelectorAll('.tech-tag').forEach(tag => {
      tag.addEventListener('mouseenter', () => {
        if (this.reducedMotion) return;
        
        gsap.to(tag, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out"
        });
      });

      tag.addEventListener('mouseleave', () => {
        if (this.reducedMotion) return;
        
        gsap.to(tag, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }

  // Performance monitoring
  initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const hub = new ConsciousNetworkHub();
  
  // Initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    hub.initializePerformanceMonitoring();
  }
});

// Handle system theme changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // The design is already dark-themed, but we could add light mode here
    console.log('System theme changed:', e.matches ? 'dark' : 'light');
  });
}

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
