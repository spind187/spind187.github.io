const circle = document.querySelector('.circle');
const icons = document.querySelectorAll('.icon');
const iconCount = icons.length;
const angleStep = 360 / iconCount;
let currentAngle = 0;
let startY = 0;
let isTouching = false;

function updateIconsPosition() {
    const radius = 75; // Radius in vw, passend zum Durchmesser des Kreises
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
    isTouching = true;
}

function handleTouchMove(event) {
    if (!isTouching) return;
    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startY;
    currentAngle -= deltaY * 0.3;
    startY = currentY;
    updateIconsPosition();
}

function handleTouchEnd() {
    isTouching = false;
}

document.getElementById('qrIcon').addEventListener('click', function() {
    document.getElementById('qrContainer').style.display = 'block';
});

document.getElementById('generateQR').addEventListener('click', function() {
    const link = document.getElementById('linkInput').value;
    if (link) {
        const qrCodeContainer = document.getElementById('qrCode');
        qrCodeContainer.innerHTML = ''; // Clear previous QR code

        const qr = new QRious({
            element: qrCodeContainer.appendChild(document.createElement('canvas')),
            value: link,
            size: 200 // Size of the QR code
        });
    }
});

document.getElementById('closeQR').addEventListener('click', function() {
    document.getElementById('qrContainer').style.display = 'none';
});

document.addEventListener('click', function(event) {
    const qrContainer = document.getElementById('qrContainer');
    if (event.target === qrContainer) {
        qrContainer.style.display = 'none';
    }
});

updateIconsPosition();
circle.addEventListener('wheel', handleWheel);
circle.addEventListener('touchstart', handleTouchStart);
circle.addEventListener('touchmove', handleTouchMove);
circle.addEventListener('touchend', handleTouchEnd);
