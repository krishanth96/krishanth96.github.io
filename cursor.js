// Target Cursor Implementation
class TargetCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorRing = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isHovering = false;

        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'target-cursor';

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';

        this.cursorRing = document.createElement('div');
        this.cursorRing.className = 'cursor-ring';

        this.cursor.appendChild(this.cursorDot);
        this.cursor.appendChild(this.cursorRing);
        document.body.appendChild(this.cursor);

        // Event listeners
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Detect hoverable elements
        const hoverElements = 'a, button, .btn, .project-card, .skill-card, .nav-link';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverElements)) {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverElements)) {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            }
        });

        // Start animation
        this.animate();
    }

    animate() {
        // Smooth follow with easing
        const ease = 0.15;
        this.currentX += (this.mouseX - this.currentX) * ease;
        this.currentY += (this.mouseY - this.currentY) * ease;

        this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-touch devices
    if (!('ontouchstart' in window)) {
        new TargetCursor();
    }
});
