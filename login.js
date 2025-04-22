document.addEventListener('DOMContentLoaded', () => {
    // Ellenőrizzük, hogy be van-e jelentkezve
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Itt ellenőrizzük a bejelentkezési adatokat
            const isValid = await checkCredentials(email, password);
            
            if (isValid) {
                // Sikeres bejelentkezés
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                showError('Hibás email cím vagy jelszó!');
            }
        } catch (error) {
            showError('Hiba történt a bejelentkezés során. Kérjük, próbálja újra!');
        }
    });
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Ideiglenesen egy egyszerű ellenőrzés (ezt később biztonságosabbra kell cserélni)
async function checkCredentials(email, password) {
    // Itt később implementáljuk a valódi bejelentkezési logikát
    // Egyelőre csak demonstrációs célból:
    return email === 'admin@termegs.cloud' && password === 'admin123';
} 