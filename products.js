document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const imageUrl = document.getElementById('imageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const packagingType = document.getElementById('packagingType');
    const capsuleCount = document.getElementById('capsuleCount');

    // Kép előnézet
    imageUrl.addEventListener('input', () => {
        const url = imageUrl.value;
        if (url) {
            imagePreview.innerHTML = `<img src="${url}" alt="Termék előnézet">`;
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Kapszula mennyiség mező megjelenítése/elrejtése
    packagingType.addEventListener('change', () => {
        if (packagingType.value === 'kapszula') {
            capsuleCount.style.display = 'block';
            document.getElementById('capsuleAmount').required = true;
        } else {
            capsuleCount.style.display = 'none';
            document.getElementById('capsuleAmount').required = false;
        }
    });

    // Űrlap beküldése
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const product = {
            imageUrl: document.getElementById('imageUrl').value,
            hungarianName: document.getElementById('hungarianName').value,
            czechName: document.getElementById('czechName').value,
            description: document.getElementById('description').value,
            articleNumber: document.getElementById('articleNumber').value,
            packaging: {
                type: document.getElementById('packagingType').value,
                amount: document.getElementById('packagingAmount').value,
                capsuleCount: document.getElementById('packagingType').value === 'kapszula' 
                    ? document.getElementById('capsuleAmount').value 
                    : null
            },
            modifiedAt: new Date().toISOString()
        };

        // Termék mentése a localStorage-ba
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        // Űrlap törlése és visszajelzés
        productForm.reset();
        imagePreview.innerHTML = '';
        alert('Termék sikeresen mentve!');
    });
}); 