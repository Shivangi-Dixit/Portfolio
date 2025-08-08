// Dynamic Network Background Animation
class NetworkBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.pointerEvents = 'none';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.resize();
    }

    createParticles() {
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe066'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.x -= dx * 0.001;
                particle.y -= dy * 0.001;
            }
        });

        // Draw connections
        this.drawConnections();

        // Draw particles
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    this.ctx.strokeStyle = `rgba(255, 107, 107, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        this.ctx.globalAlpha = 1;
    }
}

// Initialize network background
let networkBg;
window.addEventListener('load', () => {
    networkBg = new NetworkBackground();
});




// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Advanced intersection observer with stagger animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');

            // Stagger child animations
            const children = entry.target.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate-fadeInUp');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    observer.observe(section);

    // Prepare child elements for stagger animation
    const children = section.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat');
    children.forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
    });
});

// Animate skill tags on scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillTags = entry.target.querySelectorAll('.skill-tag');
            skillTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category').forEach(category => {
    const skillTags = category.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    skillObserver.observe(category);
});

// Animate project cards
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    projectObserver.observe(card);
});

// Enhanced typing effect with cursor
function createTypeWriter(element, text, speed = 100) {
    return new Promise((resolve) => {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }

        type();
    });
}

// Function to set the theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Function to toggle between dark and light modes
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);

    // Update icon states
    updateThemeIcons(newTheme);

    // Store theme preference
    localStorage.setItem('theme', newTheme);
}

function updateThemeIcons(theme) {
    const moonIcon = document.getElementById('hero-moon-icon');
    const sunIcon = document.getElementById('hero-sun-icon');

    if (moonIcon && sunIcon) {
        if (theme === 'light') {
            moonIcon.classList.remove('active');
            sunIcon.classList.add('active');
        } else {
            moonIcon.classList.add('active');
            sunIcon.classList.remove('active');
        }
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Initialize theme and enhanced typing animation sequence
window.addEventListener('load', () => {
    initializeTheme();

    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content h2');
    const heroDescription = document.querySelector('.hero-content p');

    // Add cursor effect
    const addCursor = (element) => {
        element.style.borderRight = '3px solid #6366f1';
        element.style.animation = 'blink 1s infinite';
    };

    const removeCursor = (element) => {
        element.style.borderRight = 'none';
        element.style.animation = 'none';
    };

    // Add CSS for cursor blink
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-right-color: transparent; }
            51%, 100% { border-right-color: #6366f1; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(async () => {
        addCursor(heroTitle);
        await createTypeWriter(heroTitle, 'Shivangi Dixit', 120);
        removeCursor(heroTitle);

        addCursor(heroSubtitle);
        await createTypeWriter(heroSubtitle, 'Senior Frontend & Full-Stack Developer', 60);
        removeCursor(heroSubtitle);

        // Animate description and buttons
        setTimeout(() => {
            heroDescription.classList.add('animate-fadeInUp');
            document.querySelector('.hero-buttons').classList.add('animate-fadeInUp');
            document.querySelector('.social-links').classList.add('animate-fadeInUp');
        }, 500);
    }, 1000);
});

// Mouse repulsion effect for floating shapes
let mouseX = 0;
let mouseY = 0;

function initMouseRepulsion() {
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        floatingShapes.forEach(shape => {
            const rect = shape.getBoundingClientRect();
            const shapeCenterX = rect.left + rect.width / 2;
            const shapeCenterY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to shape
            const deltaX = mouseX - shapeCenterX;
            const deltaY = mouseY - shapeCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Repulsion radius (shapes will move away when mouse is within this distance)
            const repulsionRadius = 150;
            
            if (distance < repulsionRadius && distance > 0) {
                // Calculate repulsion force (stronger when closer)
                const force = (repulsionRadius - distance) / repulsionRadius;
                const repulsionStrength = 80; // Pixels to push away
                
                // Calculate direction away from mouse
                const pushX = -(deltaX / distance) * force * repulsionStrength;
                const pushY = -(deltaY / distance) * force * repulsionStrength;
                
                // Apply transform to move shape away
                shape.style.transform = `translate(${pushX}px, ${pushY}px) scale(${1 + force * 0.3})`;
                shape.style.opacity = Math.min(1, 0.6 + force * 0.4);
            } else {
                // Reset to original position when mouse is far away
                shape.style.transform = 'translate(0, 0) scale(1)';
                shape.style.opacity = '0.6';
            }
        });
    });
    
    // Reset shapes when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        floatingShapes.forEach(shape => {
            shape.style.transform = 'translate(0, 0) scale(1)';
            shape.style.opacity = '0.6';
        });
    });
}

// Initialize mouse repulsion on page load
window.addEventListener('load', () => {
    initMouseRepulsion();
});

// Add smooth reveal animation to timeline items
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-timeline');
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    timelineObserver.observe(item);
});

// Add CSS class for timeline animation
const style = document.createElement('style');
style.textContent = `
    .timeline-item.animate-timeline {
        opacity: 1 !important;
        transform: translateX(0) !important;
    }
`;
document.head.appendChild(style);