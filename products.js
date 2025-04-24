const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://api.termegs.cloud';

let editingProductId = null;
let currentImage = null;

// Időbélyeg formázása
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}.`;
}

// Legutóbbi termékek betöltése
async function loadRecentProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Hiba történt a termékek betöltése során');
        }
        const products = await response.json();
        displayRecentProducts(products.slice(0, 2)); // Csak az első 2 terméket jelenítjük meg
    } catch (error) {
        console.error('Hiba:', error);
        document.getElementById('recentProducts').innerHTML = `
            <div class="alert alert-danger">
                Hiba történt a termékek betöltése során: ${error.message}
            </div>`;
    }
}

function displayRecentProducts(products) {
    const recentProductsContainer = document.getElementById('recentProducts');
    if (!recentProductsContainer) return;

    if (!products || products.length === 0) {
        recentProductsContainer.innerHTML = '<p class="text-muted">Nincsenek legutóbb felvett termékek.</p>';
        return;
    }

    const productsHtml = products.map(product => `
        <div class="card">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between mb-3">
                    <div>
                        <h6 class="card-title mb-1">${product.hungarianName}</h6>
                        <p class="card-text text-muted mb-1" style="font-size: 0.9rem;">${product.czechName || ''}</p>
                        <p class="card-text mb-2">
                            <small class="text-muted"><i class="bi bi-upc-scan"></i> ${product.articleNumber}</small>
                        </p>
                    </div>
                    ${product.image ? `
                        <img src="${product.image}" alt="${product.hungarianName}" 
                             style="width: 80px; height: 80px; object-fit: contain; border-radius: 4px; border: 1px solid #dee2e6;">
                    ` : ''}
                </div>
                <div class="d-flex gap-2 mb-3">
                    <span class="badge bg-primary">
                        ${product.packaging === 'capsule' ? 
                            `<i class="bi bi-capsule"></i> ${product.capsuleCount} db` :
                            `<i class="bi bi-droplet-fill"></i> ${product.liquidVolume} ml`
                        }
                    </span>
                    ${product.weight ? `
                        <span class="badge bg-secondary">
                            <i class="bi bi-box-seam"></i> ${product.weight} g
                        </span>
                    ` : ''}
                </div>
                <div class="timestamps mb-3">
                    <div class="text-muted small">
                        <i class="bi bi-calendar-plus"></i> Felvéve: ${formatTimestamp(product.createdAt)}
                    </div>
                    ${product.updatedAt && product.updatedAt !== product.createdAt ? `
                        <div class="text-muted small">
                            <i class="bi bi-calendar-check"></i> Módosítva: ${formatTimestamp(product.updatedAt)}
                        </div>
                    ` : ''}
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${product._id}">
                        <i class="bi bi-pencil"></i> Módosítás
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">
                        <i class="bi bi-trash"></i> Törlés
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    recentProductsContainer.innerHTML = `
        <div class="recent-products-grid">
            ${productsHtml}
        </div>
    `;

    // Add click handlers for action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.id;
            window.location.href = `products.html?id=${productId}`;
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.id;
            if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
                deleteProduct(productId);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const packagingType = document.getElementById("packagingType");
    const capsuleCountContainer = document.getElementById("capsuleCountContainer");
    const liquidVolumeContainer = document.getElementById("liquidVolumeContainer");
    const pageTitle = document.getElementById("pageTitle");

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Betöltjük a legutóbbi termékeket
    loadRecentProducts();

    if (productId) {
        editingProductId = productId;
        pageTitle.textContent = "Termék szerkesztése";
        loadProductData(productId);
    }

    packagingType.addEventListener("change", () => {
        if (packagingType.value === "capsule") {
            capsuleCountContainer.style.display = "block";
            liquidVolumeContainer.style.display = "none";
            document.getElementById("liquidVolume").value = "";
        } else if (packagingType.value === "liquid") {
            capsuleCountContainer.style.display = "none";
            liquidVolumeContainer.style.display = "block";
            document.getElementById("capsuleCount").value = "";
        }
    });

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form beküldés kezdődik...");

        try {
            const formData = {
                hungarianName: document.getElementById("nameMagyar").value,
                czechName: document.getElementById("nameCzech").value,
                articleNumber: document.getElementById("articleNumber").value,
                description: document.getElementById("description").value,
                packaging: document.getElementById("packagingType").value,
                label: document.getElementById("label")?.value || "",
                image: document.getElementById("imageUrl").value,
                weight: parseFloat(document.getElementById("weight").value) || null
            };

            // Csomagolás típus kezelése
            if (formData.packaging === "capsule") {
                formData.capsuleCount = parseInt(document.getElementById("capsuleCount").value) || 0;
                formData.liquidVolume = 0;
            } else {
                formData.liquidVolume = parseInt(document.getElementById("liquidVolume").value) || 0;
                formData.capsuleCount = 0;
            }

            console.log("Küldendő adatok:", formData);

            const url = editingProductId 
                ? `${API_BASE_URL}/api/products/${editingProductId}`
                : `${API_BASE_URL}/api/products`;

            const response = await fetch(url, {
                method: editingProductId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Sikeres mentés:", result);
            
            alert("Termék sikeresen mentve!");
            
            // Űrlap alaphelyzetbe állítása új termék esetén
            if (!editingProductId) {
                productForm.reset();
            }
            
            // Legutóbbi termékek frissítése
            loadRecentProducts();
            
        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba történt a mentés során: " + error.message);
        }
    });
});

