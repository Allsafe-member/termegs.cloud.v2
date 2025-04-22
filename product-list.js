document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    
    // Termékek betöltése és megjelenítése
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        displayProducts(products);
    }

    // Termékek megjelenítése
    function displayProducts(products) {
        if (products.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">Nincsenek még termékek felvéve.</div>';
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.hungarianName}">
                </div>
                <div class="product-info">
                    <h2>${product.hungarianName}</h2>
                    <p>${product.czechName}</p>
                    <p class="article-number">Cikkszám: ${product.articleNumber}</p>
                    <p class="packaging">
                        Kiszerelés: ${product.packaging.amount}${product.packaging.type}
                        ${product.packaging.capsuleCount ? ` (${product.packaging.capsuleCount} db)` : ''}
                    </p>
                    <p>${product.description}</p>
                    <p class="modified">Módosítva: ${new Date(product.modifiedAt).toLocaleString()}</p>
                </div>
            </div>
        `).join('');
    }

    // Keresés funkció
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        const filteredProducts = products.filter(product => 
            product.hungarianName.toLowerCase().includes(searchTerm) ||
            product.czechName.toLowerCase().includes(searchTerm) ||
            product.articleNumber.toLowerCase().includes(searchTerm)
        );

        displayProducts(filteredProducts);
    });

    // Kezdeti betöltés
    loadProducts();
}); 