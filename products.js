let editingIndex = -1;
let currentImage = null;

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const packagingType = document.getElementById('packagingType');
    const capsuleCountContainer = document.getElementById('capsuleCountContainer');
    const liquidVolumeContainer = document.getElementById('liquidVolumeContainer');
    const pageTitle = document.getElementById('pageTitle');

    // Ellenőrizzük, hogy szerkesztés módban vagyunk-e
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');
    let products = JSON.parse(localStorage.getItem('products') || '[]');

    // Kiszerelés típus változásának kezelése
    packagingType.addEventListener('change', () => {
        if (packagingType.value === 'capsule') {
            capsuleCountContainer.style.display = 'block';
            liquidVolumeContainer.style.display = 'none';
            document.getElementById('liquidVolume').value = '';
        } else {
            capsuleCountContainer.style.display = 'none';
            liquidVolumeContainer.style.display = 'block';
            document.getElementById('capsuleCount').value = '';
        }
    });

    // Kép előnézet kezelése
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Ha szerkesztés módban vagyunk, betöltjük a termék adatait
    if (editIndex !== null) {
        const product = products[editIndex];
        if (product) {
            pageTitle.textContent = 'Termék szerkesztése';
            document.getElementById('nameMagyar').value = product.nameMagyar;
            document.getElementById('nameCzech').value = product.nameCzech;
            document.getElementById('articleNumber').value = product.articleNumber;
            document.getElementById('packagingType').value = product.packagingType;

            if (product.packagingType === 'capsule') {
                document.getElementById('capsuleCount').value = product.packagingAmount;
                capsuleCountContainer.style.display = 'block';
                liquidVolumeContainer.style.display = 'none';
            } else {
                document.getElementById('liquidVolume').value = product.packagingAmount;
                capsuleCountContainer.style.display = 'none';
                liquidVolumeContainer.style.display = 'block';
            }

            if (product.image) {
                imagePreview.src = product.image;
                imagePreview.style.display = 'block';
            }
        }
    }

    // Form beküldés kezelése
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            nameMagyar: document.getElementById('nameMagyar').value,
            nameCzech: document.getElementById('nameCzech').value,
            articleNumber: document.getElementById('articleNumber').value,
            packagingType: packagingType.value,
            packagingAmount: packagingType.value === 'capsule' 
                ? document.getElementById('capsuleCount').value 
                : document.getElementById('liquidVolume').value
        };

        // Kép feldolgozása
        const imageFile = imageInput.files[0];
        if (imageFile) {
            formData.image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(imageFile);
            });
        } else if (editIndex !== null && products[editIndex].image) {
            formData.image = products[editIndex].image;
        }

        if (editIndex !== null) {
            // Meglévő termék frissítése
            products[editIndex] = formData;
        } else {
            // Új termék hozzáadása
            products.push(formData);
        }

        localStorage.setItem('products', JSON.stringify(products));
        window.location.href = 'product-list.html';
    });
});

function loadProductData(product) {
    document.getElementById('hungarianName').value = product.hungarianName;
    document.getElementById('czechName').value = product.czechName;
    document.getElementById('description').value = product.description;
    document.getElementById('articleNumber').value = product.articleNumber;
    document.getElementById('packagingType').value = product.packagingType;

    if (product.packagingType === 'kapszula') {
        document.getElementById('liquidAmount').style.display = 'none';
        document.getElementById('capsuleCount').style.display = 'block';
        document.getElementById('capsuleAmount').value = product.packagingAmount;
        document.getElementById('packagingAmount').disabled = true;
    } else {
        document.getElementById('packagingAmount').value = product.packagingAmount;
    }

    if (product.image) {
        currentImage = product.image;
        document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" alt="Előnézet">`;
    }
} 