async function loadProductData(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!response.ok) {
            throw new Error("Hiba történt a termék betöltése során");
        }
        
        const product = await response.json();
        
        document.getElementById("nameMagyar").value = product.hungarianName;
        document.getElementById("nameCzech").value = product.czechName;
        document.getElementById("articleNumber").value = product.articleNumber;
        document.getElementById("description").value = product.description || "";
        document.getElementById("packagingType").value = product.packaging;
        document.getElementById("weight").value = product.weight || "";

        if (product.packaging === "capsule") {
            document.getElementById("capsuleCount").value = product.capsuleCount;
            document.getElementById("capsuleCountContainer").style.display = "block";
            document.getElementById("liquidVolumeContainer").style.display = "none";
        } else if (product.packaging === "liquid") {
            document.getElementById("liquidVolume").value = product.liquidVolume;
            document.getElementById("liquidVolumeContainer").style.display = "block";
            document.getElementById("capsuleCountContainer").style.display = "none";
        }

        if (product.image) {
            currentImage = product.image;
            document.getElementById("imageUrl").value = product.image;
        }

        // Időbélyegek megjelenítése az új formátumban
        if (product.createdAt) {
            document.getElementById("createdAt").textContent = `Létrehozva: ${formatTimestamp(product.createdAt)}`;
        }
        if (product.updatedAt) {
            document.getElementById("updatedAt").textContent = `Módosítva: ${formatTimestamp(product.updatedAt)}`;
        }
    } catch (error) {
        console.error("Hiba:", error);
        alert("Hiba történt a termék betöltése során");
    }
}

function getFormData() {
    return {
        hungarianName: document.getElementById('nameMagyar').value,
        czechName: document.getElementById('nameCzech').value,
        articleNumber: document.getElementById('articleNumber').value,
        description: document.getElementById('description').value,
        image: document.getElementById('imageUrl').value,
        packaging: document.getElementById('packagingType').value,
        capsuleCount: document.getElementById('capsuleCount').value ? parseInt(document.getElementById('capsuleCount').value) : null,
        liquidVolume: document.getElementById('liquidVolume').value ? parseInt(document.getElementById('liquidVolume').value) : null,
        weight: document.getElementById('weight').value ? parseFloat(document.getElementById('weight').value) : null
    };
}

function setFormData(product) {
    document.getElementById('nameMagyar').value = product.hungarianName || '';
    document.getElementById('nameCzech').value = product.czechName || '';
    document.getElementById('articleNumber').value = product.articleNumber || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('imageUrl').value = product.image || '';
    document.getElementById('packagingType').value = product.packaging || '';
    document.getElementById('capsuleCount').value = product.capsuleCount || '';
    document.getElementById('liquidVolume').value = product.liquidVolume || '';
    document.getElementById('weight').value = product.weight || '';
    
    // Show/hide packaging specific inputs
    handlePackagingTypeChange();
} 