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
const friction = 0.92; // Höherer Reibungskoeffizient für stärkeres Abbremsen
const inertiaThreshold = 0.01; // Mindestgeschwindigkeit für die Fortsetzung der Trägheit

function updateIconsPosition() {
    const radius = 65; // Radius in vw, passend zum Durchmesser des Kreises
    icons.forEach((icon, index) => {
        const angle = angleStep * index + currentAngle;
        const radians = angle * (Math.PI / 180);
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);
        icon.style.transform = `translate(${x}vw, ${y}vw)`; // Verwende vw, um die Positionen proportional zum Kreis zu setzen
    });
}

function handleWheel(event) {
    const deltaY = event.deltaY;
    currentAngle -= deltaY * 0.1; // Drehe den Kreis basierend auf dem Scrollen
    updateIconsPosition();
}

function handleTouchStart(event) {
    startY = event.touches[0].clientY;
    lastY = startY; // Setze die letzte Position auf die Startposition
    lastTime = Date.now(); // Setze die letzte Zeit auf den aktuellen Zeitpunkt
    isTouching = true;
    velocity = 0; // Zurücksetzen der Geschwindigkeit beim Start des Wischens
}

function handleTouchMove(event) {
    if (!isTouching) return;
    const currentY = event.touches[0].clientY;
    const currentTime = Date.now();
    const deltaY = currentY - lastY;
    const deltaTime = currentTime - lastTime;
    const speed = deltaY / deltaTime; // Berechne die Geschwindigkeit basierend auf der Zeitdifferenz
    currentAngle -= deltaY * 0.3; // Drehe den Kreis basierend auf der Wischbewegung
    lastY = currentY; // Aktualisiere die letzte Position
    lastTime = currentTime; // Aktualisiere die letzte Zeit
    velocity = speed * 3; // Reduzierter Multiplikator für die Geschwindigkeit
    updateIconsPosition();
}

function handleTouchEnd(event) {
    isTouching = false;
    applyInertia(); // Beginne die Trägheit nach dem Loslassen
}

function applyInertia() {
    if (Math.abs(velocity) > inertiaThreshold) { // Wenn die Geschwindigkeit genug groß ist, um weiter bewegt zu werden
        currentAngle -= velocity; // Drehe den Kreis basierend auf der Geschwindigkeit
        velocity *= friction; // Reduziere die Geschwindigkeit durch Reibung
        updateIconsPosition();
        requestAnimationFrame(applyInertia); // Fortfahren mit der Anwendung der Trägheit
    }
}

// Initialisiere die Positionen der Icons
updateIconsPosition();

// Event-Listener für verschiedene Eingaben
circle.addEventListener('wheel', handleWheel);
circle.addEventListener('touchstart', handleTouchStart);
circle.addEventListener('touchmove', handleTouchMove);
circle.addEventListener('touchend', handleTouchEnd);
