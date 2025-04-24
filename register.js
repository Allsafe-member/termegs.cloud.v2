const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://api.termegs.cloud';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Alapvető validáció
        if (password !== confirmPassword) {
            showError('A megadott jelszavak nem egyeznek!');
            return;
        }

        if (password.length < 8) {
            showError('A jelszónak legalább 8 karakter hosszúnak kell lennie!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Sikeres regisztráció! Kérjük, ellenőrizze email fiókját a megerősítő linkért.');
                registerForm.reset();
            } else {
                showError(data.message || 'Hiba történt a regisztráció során.');
            }
        } catch (error) {
            showError('Hiba történt a regisztráció során. Kérjük, próbálja újra!');
        }
    });
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
} 