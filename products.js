let editingProductId = null;
let currentImage = null;

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const imageInput = document.getElementById('imageInput');
    const imageUrl = document.getElementById('imageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const packagingType = document.getElementById('packagingType');
    const capsuleCountContainer = document.getElementById('capsuleCountContainer');
    const liquidVolumeContainer = document.getElementById('liquidVolumeContainer');
    const pageTitle = document.getElementById('pageTitle');

    // Ellenőrizzük, hogy szerkesztés módban vagyunk-e
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        editingProductId = productId;
        pageTitle.textContent = 'Termék szerkesztése';
        loadProductData(productId);
    }

    // Kiszerelés típus változásának kezelése
    packagingType.addEventListener('change', () => {
        if (packagingType.value === 'capsule') {
            capsuleCountContainer.style.display = 'block';
            liquidVolumeContainer.style.display = 'none';
            document.getElementById('liquidVolume').value = '';
        } else if (packagingType.value === 'bottle') {
            capsuleCountContainer.style.display = 'none';
            liquidVolumeContainer.style.display = 'block';
            document.getElementById('capsuleCount').value = '';
        }
    });

    // Kép URL kezelése
    imageUrl.addEventListener('change', (e) => {
        if (e.target.value) {
            imagePreview.src = e.target.value;
            imagePreview.style.display = 'block';
            imageInput.value = ''; // Töröljük a file inputot
        }
    });

    // Kép fájl feltöltés kezelése
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                imageUrl.value = ''; // Töröljük az URL inputot
            };
            reader.readAsDataURL(file);
        }
    });

    // Form beküldés kezelése
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            hungarianName: document.getElementById('nameMagyar').value,
            czechName: document.getElementById('nameCzech').value,
            articleNumber: document.getElementById('articleNumber').value,
            packaging: packagingType.value,
            label: document.getElementById('label').value
        };

        // Mennyiség beállítása a kiszerelés típusa alapján
        if (packagingType.value === 'capsule') {
            formData.capsuleCount = document.getElementById('capsuleCount').value;
        } else if (packagingType.value === 'bottle') {
            formData.liquidVolume = document.getElementById('liquidVolume').value;
        }

        // Kép kezelése
        if (imageUrl.value) {
            formData.image = imageUrl.value;
        } else {
            const imageFile = imageInput.files[0];
            if (imageFile) {
                formData.image = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageFile);
                });
            } else if (currentImage) {
                formData.image = currentImage;
            }
        }

        try {
            const url = editingProductId 
                ? `http://localhost:3000/products/${editingProductId}`
                : 'http://localhost:3000/products';

            const response = await fetch(url, {
                method: editingProductId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Hiba történt a mentés során');
            }

            window.location.href = 'product-list.html';
        } catch (error) {
            console.error('Hiba:', error);
            alert('Hiba történt a mentés során');
        }
    });
});

async function loadProductData(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
            throw new Error('Hiba történt a termék betöltése során');
        }
        
        const product = await response.json();
        
        document.getElementById('nameMagyar').value = product.hungarianName;
        document.getElementById('nameCzech').value = product.czechName;
        document.getElementById('articleNumber').value = product.articleNumber;
        document.getElementById('packagingType').value = product.packaging;
        document.getElementById('label').value = product.label || '';

        if (product.packaging === 'capsule') {
            document.getElementById('capsuleCount').value = product.capsuleCount;
            document.getElementById('capsuleCountContainer').style.display = 'block';
        } else if (product.packaging === 'bottle') {
            document.getElementById('liquidVolume').value = product.liquidVolume;
            document.getElementById('liquidVolumeContainer').style.display = 'block';
        }

        if (product.image) {
            if (product.image.startsWith('data:')) {
                document.getElementById('imagePreview').src = product.image;
            } else {
                document.getElementById('imageUrl').value = product.image;
                document.getElementById('imagePreview').src = product.image;
            }
            document.getElementById('imagePreview').style.display = 'block';
            currentImage = product.image;
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termék betöltése során');
    }
} 