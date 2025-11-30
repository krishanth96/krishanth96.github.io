const init3DElement = () => {
    const container = document.getElementById('about-3d-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFFD700, 0.5);
    pointLight.position.set(-5, 3, 2);
    scene.add(pointLight);

    // Create cartoon developer character
    const createDeveloper = () => {
        const developer = new THREE.Group();

        // Materials
        const skinMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        const shirtMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        const pantsMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        const hairMaterial = new THREE.MeshPhongMaterial({ color: 0x2c1810 });
        const laptopMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const screenMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
        });
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        // Head
        const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = 1.8;
        head.scale.y = 1.1;
        developer.add(head);

        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.1;
        developer.add(hair);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 1.9, 0.5);
        developer.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 1.9, 0.5);
        developer.add(rightEye);

        // Glasses
        const glassesGroup = new THREE.Group();
        const glassGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16);
        const glassMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const leftGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        leftGlass.position.set(-0.2, 1.9, 0.55);
        leftGlass.rotation.y = Math.PI / 2;
        glassesGroup.add(leftGlass);

        const rightGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        rightGlass.position.set(0.2, 1.9, 0.55);
        rightGlass.rotation.y = Math.PI / 2;
        glassesGroup.add(rightGlass);

        // Bridge
        const bridgeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const bridge = new THREE.Mesh(bridgeGeometry, glassMaterial);
        bridge.position.set(0, 1.9, 0.55);
        bridge.rotation.z = Math.PI / 2;
        glassesGroup.add(bridge);

        developer.add(glassesGroup);

        // Body (torso)
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 32);
        const body = new THREE.Mesh(bodyGeometry, shirtMaterial);
        body.position.y = 0.6;
        developer.add(body);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 16);

        const leftArm = new THREE.Mesh(armGeometry, shirtMaterial);
        leftArm.position.set(-0.6, 0.8, 0);
        leftArm.rotation.z = Math.PI / 6;
        developer.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, shirtMaterial);
        rightArm.position.set(0.6, 0.8, 0);
        rightArm.rotation.z = -Math.PI / 6;
        developer.add(rightArm);

        // Hands
        const handGeometry = new THREE.SphereGeometry(0.12, 16, 16);

        const leftHand = new THREE.Mesh(handGeometry, skinMaterial);
        leftHand.position.set(-0.75, 0.4, 0.2);
        developer.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, skinMaterial);
        rightHand.position.set(0.75, 0.4, 0.2);
        developer.add(rightHand);

        // Laptop
        const laptopBase = new THREE.BoxGeometry(1, 0.05, 0.7);
        const laptop = new THREE.Mesh(laptopBase, laptopMaterial);
        laptop.position.set(0, 0.3, 0.4);
        laptop.rotation.x = -Math.PI / 12;
        developer.add(laptop);

        // Laptop screen
        const screenGeometry = new THREE.BoxGeometry(0.95, 0.6, 0.05);
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.6, 0.05);
        screen.rotation.x = -Math.PI / 3;
        developer.add(screen);

        // Code lines on screen
        const codeLineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        for (let i = 0; i < 4; i++) {
            const lineGeometry = new THREE.BoxGeometry(0.6, 0.03, 0.01);
            const line = new THREE.Mesh(lineGeometry, codeLineMaterial);
            line.position.set(0, 0.6 + (i * 0.1) - 0.15, 0.08);
            line.rotation.x = -Math.PI / 3;
            developer.add(line);
        }

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.6, 16);

        const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        leftLeg.position.set(-0.25, -0.3, 0);
        developer.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        rightLeg.position.set(0.25, -0.3, 0);
        developer.add(rightLeg);

        return developer;
    };

    const developer = createDeveloper();
    scene.add(developer);

    // Position camera
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 1, 0);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;

    const onMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        targetRotationY = mouseX * 0.3;
    };

    container.addEventListener('mousemove', onMouseMove);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Gentle floating animation
        developer.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

        // Smooth rotation based on mouse
        developer.rotation.y += (targetRotationY - developer.rotation.y) * 0.05;

        // Auto rotation when not hovering
        if (Math.abs(mouseX) < 0.01) {
            developer.rotation.y = Math.sin(elapsedTime * 0.2) * 0.3;
        }

        renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
};

document.addEventListener('DOMContentLoaded', init3DElement);
