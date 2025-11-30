const initBackground = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Clear existing canvas
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    // Configuration
    const config = {
        direction: 'diagonal', // 'right', 'left', 'up', 'down', 'diagonal'
        speed: 0.5,
        borderColor: '#333',
        hoverBorderColor: '#FFD700', // Gold/Yellow
        hoverFillColor: '#222',
        squareSize: 50,
        gap: 0 // No gap for grid effect
    };

    let width, height;
    let squares = [];
    let mouse = { x: -1000, y: -1000 };
    let gridOffset = { x: 0, y: 0 };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initSquares();
    };

    const initSquares = () => {
        // We don't need to store individual squares if it's a uniform grid moving together
        // But for individual interactions (hover), we might want to calculate grid positions dynamically
    };

    const updateGridOffset = () => {
        switch (config.direction) {
            case 'right':
                gridOffset.x += config.speed;
                break;
            case 'left':
                gridOffset.x -= config.speed;
                break;
            case 'down':
                gridOffset.y += config.speed;
                break;
            case 'up':
                gridOffset.y -= config.speed;
                break;
            case 'diagonal':
                gridOffset.x += config.speed;
                gridOffset.y += config.speed;
                break;
        }

        // Wrap around
        if (Math.abs(gridOffset.x) >= config.squareSize) gridOffset.x = 0;
        if (Math.abs(gridOffset.y) >= config.squareSize) gridOffset.y = 0;
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        // Calculate starting positions to cover the screen including the offset
        const startX = Math.floor(gridOffset.x) % config.squareSize - config.squareSize;
        const startY = Math.floor(gridOffset.y) % config.squareSize - config.squareSize;

        const cols = Math.ceil(width / config.squareSize) + 2;
        const rows = Math.ceil(height / config.squareSize) + 2;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = startX + i * config.squareSize;
                const y = startY + j * config.squareSize;

                // Check hover
                const isHovered =
                    mouse.x >= x &&
                    mouse.x < x + config.squareSize &&
                    mouse.y >= y &&
                    mouse.y < y + config.squareSize;

                ctx.beginPath();
                ctx.rect(x, y, config.squareSize, config.squareSize);

                if (isHovered) {
                    ctx.fillStyle = config.hoverFillColor;
                    ctx.fill();
                    ctx.strokeStyle = config.hoverBorderColor;
                    ctx.lineWidth = 2; // Thicker border on hover
                } else {
                    ctx.strokeStyle = config.borderColor;
                    ctx.lineWidth = 1;
                }

                ctx.stroke();
            }
        }
    };

    const animate = () => {
        updateGridOffset();
        draw();
        requestAnimationFrame(animate);
    };

    // Event Listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Initialize
    resize();
    animate();
};

document.addEventListener('DOMContentLoaded', initBackground);
