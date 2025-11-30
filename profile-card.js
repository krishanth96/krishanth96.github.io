class ProfileCard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            avatarUrl: options.avatarUrl || 'assets/images/profile.png',
            name: options.name || 'Krishanth Shanthikumar',
            title: options.title || 'Software Engineer',
            handle: options.handle || 'krish',
            status: options.status || 'Available for Work',
            contactText: options.contactText || 'Contact',
            enableTilt: options.enableTilt !== false,
            mobileTiltSensitivity: options.mobileTiltSensitivity || 5,
            ...options
        };

        this.ANIMATION_CONFIG = {
            INITIAL_DURATION: 1200,
            INITIAL_X_OFFSET: 70,
            INITIAL_Y_OFFSET: 60,
            DEVICE_BETA_OFFSET: 20,
            ENTER_TRANSITION_MS: 180
        };

        this.tiltState = {
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            rafId: null,
            running: false,
            lastTs: 0,
            initialUntil: 0
        };

        this.init();
    }

    clamp(v, min = 0, max = 100) {
        return Math.min(Math.max(v, min), max);
    }

    round(v, precision = 3) {
        return parseFloat(v.toFixed(precision));
    }

    adjust(v, fMin, fMax, tMin, tMax) {
        return this.round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));
    }

    init() {
        this.render();
        this.wrapRef = this.container.querySelector('.pc-card-wrapper');
        this.shellRef = this.container.querySelector('.pc-card-shell');

        if (this.options.enableTilt) {
            this.setupTilt();
        }
    }

    render() {
        const { avatarUrl, name, title } = this.options;

        this.container.innerHTML = `
      <div class="pc-card-wrapper">
        <div class="pc-behind"></div>
        <div class="pc-card-shell">
          <section class="pc-card">
            <div class="pc-inside">
              <div class="pc-shine"></div>
              <div class="pc-glare"></div>
              <div class="pc-content pc-header-content">
                <div class="pc-details">
                  <h3>${name}</h3>
                  <p>${title}</p>
                </div>
              </div>
              <div class="pc-content pc-avatar-content">
                <img class="avatar" src="${avatarUrl}" alt="${name} avatar" loading="lazy">
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
    }

    setVarsFromXY(x, y) {
        if (!this.shellRef || !this.wrapRef) return;

        const width = this.shellRef.clientWidth || 1;
        const height = this.shellRef.clientHeight || 1;

        const percentX = this.clamp((100 / width) * x);
        const percentY = this.clamp((100 / height) * y);

        const centerX = percentX - 50;
        const centerY = percentY - 50;

        const properties = {
            '--pointer-x': `${percentX}%`,
            '--pointer-y': `${percentY}%`,
            '--background-x': `${this.adjust(percentX, 0, 100, 35, 65)}%`,
            '--background-y': `${this.adjust(percentY, 0, 100, 35, 65)}%`,
            '--pointer-from-center': `${this.clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
            '--pointer-from-top': `${percentY / 100}`,
            '--pointer-from-left': `${percentX / 100}`,
            '--rotate-x': `${this.round(-(centerX / 5))}deg`,
            '--rotate-y': `${this.round(centerY / 4)}deg`
        };

        for (const [k, v] of Object.entries(properties)) {
            this.wrapRef.style.setProperty(k, v);
        }
    }

    step(ts) {
        if (!this.tiltState.running) return;

        if (this.tiltState.lastTs === 0) this.tiltState.lastTs = ts;
        const dt = (ts - this.tiltState.lastTs) / 1000;
        this.tiltState.lastTs = ts;

        const tau = ts < this.tiltState.initialUntil ? 0.6 : 0.14;
        const k = 1 - Math.exp(-dt / tau);

        this.tiltState.currentX += (this.tiltState.targetX - this.tiltState.currentX) * k;
        this.tiltState.currentY += (this.tiltState.targetY - this.tiltState.currentY) * k;

        this.setVarsFromXY(this.tiltState.currentX, this.tiltState.currentY);

        const stillFar =
            Math.abs(this.tiltState.targetX - this.tiltState.currentX) > 0.05 ||
            Math.abs(this.tiltState.targetY - this.tiltState.currentY) > 0.05;

        if (stillFar || document.hasFocus()) {
            this.tiltState.rafId = requestAnimationFrame(this.step.bind(this));
        } else {
            this.tiltState.running = false;
            this.tiltState.lastTs = 0;
        }
    }

    startTilt() {
        if (this.tiltState.running) return;
        this.tiltState.running = true;
        this.tiltState.lastTs = 0;
        this.tiltState.rafId = requestAnimationFrame(this.step.bind(this));
    }

    setTarget(x, y) {
        this.tiltState.targetX = x;
        this.tiltState.targetY = y;
        this.startTilt();
    }

    toCenter() {
        if (!this.shellRef) return;
        this.setTarget(this.shellRef.clientWidth / 2, this.shellRef.clientHeight / 2);
    }

    getOffsets(evt, el) {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    setupTilt() {
        const handlePointerMove = (event) => {
            const { x, y } = this.getOffsets(event, this.shellRef);
            this.setTarget(x, y);
        };

        const handlePointerEnter = (event) => {
            this.shellRef.classList.add('active');
            this.shellRef.classList.add('entering');

            setTimeout(() => {
                this.shellRef.classList.remove('entering');
            }, this.ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = this.getOffsets(event, this.shellRef);
            this.setTarget(x, y);
        };

        const handlePointerLeave = () => {
            this.toCenter();

            const checkSettle = () => {
                const settled = Math.hypot(
                    this.tiltState.targetX - this.tiltState.currentX,
                    this.tiltState.targetY - this.tiltState.currentY
                ) < 0.6;

                if (settled) {
                    this.shellRef.classList.remove('active');
                } else {
                    requestAnimationFrame(checkSettle);
                }
            };

            requestAnimationFrame(checkSettle);
        };

        this.shellRef.addEventListener('pointerenter', handlePointerEnter);
        this.shellRef.addEventListener('pointermove', handlePointerMove);
        this.shellRef.addEventListener('pointerleave', handlePointerLeave);

        // Initial animation
        const initialX = (this.shellRef.clientWidth || 0) - this.ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = this.ANIMATION_CONFIG.INITIAL_Y_OFFSET;

        this.tiltState.currentX = initialX;
        this.tiltState.currentY = initialY;
        this.setVarsFromXY(initialX, initialY);

        this.tiltState.initialUntil = performance.now() + this.ANIMATION_CONFIG.INITIAL_DURATION;
        this.toCenter();
        this.startTilt();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profile-card-container');
    if (profileContainer) {
        new ProfileCard(profileContainer, {
            avatarUrl: 'assets/images/profile.png',
            name: 'Krishanth Shanthikumar',
            title: 'Software Engineer & Creative Developer',
            handle: 'krish',
            status: 'Available for Work',
            contactText: 'Contact'
        });
    }
});
