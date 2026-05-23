function playClickSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
    audio.volume = 0.3;
    audio.play().catch(() => {});
}

document.querySelectorAll('button, .btn-danger, .btn-survive, .btn-secondary').forEach(button => {
    button.addEventListener('click', playClickSound);
    
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Error registrando Service Worker:', error);
            });
    });
}