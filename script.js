const circle = document.querySelector('.circle');
const icons = document.querySelectorAll('.icon');
const iconCount = icons.length;
const angleStep = 360 / iconCount;
let currentAngle = 0;
let startY = 0;
let lastY = 0;
let isTouching = false;
let velocity = 0;
let lastTime = 0;
const friction = 0.95;
const inertiaThreshold = 0.01;

function updateIconsPosition() {
    const radius = 65; // Radius in vw
    icons.forEach((icon, index) => {
        const angle = angleStep * index + currentAngle;
        const radians = angle * (Math.PI / 180);
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);
        icon.style.transform = `translate(${x}vw, ${y}vw)`;
    });
}

function handleWheel(event) {
    const deltaY = event.deltaY;
    currentAngle -= deltaY * 0.1;
    updateIconsPosition();
}

function handleTouchStart(event) {
    startY = event.touches[0].clientY;
    lastY = startY;
    lastTime = Date.now();
    isTouching = true;
    velocity = 0;
}

function handleTouchMove(event) {
    if (!isTouching) return;
    const currentY = event.touches[0].clientY;
    const deltaY = currentY - lastY;
    currentAngle -= deltaY * 0.3;
    lastY = currentY;
    
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    velocity = deltaY / timeDelta;
    lastTime = currentTime;
    updateIconsPosition();
}

function handleTouchEnd() {
    isTouching = false;
    update();
}

function update() {
    if (Math.abs(velocity) > inertiaThreshold) {
        currentAngle -= velocity;
        velocity *= friction;
        updateIconsPosition();
        requestAnimationFrame(update);
    }
}

updateIconsPosition();
circle.addEventListener('wheel', handleWheel);
circle.addEventListener('touchstart', handleTouchStart);
circle.addEventListener('touchmove', handleTouchMove);
circle.addEventListener('touchend', handleTouchEnd);

const qrCodeModal = document.getElementById('qrCodeModal');
const closeModal = document.querySelector('.close');
const generateQRCodeButton = document.getElementById('generateQRCode');
const qrCodeInput = document.getElementById('qrCodeInput');

document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', () => {
        qrCodeModal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => {
    qrCodeModal.style.display = 'none';
});

generateQRCodeButton.addEventListener('click', () => {
    const qrCodeText = qrCodeInput.value;
    if (qrCodeText) {
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeText)}`;
        qrCodeContainer.innerHTML = `<img src="${qrCodeURL}" alt="QR Code">`;
    }
});
