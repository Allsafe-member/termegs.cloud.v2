const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://api.termegs.cloud';

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

        console.log('Bejelentkezési kísérlet:', { email });

        try {
            const response = await checkCredentials(email, password);
            console.log('Szerver válasz:', response);
            
            if (response && response.token) {
                // Sikeres bejelentkezés
                console.log('Sikeres bejelentkezés, token megérkezett');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', response.user.fullName);
                window.location.href = 'index.html';
            } else {
                console.log('Nincs token a válaszban');
                showError('Hibás email cím vagy jelszó!');
            }
        } catch (error) {
            console.error('Bejelentkezési hiba:', error);
            showError(error.message || 'Hiba történt a bejelentkezés során. Kérjük, próbálja újra!');
        }
    });
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    console.log('Hibaüzenet megjelenítve:', message);
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

async function checkCredentials(email, password) {
    try {
        console.log('Kérés küldése a szervernek...');
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Nyers szerver válasz:', response.status, response.statusText);
        
        if (!response.ok) {
            if (response.status === 405) {
                throw new Error('A szerver nem fogadja el a POST kérést. Kérjük, ellenőrizze a beállításokat.');
            }
            const errorData = await response.text();
            console.error('Szerver hibaüzenet:', errorData);
            throw new Error('Hibás email cím vagy jelszó!');
        }

        const data = await response.json();
        console.log('Feldolgozott szerver válasz:', data);
        
        return data;
    } catch (error) {
        console.error('Hálózati vagy szerver hiba:', error);
        throw new Error(error.message || 'Hiba történt a szerverrel való kommunikáció során');
    }
} 