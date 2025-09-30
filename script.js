'use strict';

// Conscious Network - Immersive Experience Controller
class ConsciousNetwork {
  constructor() {
    this.currentCorridor = 0;
    this.totalCorridors = 3;
    this.isAnimating = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cursorTarget = { x: 0, y: 0 };
    
    this.initializeSystem();
  }

  initializeSystem() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      duration: this.reducedMotion ? 0.01 : 0.8,
      ease: "power2.out"
    });

    // Initialize components
    this.initializeCustomCursor();
    this.initializeParticleSystem();
    this.initializeNavigation();
    this.initializeCinematicTransitions();
    this.initializeInteractions();
    
    // Start experience
    this.activateHeroSequence();
  }

  // Custom Cursor System
  initializeCustomCursor() {
    if (window.innerWidth < 768 || this.reducedMotion) return;
    
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.cursorTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.cursorTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Update particle system cursor target
      if (window.particleSystem) {
        window.particleSystem.updateCursor(this.cursorTarget.x, this.cursorTarget.y);
      }
    });

    // Cursor states for different elements
    document.querySelectorAll('button, .project-card, .glass-panel').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('expand');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand');
      });
    });

    document.querySelectorAll('.tech-tag, .timeline-node').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('contract');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('contract');
      });
    });

    // Smooth cursor animation
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY
      });

      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  // Three.js Particle System
  initializeParticleSystem() {
    if (!window.THREE || this.reducedMotion) return;

    const canvas = document.getElementById('particle-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system
    const particleCount = window.innerWidth < 768 ? 400 : 1200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Network constellation formation
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      // Consciousness green with variation
      colors[i3] = 0.0 + Math.random() * 0.2;     // R
      colors[i3 + 1] = 1.0;                       // G
      colors[i3 + 2] = 0.62 + Math.random() * 0.2; // B

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material for performance
    const vertexShader = `
      attribute vec3 velocity;
      attribute vec3 color;
      attribute float size;
      
      uniform float uTime;
      uniform vec2 uCursor;
      uniform float uCursorInfluence;
      
      varying vec3 vColor;
      varying float vDistance;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        
        // Ambient drift
        pos.x += sin(uTime * 0.5 + position.y * 2.0) * 0.3;
        pos.y += cos(uTime * 0.3 + position.x * 1.5) * 0.3;
        
        // Cursor magnetism
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vec2 screenPos = mvPosition.xy / mvPosition.w;
        vec2 toCursor = uCursor - screenPos;
        float distance = length(toCursor);
        vDistance = distance;
        
        if (distance < uCursorInfluence) {
          float strength = 1.0 - (distance / uCursorInfluence);
          strength = pow(strength, 2.0);
          pos.xy += toCursor * strength * 0.8;
        }
        
        vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
        
        gl_PointSize = size * (300.0 / -modelViewPosition.z);
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDistance;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        float brightness = 1.0 - (vDistance * 0.3);
        brightness = clamp(brightness, 0.4, 1.0);
        
        gl_FragColor = vec4(vColor * brightness, alpha * 0.8);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uCursorInfluence: { value: 0.3 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      material.uniforms.uTime.value = time;
      
      // Smooth cursor interpolation
      material.uniforms.uCursor.value.lerp(
        new THREE.Vector2(this.cursorTarget.x, this.cursorTarget.y), 
        0.1
      );
      
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

    // Expose particle system
    window.particleSystem = {
      updateCursor: (x, y) => {
        this.cursorTarget.x = x;
        this.cursorTarget.y = y;
      },
      triggerBurst: (x, y) => {
        material.uniforms.uCursorInfluence.value = 0.6;
        setTimeout(() => {
          material.uniforms.uCursorInfluence.value = 0.3;
        }, 800);
      },
      changeTheme: (corridorIndex) => {
        const colors = particles.geometry.attributes.color.array;
        const targetColor = corridorIndex === 0 ? [0, 1, 0.62] : 
                            corridorIndex === 1 ? [1, 0.2, 0.4] : 
                            [0.4, 0.8, 1];
        
        for (let i = 0; i < particleCount; i++) {
          colors[i * 3] = THREE.MathUtils.lerp(colors[i * 3], targetColor[0], 0.1);
          colors[i * 3 + 1] = THREE.MathUtils.lerp(colors[i * 3 + 1], targetColor[1], 0.1);
          colors[i * 3 + 2] = THREE.MathUtils.lerp(colors[i * 3 + 2], targetColor[2], 0.1);
        }
        particles.geometry.attributes.color.needsUpdate = true;
      }
    };
  }

  // Navigation System
  initializeNavigation() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const progressBar = document.querySelector('.timeline-progress');

    timelineNodes.forEach((node, index) => {
      node.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.navigateToCorridor(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      
      if (e.key === 'ArrowRight' && this.currentCorridor < this.totalCorridors - 1) {
        this.navigateToCorridor(this.currentCorridor + 1);
      } else if (e.key === 'ArrowLeft' && this.currentCorridor > 0) {
        this.navigateToCorridor(this.currentCorridor - 1);
      } else if (e.key === ' ' && !this.reducedMotion) {
        e.preventDefault();
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(this.cursorTarget.x, this.cursorTarget.y);
        }
      }
    });

    this.updateNavigation();
  }

  navigateToCorridor(corridorIndex) {
    if (corridorIndex === this.currentCorridor || this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentCorridor = corridorIndex;
    
    const corridor = document.querySelector('.corridor-container');
    const translateX = -corridorIndex * 100;
    
    gsap.to(corridor, {
      x: `${translateX}vw`,
      duration: this.reducedMotion ? 0.01 : 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        this.isAnimating = false;
        this.activateCorridorAnimations(corridorIndex);
      }
    });

    // Update particle theme
    if (window.particleSystem) {
      window.particleSystem.changeTheme(corridorIndex);
    }

    this.updateNavigation();
    this.updateProgress();
  }

  updateNavigation() {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    timelineNodes.forEach((node, index) => {
      node.classList.toggle('active', index === this.currentCorridor);
    });
  }

  updateProgress() {
    const progressBar = document.querySelector('.timeline-progress');
    const progress = ((this.currentCorridor + 1) / this.totalCorridors) * 100;
    
    gsap.to(progressBar, {
      height: `${progress}%`,
      duration: 0.6,
      ease: "power2.out"
    });
  }

  // Cinematic Transitions
  initializeCinematicTransitions() {
    if (this.reducedMotion) return;

    // Set initial states
    gsap.set('.hero__title', { opacity: 0, y: 60 });
    gsap.set('.hero__subtitle', { opacity: 0, y: 30 });
    gsap.set('.hero__stats', { opacity: 0, scale: 0.9 });
    gsap.set('.chapter-meta', { opacity: 0, x: -30 });
  }

  activateHeroSequence() {
    if (this.reducedMotion) {
      gsap.set('.hero__title, .hero__subtitle, .hero__stats, .chapter-meta', {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.to('.hero__title', {
      opacity: 1,
      y: 0,
      duration: 1.4,
      delay: 0.3
    })
    .to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 1.0
    }, '-=0.8')
    .to('.hero__stats', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1
    }, '-=0.6')
    .to('.chapter-meta', {
      opacity: 1,
      x: 0,
      duration: 0.6
    }, '-=0.4');
  }

  activateCorridorAnimations(corridorIndex) {
    if (this.reducedMotion) return;

    const corridor = document.querySelector(`[data-index="${corridorIndex}"]`);
    const cards = corridor.querySelectorAll('.glass-panel, .project-card');
    
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { 
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15
        }
      );
    }
  }

  // Interactive Behaviors
  initializeInteractions() {
    // Project card hover effects
    document.querySelectorAll('.project-card, .glass-panel').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        if (this.reducedMotion) return;
        
        const rect = card.getBoundingClientRect();
        const centerX = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
        const centerY = -((rect.top + rect.height / 2) / window.innerHeight * 2 - 1);
        
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(centerX, centerY);
        }
        
        gsap.to(card, {
          y: -8,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        if (this.reducedMotion) return;
        
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });

    // Tech tag interactions
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const network = new ConsciousNetwork();
  
  // Performance monitoring
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
});

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
